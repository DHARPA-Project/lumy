import logging

from dharpa.vre.context.context import UpdatedIO
from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types.generated import (MsgModuleIOGetInputValues,
                                        MsgModuleIOGetTabularInputValue,
                                        MsgModuleIOInputValuesUpdated,
                                        MsgModuleIOTabularInputValueUpdated,
                                        MsgModuleIOUpdateInputValues)
from dharpa.vre.utils.codec import serialize_filtered_table
from dharpa.vre.utils.dataclasses import to_dict
from stringcase import camelcase, snakecase

logger = logging.getLogger(__name__)


class ModuleIOHandler(MessageHandler):

    def initialize(self):
        self.context.step_input_values_updated.subscribe(
            self._on_inputs_updated)

    def _on_inputs_updated(self, msg: UpdatedIO):
        non_tabular_inputs_ids = []
        for input_id in msg.io_ids:
            if self.context.is_tabular_input(msg.step_id, input_id):
                filter = self.context.get_step_tabular_input_filter(
                    msg.step_id, input_id)
                filtered_table = self.context.get_step_tabular_input_value(
                    msg.step_id, input_id, filter)
                values = self.context.get_step_input_values(
                    msg.step_id, input_ids=[input_id], include_tabular=True)
                table = values[input_id]
                self.publisher.publish(MsgModuleIOTabularInputValueUpdated(
                    id=msg.step_id,
                    input_id=camelcase(input_id),
                    filter=filter,
                    value=to_dict(serialize_filtered_table(
                        filtered_table, table))
                ))
            else:
                non_tabular_inputs_ids.append(input_id)

        if len(non_tabular_inputs_ids) > 0:
            values = self.context.get_step_input_values(
                msg.step_id, input_ids=non_tabular_inputs_ids)

            self.publisher.publish(MsgModuleIOInputValuesUpdated(
                msg.step_id,
                values
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
        input_id = snakecase(msg.input_id)
        filtered_table = self.context.get_step_tabular_input_value(
            msg.id, input_id, msg.filter)
        values = self.context.get_step_input_values(
            msg.id, input_ids=[input_id], include_tabular=True)
        table = values[input_id]

        current_filter = self.context.get_step_tabular_input_filter(
            msg.id, input_id)

        if filtered_table is not None:
            self.publisher.publish(MsgModuleIOTabularInputValueUpdated(
                id=msg.id,
                input_id=camelcase(input_id),
                filter=current_filter,
                value=to_dict(serialize_filtered_table(filtered_table, table))
            ))
