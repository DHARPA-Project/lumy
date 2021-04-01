import logging

from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types.generated import (MsgModuleIOGetInputValues,
                                        MsgModuleIOInputValuesUpdated,
                                        MsgModuleIOUpdateInputValues)

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
