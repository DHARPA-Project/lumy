from typing import Dict
import logging
import sys
import json
from dataclasses import asdict

from IPython import get_ipython
from dharpa.vre.jupyter.message_handlers.workflow import WorkflowMessageHandler
from ipykernel.comm import Comm

from dharpa.vre.jupyter.base import MessageEnvelope, Target, TargetPublisher
from dharpa.vre.context.context import AppContext
from dharpa.vre.context.mock.app_context import MockAppContext

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))


class Context(TargetPublisher):
    __instance = None

    _comms: Dict[Target, Comm] = {}
    _module_id: str
    _is_ready = False

    _context: AppContext

    _workflow_handler: WorkflowMessageHandler

    @staticmethod
    def start():
        if Context.getInstance() is None:
            Context()

    @staticmethod
    def getInstance():
        return Context.__instance

    def __init__(self):
        super().__init__()
        self._context = MockAppContext()

        self._workflow_handler = WorkflowMessageHandler(self._context, self)

        def _open_handle_factory(target: Target):
            def _open_handle(comm: Comm, open_msg):
                self._comms[target] = comm

                def _recv(msg):
                    self._handle_message(target, msg)

                _recv(open_msg)
                comm.on_msg(_recv)

            return _open_handle

        get_ipython().kernel.comm_manager.register_target(
            Target.Workflow.value,
            _open_handle_factory(Target.Workflow)
        )

        get_ipython().kernel.comm_manager.register_target(
            Target.ModuleParameters.value,
            _open_handle_factory(Target.ModuleParameters)
        )

        get_ipython().kernel.comm_manager.register_target(
            Target.ModuleIOPreview.value,
            _open_handle_factory(Target.ModuleIOPreview)
        )

        self._is_ready = True
        Context.__instance = self

    @property
    def is_ready(self):
        return self._is_ready

    def publish(self, target: Target, msg: MessageEnvelope) -> None:
        comm = self._comms[target]
        comm.send(asdict(msg))

    def _handle_message(self, target: Target, message: Dict) -> None:
        message_data: Dict = message.get('content', {}).get('data', {})

        try:
            msg = MessageEnvelope(**message_data)

            if target == Target.ModuleParameters:
                self._handle_module_parameters_message(message_data)
            if target == Target.ModuleIOPreview:
                self._handle_module_io_preview_message(message_data)
            if target == Target.Workflow:
                self._workflow_handler.handle_message(msg)
        except Exception:
            logger.exception(
                f'''Error occured while executing a message
                handler for target "{target}" and message
                {json.dumps(message_data)}'''
            )

    def _handle_module_parameters_message(self, msg: Dict) -> None:
        # action = msg.get('action')
        # comm = self._comms[Target.ModuleParameters]

        logger.info(f'Placeholder for handling message \
            {msg} on {Target.ModuleParameters}')

    def _handle_module_io_preview_message(self, msg: Dict) -> None:
        # action = msg.get('action')
        # comm = self._comms.get(Target.ModuleIOPreview)

        logger.info(f'Placeholder for handling message \
            {msg} on {Target.ModuleIOPreview}')
