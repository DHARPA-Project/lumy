import logging
from typing import Dict, List, Optional, Tuple

from dharpa.vre.context.context import UpdatedIO
from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types.generated import (DataTabularDataFilter,
                                        MsgModuleIOGetInputValues,
                                        MsgModuleIOGetTabularInputValue,
                                        MsgModuleIOInputValuesUpdated,
                                        MsgModuleIOTabularInputValueUpdated,
                                        MsgModuleIOUnregisterTabularInputView,
                                        MsgModuleIOUpdateInputValues)
from dharpa.vre.utils.codec import serialize_filtered_table, serialize
from dharpa.vre.utils.dataclasses import to_dict

logger = logging.getLogger(__name__)

DEFAULT_TABULAR_FILTER = DataTabularDataFilter(
    offset=0,
    page_size=5
)


class TabularViewsFilters:
    _store: Dict[Tuple[str, str, str], DataTabularDataFilter] = dict()

    def get(self,
            step_id: str,
            input_id: str,
            view_id: str) -> Optional[DataTabularDataFilter]:
        key = (step_id, input_id, view_id)
        return self._store.get(key, None)

    def set(self,
            step_id: str,
            input_id: str,
            view_id: str,
            filter: DataTabularDataFilter) -> DataTabularDataFilter:
        key = (step_id, input_id, view_id)
        self._store[key] = filter
        return filter

    def remove(self, step_id: str, input_id: str, view_id: str):
        key = (step_id, input_id, view_id)
        if key in self._store:
            del self._store[key]

    def get_views(
        self,
        step_id: str,
        input_id: str
    ) -> List[Tuple[str, DataTabularDataFilter]]:
        return [
            (view_id, filter)
            for (s_id, i_id, view_id), filter in self._store.items()
            if s_id == step_id and i_id == input_id
        ]


class ModuleIOHandler(MessageHandler):

    _tabular_views_filters = TabularViewsFilters()

    def initialize(self):
        self.context.step_input_values_updated.subscribe(
            self._on_inputs_updated)

    def _on_inputs_updated(self, msg: UpdatedIO):
        # 1. handle values with basic types and complex values stats
        if len(msg.io_ids) > 0:
            values = self.context.get_step_input_values(
                msg.step_id, input_ids=msg.io_ids)
            values = {k: serialize(v) for k, v in values.items()}

            self.publisher.publish(MsgModuleIOInputValuesUpdated(
                msg.step_id,
                values
            ))

        # 2. handle tabular values with view
        for input_id in msg.io_ids:
            items = self._tabular_views_filters.get_views(
                msg.step_id, input_id)
            for view_id, filter in items:
                filtered_table = self.context.get_step_tabular_input_value(
                    msg.step_id, input_id, filter)
                table = self.context.get_step_tabular_input_value(
                    msg.step_id, input_id)

                if filtered_table is not None:
                    self.publisher.publish(MsgModuleIOTabularInputValueUpdated(
                        view_id=view_id,
                        step_id=msg.step_id,
                        input_id=input_id,
                        filter=filter,
                        value=to_dict(serialize_filtered_table(
                            filtered_table, table))
                    ))

    def _handle_GetInputValues(self, msg: MsgModuleIOGetInputValues):
        '''
        Return workflow step input values.
        '''
        values = self.context.get_step_input_values(
            msg.id)

        self.publisher.publish(MsgModuleIOInputValuesUpdated(
            msg.id,
            values
        ))

    def _handle_UpdateInputValues(self, msg: MsgModuleIOUpdateInputValues):
        values = self.context.update_step_input_values(
            msg.id,
            msg.input_values
        )

        self.publisher.publish(MsgModuleIOInputValuesUpdated(
            msg.id,
            values
        ))

        # TODO: This is here temporary for dev purposes
        self.context.run_processing(msg.id)

    def _handle_GetTabularInputValue(self,
                                     msg: MsgModuleIOGetTabularInputValue):
        input_id = msg.input_id
        filter = msg.filter or DEFAULT_TABULAR_FILTER
        self._tabular_views_filters.set(
            msg.step_id, input_id, msg.view_id, filter)

        filtered_table = self.context.get_step_tabular_input_value(
            msg.step_id, input_id, filter)
        table = self.context.get_step_tabular_input_value(
            msg.step_id, input_id)

        if filtered_table is not None:
            self.publisher.publish(MsgModuleIOTabularInputValueUpdated(
                view_id=msg.view_id,
                step_id=msg.step_id,
                input_id=input_id,
                filter=filter,
                value=to_dict(serialize_filtered_table(filtered_table, table))
            ))

    def _handle_UnregisterTabularInputView(
        self,
        msg: MsgModuleIOUnregisterTabularInputView
    ):
        self._tabular_views_filters.remove(
            msg.step_id, msg.input_id, msg.view_id
        )
