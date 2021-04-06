import base64
import pyarrow as pa


def serialize_table(table: pa.Table) -> str:
    sink = pa.BufferOutputStream()

    writer = pa.ipc.new_file(sink, table.schema)
    writer.write(table)
    writer.close()

    val = sink.getvalue().to_pybytes()
    return base64.b64encode(val).decode('ascii')
