from dataclasses import dataclass
from typing import Optional


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
