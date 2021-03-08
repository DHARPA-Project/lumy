import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.types import (
    MsgParametersGet, MsgParametersUpdated, MsgParametersUpdate
)
from dharpa.vre.utils.dataclasses import to_dict, from_dict

logger = logging.getLogger(__name__)


class ModuleParametersHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return workflow step parameters.
        '''
        message = from_dict(MsgParametersGet, msg.content)
        parameters = self.context.get_current_workflow_step_parameters(
            message.id)

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(MsgParametersUpdated(
                    message.id,
                    parameters
                ))
            )
        )

    def _handle_update(self, msg: MessageEnvelope):
        message = from_dict(MsgParametersUpdate, msg.content)
        parameters = self.context.update_current_workflow_step_parameters(
            message.id,
            message.parameters
        )

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(MsgParametersUpdated(
                    message.id,
                    parameters
                ))
            )
        )
