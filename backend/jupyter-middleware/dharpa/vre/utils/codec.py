import base64
from typing import Any, Optional, Union

import pyarrow as pa
from dharpa.vre.types.generated import DataType, DataValueContainer, TableStats
from dharpa.vre.utils.dataclasses import to_dict


def serialize_table_stats(table: pa.Table) -> DataValueContainer:
    '''
    Serialize table as stats value (excluding data)
    '''
    return DataValueContainer(
        data_type=DataType.TABLE,
        stats=to_dict(TableStats(
            rows_count=table.num_rows
        ))
    )


def serialize_table_stats_and_value(
    filtered_table: pa.Table,
    full_table: Optional[pa.Table] = None
) -> DataValueContainer:
    '''
    Serialize table as stats plus value.
    The stats are taken for the `full_table`, the value
    is taken from the `filtered_table`. If `full_table` is not
    provided, `filtered_table` is used.
    '''
    if full_table is None:
        full_table = filtered_table

    sink = pa.BufferOutputStream()

    writer = pa.ipc.new_file(sink, filtered_table.schema)
    writer.write(filtered_table)
    writer.close()

    val = sink.getvalue().to_pybytes()
    val = base64.b64encode(val).decode('ascii')

    container = serialize_table_stats(full_table)
    container.value = val
    return container


def serialize(
    value: Any,
    include_full_value: Optional[bool] = None
) -> Union[DataValueContainer, Any]:
    '''
    Serialize any value to wire format.
    '''
    if isinstance(value, pa.Table):
        if include_full_value:
            return serialize_table_stats_and_value(value)
        else:
            return serialize_table_stats(value)
    return value
