import logging

from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types.generated import (MsgModuleIOGetInputValues,
                                        MsgModuleIOGetTabularInputValue,
                                        MsgModuleIOInputValuesUpdated,
                                        MsgModuleIOTabularInputValueUpdated,
                                        MsgModuleIOUpdateInputValues)
from dharpa.vre.utils.codec import serialize_table

logger = logging.getLogger(__name__)


class ModuleIOHandler(MessageHandler):

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

    def _handle_GetTabularInputValue(self,
                                     msg: MsgModuleIOGetTabularInputValue):
        value = self.context.get_step_tabular_input_value(
            msg.id, msg.input_id, msg.filter)

        current_filter = self.context.get_step_tabular_input_filter(
            msg.id, msg.input_id)

        if value is not None:
            self.publisher.publish(MsgModuleIOTabularInputValueUpdated(
                id=msg.id,
                input_id=msg.input_id,
                filter=current_filter,
                value=serialize_table(value)
            ))
