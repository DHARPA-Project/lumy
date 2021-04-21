from dataclasses import dataclass
from typing import List, Mapping

import pyarrow as pa
from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs

from .registry import dharpa_module


@dataclass
class Inputs:
    repository_items: 'pa.Table'
    selected_items_uris: List[str]
    metadata_fields: List[str]


@dataclass
class Outputs:
    corpus: 'pa.Table'


@dharpa_module('dataSelection')
def data_selection_process(inputs: Inputs, outputs: Outputs) -> None:
    repo = inputs.repository_items.to_pandas()

    outputs.corpus = pa.Table.from_pandas(
        repo[repo['uri'].isin(inputs.selected_items_uris or [])])


class DataSelectionModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "repository_items": ValueSchema(
                type=ValueType.any, doc="A list of repository items."
            ),
            "selected_items_uris": ValueSchema(
                type=ValueType.any, doc="URIs of selected items."
            ),
            "metadata_fields": ValueSchema(
                type=ValueType.any, doc="Metadata field."
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "corpus": ValueSchema(
                type=ValueType.any,
                doc="Selected corpus.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        repo = inputs.repository_items.to_pandas()
        outputs.corpus = pa.Table.from_pandas(
            repo[repo['uri'].isin(inputs.selected_items_uris or [])])
