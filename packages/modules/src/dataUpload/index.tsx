import React from 'react'
import { ModuleProps, useAddFilesToRepository, useStepInputValues } from '@dharpa-vre/client-core'
import { Dropzone } from './Dropzone'

// TODO: This is a special module in the sense that it uses
// data repository upload feature. Not sure if it actually has inputs.
interface InputValues {
  filenames?: string[]
  metadataSets?: unknown[]
}

interface OutputValues {
  repositoryItems?: unknown
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

export default DataUpload
