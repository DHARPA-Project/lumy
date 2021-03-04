import os
from typing import Dict
from humps import camelize

REF_PREFIX = 'https://dharpa.org/schema/'

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
SCHEMA_DIR = os.path.abspath(os.path.join(
    CURRENT_DIR, '..', '..', '..', 'schema'))


def ensure_camel_case(schema: Dict) -> Dict:
    schema['properties'] = {
        camelize(key): value
        for key, value in schema.get('properties', {}).items()
    }

    schema['required'] = [
        camelize(item)
        for item in schema.get('required', [])
    ]

    return schema


if __name__ == '__main__':
    import json
    from inspect import getmembers
    from dataclasses import is_dataclass
    from pydantic.schema import model_schema  # pylint: disable=E0611
    from pydantic.dataclasses import dataclass as pydantic_dataclass

    from dharpa.vre.context import types
    from dharpa.vre import messages

    exportable_modules = [
        ('appTypes', types),
        ('messages', messages)
    ]

    exportable_items = []

    for module_name, module in exportable_modules:

        exportable_items += [
            (module_name, name, pydantic_dataclass(klass))
            for name, klass in reversed(getmembers(module, is_dataclass))
        ]

    print(f'Writing schemas to {SCHEMA_DIR}')

    for module_name, name, klass in exportable_items:
        schema = model_schema(klass, ref_prefix=REF_PREFIX)
        if 'definitions' in schema:
            del schema['definitions']
        schema = {**{'$id': f'{REF_PREFIX}{schema["title"]}.json'}, **schema}
        schema = ensure_camel_case(schema)

        assert 'definitions' not in schema, \
            f'{name}: JSON schema definitions are not supported here'

        schema_file = os.path.join(SCHEMA_DIR, f'{name}.json')
        with open(schema_file, 'w') as f:
            f.write(json.dumps(schema, indent=2))
