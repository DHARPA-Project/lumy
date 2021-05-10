import logging
from typing import Dict, List, Optional, Union
import pyarrow as pa
# from random import random
from pathlib import Path
from uuid import uuid4
import pandas as pd

DefaultFilesPath = Path.home() / '.dharpa' / 'mock-data-registry'

logger = logging.getLogger(__name__)


def file_is_tabular(f: Path):
    return str(f).endswith('csv') or str(f).endswith('tsv')


def to_item(f: Path):
    is_tabular = file_is_tabular(f)
    columns = pd.read_csv(str(f)).columns.tolist(
    ) if file_is_tabular(f) else None

    return {
        'id': str(uuid4()),
        'alias': f.name,
        'type': 'table' if is_tabular else 'string',
        'columnNames': columns,
        'columnTypes': ['sring' for _ in columns]
        if is_tabular else None
    }


class MockDataRegistry:
    __instance = None

    _data_items: pa.Table
    _files_path: Path
    _file_lookup: Dict[str, Path] = {}

    def __init__(self, files_location=DefaultFilesPath):
        self._files_path = files_location

        items = [
            (to_item(f), f)
            for f in self._files_path.glob('**/*')
            if f.is_file()
        ]

        # row_numbers = list(range(20))
        # table_flags = [random() > 0.5 for _ in row_numbers]
        self._file_lookup = {i['id']: p for i, p in items}

        self._data_items = pa.Table.from_pydict({
            'id': [i['id'] for i, _ in items],
            'alias': [i['alias'] for i, _ in items],
            'type': [i['type'] for i, _ in items],
            'columnNames': [i['columnNames'] for i, _ in items],
            'columnTypes': [i['columnTypes'] for i, _ in items],

            # 'id': [f'id-{i}' for i in row_numbers],
            # 'alias': [f'Item #{i}' for i in row_numbers],
            # 'type': ['table' if is_table else 'string'
            #          for is_table in table_flags],
            # 'columnNames': [['a', 'b', 'c'] if is_table else None
            #                 for is_table in table_flags],
            # 'columnTypes': [['int', 'sting', 'float'] if is_table else None
            #                 for is_table in table_flags],
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

    def _get_filtered_table(self,
                            types: Optional[List[str]] = None) -> pa.Table:
        if types is None:
            return self._data_items
        items = self._data_items.to_pandas()
        return pa.Table.from_pandas(items[items['type'].isin(types)])

    def filter_items(self,
                     offset: int,
                     page_size: int,
                     types: Optional[List[str]] = None) -> pa.Table:
        return self._get_filtered_table(types).slice(offset, page_size)

    def get_total_items(self,
                        types: Optional[List[str]] = None) -> int:
        return self._get_filtered_table(types).num_rows

    def get_file_content(self, file_id: str) -> Union[pa.Table, str]:
        file_path = self._file_lookup[file_id]
        is_tabular = file_is_tabular(file_path)
        if is_tabular:
            return pa.Table.from_pandas(pd.read_csv(file_path))
        else:
            with open(file_path, 'r') as f:
                return str(f.read())
