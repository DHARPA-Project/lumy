from kiara import Kiara

kiara = Kiara.instance()

wf = kiara.create_workflow("mockWorkflow")
j = wf.get_current_state().json()
print(j)
