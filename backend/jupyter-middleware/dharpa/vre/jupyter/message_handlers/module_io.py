import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.types.generated import (
    MsgModuleIOGetInputValues,
    MsgModuleIOInputValuesUpdated,
    MsgModuleIOUpdateInputValues,
)
from dharpa.vre.utils.dataclasses import from_dict, to_dict

logger = logging.getLogger(__name__)


class ModuleIOHandler(MessageHandler):

    def _handle_GetInputValues(self, msg: MessageEnvelope):
        '''
        Return workflow step input values.
        '''
        message = from_dict(MsgModuleIOGetInputValues, msg.content)
        values = self.context.get_current_workflow_step_parameters(
            message.id)

        self.publisher.publish(
            Target.ModuleIO,
            MessageEnvelope(
                action='InputValuesUpdated',
                content=to_dict(MsgModuleIOInputValuesUpdated(
                    message.id,
                    values
                ))
            )
        )

    def _handle_UpdateInputValues(self, msg: MessageEnvelope):
        message = from_dict(MsgModuleIOUpdateInputValues, msg.content)
        values = self.context.update_current_workflow_step_parameters(
            message.id,
            message.input_values
        )

        self.publisher.publish(
            Target.ModuleIO,
            MessageEnvelope(
                action='InputValuesUpdated',
                content=to_dict(MsgModuleIOInputValuesUpdated(
                    message.id,
                    values
                ))
            )
        )
