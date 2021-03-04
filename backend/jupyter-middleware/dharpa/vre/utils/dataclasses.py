from typing import Any, Dict, IO, Optional, Type, TypeVar, Union
import yaml
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader
from dataclasses import asdict
from dacite import from_dict as dacite_from_dict
from humps import camelize, decamelize, is_camelcase

T = TypeVar('T')


def from_yaml(
    data_class: Type[T],
    yaml_content: Union[bytes, IO[bytes], str, IO[str]]
) -> T:
    content: Dict = yaml.load(yaml_content, Loader=Loader)
    if is_camelcase(content):
        content = decamelize(content)
    return dacite_from_dict(data_class, content)


def to_dict(
    data: Any,
    return_camel_case=True
) -> Dict:
    d = asdict(data)
    if return_camel_case:
        d = camelize(d)
    return d


def from_dict(
    data_class: Type[T],
    data: Optional[Dict]
) -> T:
    data_dict: Dict = data or {}
    if is_camelcase(data_dict):
        data_dict = decamelize(data_dict)
    return dacite_from_dict(data_class, data_dict)
