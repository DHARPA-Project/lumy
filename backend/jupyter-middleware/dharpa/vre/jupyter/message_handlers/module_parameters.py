import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.messages import (
    ParametersGet, ParametersUpdated, ParametersUpdate
)
from dharpa.vre.utils.dataclasses import to_dict, from_dict

logger = logging.getLogger(__name__)


class ModuleParametersHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return workflow step parameters.
        '''
        message = from_dict(ParametersGet, msg.content)
        parameters = self.context.get_current_workflow_step_parameters(
            message.module_id)

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(ParametersUpdated(
                    message.module_id,
                    parameters
                ))
            )
        )

    def _handle_update(self, msg: MessageEnvelope):
        message = from_dict(ParametersUpdate, msg.content)
        parameters = self.context.update_current_workflow_step_parameters(
            message.module_id,
            message.parameters
        )

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(ParametersUpdated(
                    message.module_id,
                    parameters
                ))
            )
        )
