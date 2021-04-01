from .generated import *  # noqa
from ..target import Target

# Adding "action" and "target" message class metdata
# to make it easier to deal with publishing of the messages

for k, v in list(globals().items()):
    if k.startswith('MsgModuleIO'):
        v._action = k.replace('MsgModuleIO', '')
        v._target = Target.ModuleIO
    elif k.startswith('MsgWorkflow'):
        v._action = k.replace('MsgWorkflow', '')
        v._target = Target.Workflow
    elif k.startswith('MsgDataRepository'):
        v._action = k.replace('MsgDataRepository', '')
        v._target = Target.DataRepository
    elif k.startswith('MsgParameters'):
        v._action = k.replace('MsgParameters', '')
        v._target = Target.Parameters
    elif k.startswith('MsgNotes'):
        v._action = k.replace('MsgNotes', '')
        v._target = Target.Notes
    else:
        v._action = k.replace('Msg', '')
        v._target = Target.Activity
