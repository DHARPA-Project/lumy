import base64

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


def serialize_filtered_table(table: pa.Table) -> DataValueContainer:
    sink = pa.BufferOutputStream()

    writer = pa.ipc.new_file(sink, table.schema)
    writer.write(table)
    writer.close()

    val = sink.getvalue().to_pybytes()
    val = base64.b64encode(val).decode('ascii')

    container = serialize_table(table)
    container.value = val
    return container
