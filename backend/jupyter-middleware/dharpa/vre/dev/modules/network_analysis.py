import logging
from typing import List, Mapping, cast

import networkx as nx
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
                cast(pa.Table, MockDataRegistry
                     .get_instance().get_file_content(m['id']))
                .to_pandas()[m['column']]
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
            ['id', 'label', 'group']
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
            ),
            "shortestPathSource": ValueSchema(
                type="any",
                doc="ID of the start node for the shortest path calculations",
                optional=True,
                default=None
            ),
            "shortestPathTarget": ValueSchema(
                type="any",
                doc="ID of the end node for the shortest path calculations",
                optional=True,
                default=None
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
        graph: nx.Graph = nx.from_pandas_edgelist(
            inputs.edges.to_pandas(),
            "srcId", "tgtId",
            edge_attr=True,
            create_using=nx.DiGraph()
        )

        nodes = inputs.nodes.to_pandas()
        graph.add_nodes_from(nodes.set_index('id').to_dict('index').items())

        if len(nodes) > 0:
            degree_dict = dict(graph.degree(graph.nodes()))
            betweenness_dict = nx.betweenness_centrality(graph)
            eigenvector_dict = nx.eigenvector_centrality(graph)
        else:
            degree_dict = {}
            betweenness_dict = {}
            eigenvector_dict = {}

        isolated_nodes_ids = list(nx.isolates(graph))

        ids = inputs.nodes['id'].to_numpy()

        outputs.graphData = pa.Table.from_pydict({
            'degree': [degree_dict[i] for i in ids],
            'eigenvector': [eigenvector_dict[i] for i in ids],
            'betweenness': [betweenness_dict[i] for i in ids],
            'isIsolated': [i in isolated_nodes_ids for i in ids],
            # TODO: what was "isLarge" exactly? It is not
            # currently used in the visualisation.
            'isLarge': np.random.rand(*ids.shape) > 0.5
        })

        # shortest path

        if inputs.shortestPathSource in ids \
                and inputs.shortestPathTarget in ids:
            outputs.shortestPath = nx.shortest_path(
                graph,
                source=inputs.shortestPathSource,
                target=inputs.shortestPathTarget
            )
        else:
            outputs.shortestPath = []
