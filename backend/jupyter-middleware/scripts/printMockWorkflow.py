from typing import Any, Dict

import yaml
from kiara import Kiara
from kiara.pipeline.pipeline import StepStatus
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from stringcase import camelcase


def as_camel_case_dict(model: 'BaseModel') -> Dict[str, Any]:
    original_iter = BaseModel._iter

    def custom_iter(self, *args, **kwargs):
        res = original_iter(self, *args, **kwargs)
        for k, v in res:
            yield camelcase(k), v

    try:
        BaseModel._iter = custom_iter
        return model.dict()
    finally:
        BaseModel._iter = original_iter


kiara = Kiara.instance()

wf = kiara.create_workflow("mockWorkflow")
state = wf.get_current_state()


def step_status_representer(dumper, status: StepStatus):
    return dumper.represent_scalar('tag:yaml.org,2002:str', str(status.value))


yaml.add_representer(StepStatus, step_status_representer)


print(yaml.dump(as_camel_case_dict(state), default_flow_style=False))
