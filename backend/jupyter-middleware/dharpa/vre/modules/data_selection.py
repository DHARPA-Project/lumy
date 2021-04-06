from dataclasses import dataclass
from typing import List

import pyarrow as pa

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
