import React from 'react'
import { Table, Utf8Vector, FixedSizeListVector, Utf8, List, Field } from 'apache-arrow'
import {
  ModuleProps,
  useAddFilesToRepository,
  useStepInputValues,
  withMockProcessor
} from '@dharpa-vre/client-core'
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

type Props = ModuleProps<InputValues, OutputValues>

/**
 * This module will have more features. At the moment it is here
 * to test data upload.
 */
const DataUpload = ({ step }: Props): JSX.Element => {
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const [addFilesToRepository] = useAddFilesToRepository()
  const [, setInputs] = useStepInputValues(step.id)

  const handleFilesAdded = (newFiles: File[]) => setFiles(files.concat(newFiles))
  const handleUploadFiles = () => {
    setIsUploading(true)
    addFilesToRepository(files)
      .then(() => {
        setInputs({ filenames: files.map(f => f.name) })
        setFiles([])
      })
      .finally(() => setIsUploading(false))
  }

  return (
    <div key={step.id}>
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
const mockProcessor = (_inputValues: InputValues): OutputValues => {
  const testTableNumbers = [...Array(30).keys()]

  const testTable = Table.new({
    uri: Utf8Vector.from(testTableNumbers.map(n => `uri-${n}`)),
    label: Utf8Vector.from(testTableNumbers.map(n => `Item ${n}`)),
    columns: FixedSizeListVector.from({
      values: testTableNumbers.map(n => [`a${n}`, `b${n}`]),
      type: new List(Field.new({ name: 0, type: new Utf8() }))
    })
  })

  return { repositoryItems: testTable }
}

export default withMockProcessor(DataUpload, mockProcessor)
