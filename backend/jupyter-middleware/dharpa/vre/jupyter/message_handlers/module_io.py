import logging

from dharpa.vre.context.context import UpdatedIO
from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types.generated import (MsgModuleIOGetInputValue,
                                        MsgModuleIOGetOutputValue,
                                        MsgModuleIOInputValue,
                                        MsgModuleIOInputValuesUpdated,
                                        MsgModuleIOOutputValue,
                                        MsgModuleIOOutputValuesUpdated,
                                        MsgModuleIOUpdateInputValues)
from dharpa.vre.utils.codec import deserialize, serialize
from dharpa.vre.utils.dataclasses import to_dict

logger = logging.getLogger(__name__)


class ModuleIOHandler(MessageHandler):

    def initialize(self):
        self.context.step_input_values_updated.subscribe(
            self._on_inputs_updated)
        self.context.step_output_values_updated.subscribe(
            self._on_outputs_updated)

    def _on_inputs_updated(self, msg: UpdatedIO):
        self.publisher.publish(MsgModuleIOInputValuesUpdated(
            step_id=msg.step_id, input_ids=msg.io_ids))

    def _on_outputs_updated(self, msg: UpdatedIO):
        self.publisher.publish(MsgModuleIOOutputValuesUpdated(
            step_id=msg.step_id, output_ids=msg.io_ids))

    def _handle_GetInputValue(self, msg: MsgModuleIOGetInputValue):
        '''
        Return workflow step input value.
        '''
        value, stats = self.context.get_step_input_value(
            msg.step_id, msg.input_id, msg.filter)

        serialized_value, value_type = serialize(value)

        return MsgModuleIOInputValue(
            step_id=msg.step_id,
            input_id=msg.input_id,
            filter=msg.filter,
            value=serialized_value,
            type=value_type.value,
            stats=to_dict(stats)
        )

    def _handle_GetOutputValue(self, msg: MsgModuleIOGetOutputValue):
        '''
        Return workflow step output value.
        '''
        value, stats = self.context.get_step_output_value(
            msg.step_id, msg.output_id, msg.filter)

        serialized_value, value_type = serialize(value)

        return MsgModuleIOOutputValue(
            step_id=msg.step_id,
            output_id=msg.output_id,
            filter=msg.filter,
            value=serialized_value,
            type=value_type.value,
            stats=to_dict(stats)
        )

    def _handle_UpdateInputValues(self, msg: MsgModuleIOUpdateInputValues):

        input_values = {
            k: deserialize(v)
            for k, v in msg.input_values.items()
        }

        self.context.update_step_input_values(
            msg.step_id,
            input_values
        )

        if len(input_values) > 0:
            self.publisher.publish(MsgModuleIOInputValuesUpdated(
                step_id=msg.step_id,
                input_ids=list(input_values.keys())
            ))
