import json
import logging
import sys
from typing import Dict
from uuid import uuid4

from IPython import get_ipython
from dharpa.vre.context.context import AppContext
from dharpa.vre.context.mock.app_context import MockAppContext
from dharpa.vre.jupyter.base import (
    MessageEnvelope,
    MessageHandler,
    Target,
    TargetPublisher,
)
from dharpa.vre.jupyter.message_handlers import (
    ModuleIOHandler,
    WorkflowMessageHandler,
)
from dharpa.vre.types.generated import MsgError
from dharpa.vre.utils.dataclasses import to_dict
from dharpa.vre.utils.json import object_as_json
from ipykernel.comm import Comm

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))


class Context(TargetPublisher):
    __instance = None

    _comms: Dict[Target, Comm] = {}
    _module_id: str
    _is_ready = False

    _context: AppContext

    _handlers: Dict[Target, MessageHandler] = {}

    @staticmethod
    def start():
        if Context.get_instance() is None:
            Context()

    @staticmethod
    def get_instance():
        return Context.__instance

    def __init__(self):
        super().__init__()
        self._context = MockAppContext()

        self._handlers = {
            Target.Workflow: WorkflowMessageHandler(self._context, self),
            Target.ModuleIO: ModuleIOHandler(
                self._context, self)
        }

        def _open_handle_factory(target: Target):
            def _open_handle(comm: Comm, open_msg):
                self._comms[target] = comm

                def _recv(msg):
                    self._handle_message(target, msg)

                _recv(open_msg)
                comm.on_msg(_recv)

            return _open_handle

        get_ipython().kernel.comm_manager.register_target(
            Target.Activity.value,
            _open_handle_factory(Target.Activity)
        )

        get_ipython().kernel.comm_manager.register_target(
            Target.Workflow.value,
            _open_handle_factory(Target.Workflow)
        )

        get_ipython().kernel.comm_manager.register_target(
            Target.ModuleIO.value,
            _open_handle_factory(Target.ModuleIO)
        )

        self._is_ready = True
        Context.__instance = self

    @property
    def is_ready(self):
        return self._is_ready

    def publish(self, target: Target, msg: MessageEnvelope) -> None:
        comm = self._comms[target]
        logger.debug(
            f'Message published on "{target}": {json.dumps(to_dict(msg))}')
        comm.send(to_dict(msg))

    def _handle_message(self, target: Target, message: Dict) -> None:
        message_data: Dict = message.get('content', {}).get('data', {})
        logger.debug(
            f'Message received on "{target}": {json.dumps(message_data)}')

        if message_data.get('action', None) is None:
            logger.warn(
                f'Received a message with no "action" field on \
                    target "{target}": {object_as_json(message)}'
            )
            return

        try:
            msg = MessageEnvelope(**message_data)

            handler = self._handlers[target]

            if handler is None:
                logger.warn(f'No handler found for target "{target}"')
            else:
                handler(msg)
        except Exception as e:
            error_id = str(uuid4())
            logger.exception(
                f'''{error_id}: Error occured while executing a message
                handler for target "{target}" and message
                {json.dumps(message_data)}'''
            )
            self.publish(
                Target.Activity,
                MessageEnvelope(
                    action='error',
                    content=to_dict(MsgError(
                        id=error_id,
                        message=f'Error occured while executing a message \
                        handler for target "{target}": {str(e)}'
                    ))
                )
            )
