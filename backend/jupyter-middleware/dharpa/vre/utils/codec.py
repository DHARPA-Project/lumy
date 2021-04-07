import base64
from typing import Any, Union

import pyarrow as pa
from dharpa.vre.types.generated import DataType, DataValueContainer, TableStats
from dharpa.vre.utils.dataclasses import to_dict


def serialize_table(table: pa.Table) -> DataValueContainer:
    return DataValueContainer(
        data_type=DataType.TABLE,
        stats=to_dict(TableStats(
            rows_count=table.num_rows
        ))
    )


def serialize_filtered_table(
        filtered_table: pa.Table,
        full_table: pa.Table) -> DataValueContainer:
    sink = pa.BufferOutputStream()

    writer = pa.ipc.new_file(sink, filtered_table.schema)
    writer.write(filtered_table)
    writer.close()

    val = sink.getvalue().to_pybytes()
    val = base64.b64encode(val).decode('ascii')

    container = serialize_table(full_table)
    container.value = val
    return container


def serialize(value: Any) -> Union[DataValueContainer, Any]:
    if isinstance(value, pa.Table):
        return serialize_table(value)
    return value
