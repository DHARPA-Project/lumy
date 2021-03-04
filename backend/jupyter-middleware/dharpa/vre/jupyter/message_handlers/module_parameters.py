from dataclasses import dataclass
import logging
from typing import Dict, Optional

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.utils.dataclasses import to_dict, from_dict

logger = logging.getLogger(__name__)


@dataclass
class MessageGetParameters:
    module_id: str


@dataclass
class MessageUpdateParameters:
    module_id: str
    parameters: Optional[Dict] = None


@dataclass
class MessageParametersUpdated:
    module_id: str
    parameters: Optional[Dict] = None


class ModuleParametersHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return workflow step parameters.
        '''
        message = from_dict(MessageGetParameters, msg.content)
        parameters = self.context.get_current_workflow_step_parameters(
            message.module_id)

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(MessageParametersUpdated(
                    message.module_id,
                    parameters
                ))
            )
        )

    def _handle_update(self, msg: MessageEnvelope):
        message = from_dict(MessageParametersUpdated, msg.content)
        parameters = self.context.update_current_workflow_step_parameters(
            message.module_id,
            message.parameters
        )

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=to_dict(MessageParametersUpdated(
                    message.module_id,
                    parameters
                ))
            )
        )
