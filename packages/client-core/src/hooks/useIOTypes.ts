interface AccetpedAndCurrentTypes {
  accepted: string[]
  current?: string
}

type IOTypeSet<T> = { [key in keyof T]: AccetpedAndCurrentTypes }

type IOTypes<I, O> = {
  inputs: IOTypeSet<I>
  outputs: IOTypeSet<O>
}

/**
 * For every input and output get an object describing what types
 * are accepted in this input/output and if it contains a value, the
 * type of this value.
 *
 * @param stepId ID of the step.
 */
export const useIOTypes = <InputsModel, OutputsModel>(stepId: string): IOTypes<InputsModel, OutputsModel> => {
  // TODO: not implemented.
  console.warn('"useIOTypes" Not implemented', stepId)
  return {
    inputs: {} as { [key in keyof InputsModel]: AccetpedAndCurrentTypes },
    outputs: {} as { [key in keyof OutputsModel]: AccetpedAndCurrentTypes }
  }
}
