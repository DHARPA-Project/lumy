from dataclasses import asdict
from typing import Any, Dict, IO, Optional, Type, TypeVar, Union

from dacite import from_dict as dacite_from_dict
from stringcase import camelcase, snakecase
import yaml
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader
try:
    from collections.abc import Mapping
except ImportError:
    from collections import Mapping


T = TypeVar('T')


def _process_keys(str_or_iter: T, fn) -> T:
    if isinstance(str_or_iter, list):
        return [_process_keys(k, fn) for k in str_or_iter]  # type: ignore
    elif isinstance(str_or_iter, Mapping):
        return {
            fn(k): _process_keys(v, fn)  # type: ignore
            for k, v in str_or_iter.items()
        }
    else:
        return str_or_iter


def to_snake_case(v):
    return _process_keys(v, snakecase)


def to_camel_case(v):
    return _process_keys(v, camelcase)


def from_yaml(
    data_class: Type[T],
    yaml_content: Union[bytes, IO[bytes], str, IO[str]],
    convert_to_snake_case: bool = True
) -> T:
    content: Dict = yaml.load(yaml_content, Loader=Loader)
    if convert_to_snake_case:
        content = to_snake_case(content)
    return dacite_from_dict(data_class, content)


def to_dict(
    data: Any,
    return_camel_case=True
) -> Dict:
    d = asdict(data)
    if return_camel_case:
        d = to_camel_case(d)
    return d


def from_dict(
    data_class: Type[T],
    data: Optional[Dict],
    convert_to_snake_case: bool = True
) -> T:
    data_dict: Dict = data or {}
    if convert_to_snake_case:
        data_dict = to_snake_case(data_dict)
    return dacite_from_dict(data_class, data_dict)
