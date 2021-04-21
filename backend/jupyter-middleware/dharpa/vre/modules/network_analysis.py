from typing import Mapping
from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs


class NetworkAnalysisDataMappingModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "corpus": ValueSchema(
                type=ValueType.any, doc="Corpus items."
            ),
            "nodesMappingTable": ValueSchema(
                type=ValueType.any, doc="Nodes mapping table."
            ),
            "edgesMappingTable": ValueSchema(
                type=ValueType.any, doc="Edges mapping table."
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type=ValueType.any,
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type=ValueType.any,
                doc="Edges table.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        pass


class NetworkAnalysisDataVisModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "nodes": ValueSchema(
                type=ValueType.any,
                doc="Nodes table.",
            ),
            "edges": ValueSchema(
                type=ValueType.any,
                doc="Edges table.",
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "graphData": ValueSchema(
                type=ValueType.any,
                doc="Nodes table.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        pass
