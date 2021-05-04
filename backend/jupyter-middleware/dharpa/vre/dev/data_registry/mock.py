from typing import List
import pyarrow as pa
from random import random


class MockDataRegistry:
    __instance = None

    _data_items: pa.Table

    def __init__(self, num_records=20):
        row_numbers = list(range(num_records))
        table_flags = [random() > 0.5 for _ in row_numbers]

        self._data_items = pa.Table.from_pydict({
            'id': [f'id-{i}' for i in row_numbers],
            'alias': [f'Item #{i}' for i in row_numbers],
            'type': ['table' if is_table else 'string'
                     for is_table in table_flags],
            'columnNames': [['a', 'b', 'c'] if is_table else None
                            for is_table in table_flags],
            'columnTypes': [['int', 'sting', 'float'] if is_table else None
                            for is_table in table_flags],
        }, pa.schema({
            'id': pa.utf8(),
            'alias': pa.utf8(),
            'type': pa.utf8(),
            'columnNames': pa.list_(pa.utf8()),
            'columnTypes': pa.list_(pa.utf8())
        }))

    @staticmethod
    def get_instance():
        if MockDataRegistry.__instance is None:
            MockDataRegistry.__instance = MockDataRegistry()

        return MockDataRegistry.__instance

    def get_items_by_ids(self, ids: List[str]) -> pa.Table:
        items = self._data_items.to_pandas()
        return pa.Table.from_pandas(items[items['id'].isin(ids)])

    def filter_items(self, offset: int, page_size: int) -> pa.Table:
        return self._data_items.slice(offset, page_size)

    def get_total_items(self) -> int:
        return self._data_items.num_rows
