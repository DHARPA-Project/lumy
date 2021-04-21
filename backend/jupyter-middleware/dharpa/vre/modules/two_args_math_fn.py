from dataclasses import dataclass
from typing import Optional, Mapping
from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs


from .registry import dharpa_module


@dataclass
class Inputs:
    a: Optional[float] = None
    b: Optional[float] = None
    operator: Optional[str] = None


@dataclass
class Outputs:
    c: float


FUNCTIONS = {
    'add': lambda a, b: a + b,
    'sub': lambda a, b: a - b,
    'mul': lambda a, b: a * b,
    'div': lambda a, b: a / b,
    'pow': lambda a, b: a ** b,
}


@dharpa_module('twoArgsMathFunction')
def two_args_math_fn(inputs: Inputs, outputs: Outputs) -> None:
    fn = FUNCTIONS.get(inputs.operator or 'add')
    outputs.c = fn(inputs.a or 0, inputs.b or 0)


class TwoArgsMathFnModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "a": ValueSchema(
                type=ValueType.any, doc="a."
            ),
            "b": ValueSchema(
                type=ValueType.any, doc="b."
            ),
            "operator": ValueSchema(
                type=ValueType.any, doc="operator."
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "c": ValueSchema(
                type=ValueType.any,
                doc="c.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        fn = FUNCTIONS.get(inputs.operator or 'add')
        outputs.c = fn(inputs.a or 0, inputs.b or 0)
