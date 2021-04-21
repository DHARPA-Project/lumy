from dataclasses import dataclass
from random import random
from typing import List, Mapping

import pyarrow as pa
from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs

from .registry import dharpa_module

# NOTE: Fake repository
repository_items = pa.Table.from_pydict({
    'uri': [f'item-{i}' for i in range(10)],
    'metadataA': [int(i) for i in range(10)],
    'metadataB': [random() * i for i in range(10)],
}, pa.schema({
    'uri': pa.utf8(),
    'metadataA': pa.int32(),
    'metadataB': pa.float64()
}))


@dataclass
class Inputs:
    filenames: List[str]
    metadata_sets: List[str]


@dataclass
class Outputs:
    repository_items: 'pa.Table'


@dharpa_module('dataUpload')
def data_upload_process(inputs: Inputs, outputs: Outputs) -> None:
    outputs.repository_items = repository_items


class DataUploadModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "filenames": ValueSchema(
                type=ValueType.any, doc="A list of files."
            ),
            "metadataSets": ValueSchema(
                type=ValueType.any, doc="A list of metadata."
            ),
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "repositoryItems": ValueSchema(
                type=ValueType.any,
                doc="Repository items.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.repository_items = repository_items
