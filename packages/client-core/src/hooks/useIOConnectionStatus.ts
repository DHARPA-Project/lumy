type IOConnectionStatus<T> = { [key in keyof T]: boolean }

type ConnectionStatus<I, O> = {
  inputs: IOConnectionStatus<I>
  outputs: IOConnectionStatus<O>
}

/**
 * For every input and output get their connection status.
 * `true` means the input/output is connected to another step.
 * `false` means the input/output is not connected. For inputs
 * this means that it can be changed by the UI.
 *
 * @param stepId ID of the step.
 */
export const useIOConnectionStatus = <InputsModel, OutputsModel>(
  stepId: string
): ConnectionStatus<InputsModel, OutputsModel> => {
  // TODO: not implemented.
  console.warn('"useIOConnectionStatus" Not implemented', stepId)
  return {
    inputs: {} as { [key in keyof InputsModel]: boolean },
    outputs: {} as { [key in keyof OutputsModel]: boolean }
  }
}
