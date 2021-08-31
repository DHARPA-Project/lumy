import React from 'react'
import { Table, Utf8Vector, Utf8, List, Field, ListVector } from 'apache-arrow'
import {
  MockProcessorResult,
  ModuleProps,
  useAddFilesToRepository,
  useStepInputValue,
  withMockProcessor
} from '@lumy/client-core'
import { Dropzone } from './Dropzone'

// TODO: This is a special module in the sense that it uses
// data repository upload feature. Not sure if it actually has inputs.
interface InputValues {
  filenames?: string[]
  metadataSets?: unknown[]
}

interface OutputValues {
  repositoryItems?: Table
}

/**
 * This module will have more features. At the moment it is here
 * to test data upload.
 */
const DataUpload = ({ pageDetails: { id: stepId } }: ModuleProps): JSX.Element => {
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const [addFilesToRepository] = useAddFilesToRepository()
  const [, setFilenames] = useStepInputValue<string[]>(stepId, 'filenames')

  const handleFilesAdded = (newFiles: File[]) => setFiles(files.concat(newFiles))
  const handleUploadFiles = () => {
    setIsUploading(true)
    addFilesToRepository(files)
      .then(() => {
        setFilenames(files.map(f => f.name))
        setFiles([])
      })
      .finally(() => setIsUploading(false))
  }

  return (
    <div key={stepId}>
      <Dropzone onFilesDropped={handleFilesAdded} />
      <em>Files to be uploaded:</em>
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
      <button onClick={handleUploadFiles} disabled={isUploading || files.length === 0}>
        Add these files to repository
      </button>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockProcessor = (_inputValues: InputValues): MockProcessorResult<InputValues, OutputValues> => {
  const testTableNumbers = [...Array(30).keys()]

  const testTable = Table.new({
    uri: Utf8Vector.from(testTableNumbers.map(n => `uri-${n}`)),
    label: Utf8Vector.from(testTableNumbers.map(n => `Item ${n}`)),
    columns: ListVector.from({
      values: testTableNumbers.map(n => [`a${n}`, `b${n}`, `c${n}`]),
      type: new List(Field.new({ name: 0, type: new Utf8() })),
      highWaterMark: 1 // NOTE: working around a stride serialisation bug in arrowjs
    })
  })

  return { outputs: { repositoryItems: testTable } }
}

export default withMockProcessor(DataUpload, mockProcessor)
