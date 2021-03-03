from dataclasses import asdict, dataclass
import logging
from typing import Dict, Optional

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target

logger = logging.getLogger(__name__)


@dataclass
class MessageGetParameters:
    moduleId: str  # TODO: sort out case


@dataclass
class MessageUpdateParameters:
    moduleId: str  # TODO: sort out case
    parameters: Optional[Dict] = None


@dataclass
class MessageParametersUpdated:
    moduleId: str  # TODO: sort out case
    parameters: Optional[Dict] = None


class ModuleParametersHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return workflow step parameters.
        '''
        message = MessageGetParameters(**msg.content or {})
        parameters = self.context.get_current_workflow_step_parameters(
            message.moduleId)

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=asdict(MessageParametersUpdated(
                    message.moduleId,
                    parameters
                ))
            )
        )

    def _handle_update(self, msg: MessageEnvelope):
        message = MessageParametersUpdated(**msg.content or {})
        parameters = self.context.update_current_workflow_step_parameters(
            message.moduleId,
            message.parameters
        )

        self.publisher.publish(
            Target.ModuleParameters,
            MessageEnvelope(
                action='updated',
                content=asdict(MessageParametersUpdated(
                    message.moduleId,
                    parameters
                ))
            )
        )
