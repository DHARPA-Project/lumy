from typing import Mapping

from kiara.data.values import ValueSchema, ValueType
from kiara.module import KiaraModule, StepInputs, StepOutputs
from dharpa.vre.dev.data_registry.mock import MockDataRegistry


class DataSelectionModule(KiaraModule):

    def create_input_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "selectedItemsIds": ValueSchema(
                type=ValueType.any, doc="URIs of selected items.", default=[]
            ),
            "metadataFields": ValueSchema(
                type=ValueType.any, doc="Metadata field.", default=[]
            )
        }

    def create_output_schema(self) -> Mapping[str, ValueSchema]:
        return {
            "selectedItems": ValueSchema(
                type=ValueType.table,
                doc="Selected corpus.",
            )
        }

    def process(self, inputs: StepInputs, outputs: StepOutputs) -> None:
        outputs.selectedItems = MockDataRegistry \
            .get_instance().get_items_by_ids(inputs.selectedItemsIds or [])
