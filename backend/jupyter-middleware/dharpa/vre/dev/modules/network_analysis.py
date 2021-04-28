from typing import Mapping
from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs
import pyarrow as pa


class NetworkAnalysisDataMappingModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "corpus": ValueSchema(
                type=ValueType.table, doc="Corpus items."
            ),
            "nodesMappingTable": ValueSchema(
                type=ValueType.table, doc="Nodes mapping table.",
                default=pa.Table.from_pydict({})
            ),
            "edgesMappingTable": ValueSchema(
                type=ValueType.table, doc="Edges mapping table.",
                default=pa.Table.from_pydict({})
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type=ValueType.table,
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type=ValueType.table,
                doc="Edges table.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.nodes = pa.Table.from_pydict({})
        outputs.edges = pa.Table.from_pydict({})


class NetworkAnalysisDataVisModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type=ValueType.table,
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type=ValueType.table,
                doc="Edges table.",
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "graphData": ValueSchema(
                type=ValueType.table,
                doc="Nodes table.",
            ),
            "shortestPath": ValueSchema(
                type=ValueType.any,
                doc="Shortest path array.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.graphData = {}
        outputs.shortestPath = []
