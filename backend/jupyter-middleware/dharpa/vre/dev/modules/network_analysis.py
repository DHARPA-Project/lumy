from typing import Mapping
from kiara.data.values import ValueSchema
from kiara.module import KiaraModule, StepInputs, StepOutputs
import pyarrow as pa
import numpy as np
import math

# Value of any column in the mapping table
MappingItemStruct = pa.struct([
    # ID of the tabular data item
    pa.field(name='id', type=pa.utf8(), nullable=False),
    # Column name from the data item
    pa.field(name='column', type=pa.utf8(), nullable=False)
])


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
        num_nodes = 123
        nums = np.arange(0, num_nodes)
        num_groups = 5
        groups = np.array(
            list(map(lambda x: f'group_{x}', np.arange(0, num_groups))))
        ids = np.array(list(map(str, nums)))

        outputs.nodes = pa.Table.from_pydict({
            'id': ids,
            'label': np.array(list(map(lambda x: f'Item {x}', nums))),
            'group': np.random.choice(groups, nums.shape)
        })

        num_edges = math.floor(num_nodes * 1.5)
        enums = np.arange(0, num_edges, 1)

        outputs.edges = pa.Table.from_pydict({
            'srcId': np.array(list(map(
                lambda _: np.random.choice(ids), enums))),
            'tgtId': np.array(list(map(
                lambda _: np.random.choice(ids), enums)))
        })


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
