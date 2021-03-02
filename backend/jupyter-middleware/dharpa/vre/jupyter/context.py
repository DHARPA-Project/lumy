from typing import Dict
from enum import Enum
import logging
import sys
import json

from IPython import get_ipython
from ipykernel.comm import Comm

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))


class Target(Enum):
    ModuleParameters = 'module_parameters'
    ModuleIOPreview = 'module_io_preview'


class Context:
    __instance = None

    _comms: Dict[Target, Comm] = {}
    _module_id: str
    _is_ready = False

    @staticmethod
    def start():
        Context('test-module-id')

    @staticmethod
    def getInstance():
        return Context.__instance

    def __init__(self, module_id: str):
        self._module_id = module_id

        def _open_handle_factory(target: Target):
            def _open_handle(comm: Comm, open_msg):
                self._comms[target] = comm

                def _recv(msg):
                    self._handle_message(target, msg)

                _recv(open_msg)
                comm.on_msg(_recv)

            return _open_handle

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

    def _handle_message(self, target: Target, message: Dict):
        message_data: Dict = message.get('content', {}).get('data', {})

        try:
            if target == Target.ModuleParameters:
                self._handle_module_parameters_message(message_data)
            if target == Target.ModuleIOPreview:
                self._handle_module_io_preview_message(message_data)
        except Exception:
            logger.exception(
                f'''Error occured while executing a message
                handler for target "{target}" and message
                {json.dumps(message_data)}'''
            )

    def _handle_module_parameters_message(self, msg):
        # action = msg.get('action')
        # comm = self._comms[Target.ModuleParameters]

        logger.info(f'Placeholder for handling message \
            {msg} on {Target.ModuleParameters}')

    def _handle_module_io_preview_message(self, msg):
        # action = msg.get('action')
        # comm = self._comms.get(Target.ModuleIOPreview)

        logger.info(f'Placeholder for handling message \
            {msg} on {Target.ModuleIOPreview}')
