import logging
from typing import List, Mapping

import numpy as np
import pandas as pd
import pyarrow as pa
from dharpa.vre.dev.data_registry.mock import MockDataRegistry
from kiara.data.values import ValueSchema
from kiara.module import KiaraModule, StepInputs, StepOutputs

logger = logging.getLogger(__name__)

# Value of any column in the mapping table
MappingItemStruct = pa.struct([
    # ID of the tabular data item
    pa.field(name='id', type=pa.utf8(), nullable=False),
    # Column name from the data item
    pa.field(name='column', type=pa.utf8(), nullable=False)
])


def build_table_from_mapping(
    mapping_table: pa.Table,
    column_names: List[str]
) -> pa.Table:
    mapping = mapping_table.to_pydict()

    table = pd.DataFrame()

    for column_name in column_names:
        column_mappings = mapping.get(column_name, [])
        if len(column_mappings) > 0:
            table[column_name] = pd.concat([
                MockDataRegistry.get_instance().get_file_content(
                    m['id']).to_pandas()[m['column']]
                for m in column_mappings
            ])

    if len(table) == 0:
        table = pd.DataFrame(columns=column_names)

    return pa.Table.from_pandas(table, preserve_index=False)


class NetworkAnalysisDataMappingModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "corpus": ValueSchema(
                type="table", doc="Corpus items."
            ),
            "nodesMappingTable": ValueSchema(
                type="table", doc="Nodes mapping table.",
                default=pa.Table.from_pydict({})
            ),
            "edgesMappingTable": ValueSchema(
                type="table", doc="Edges mapping table.",
                default=pa.Table.from_pydict({})
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type="table",
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type="table",
                doc="Edges table.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.nodes = build_table_from_mapping(
            inputs.nodesMappingTable,
            ['id', 'label']
        )
        outputs.edges = build_table_from_mapping(
            inputs.edgesMappingTable,
            ['srcId', 'tgtId', 'weight']
        )


class NetworkAnalysisDataVisModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type="table",
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type="table",
                doc="Edges table.",
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "graphData": ValueSchema(
                type="table",
                doc="Nodes table.",
            ),
            "shortestPath": ValueSchema(
                type="any",
                doc="Shortest path array.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.shortestPath = []

        ids = inputs.nodes['id'].to_numpy()

        outputs.graphData = pa.Table.from_pydict({
            'degree': np.random.rand(*ids.shape),
            'eigenvector': np.random.rand(*ids.shape),
            'betweenness': np.random.rand(*ids.shape),
            'isLarge': np.random.rand(*ids.shape) > 0.5
        })
