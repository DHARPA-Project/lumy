import React from 'react'

const BgColor = {
  Default: '#eee',
  Dropping: '#ddd'
}

interface Props {
  onFilesDropped: (files: File[]) => void
}

export const Dropzone = ({ onFilesDropped }: Props): JSX.Element => {
  const [isDropping, setIsDropping] = React.useState(false)

  const handleDropStarted = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropping(true)
  }
  const handleDropAborted = () => setIsDropping(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropping(false)
    onFilesDropped(Array.from(e.dataTransfer.files))
  }

  return (
    <div
      style={{
        width: 100,
        height: 100,
        border: '1px dashed',
        backgroundColor: isDropping ? BgColor.Dropping : BgColor.Default
      }}
      onDrop={handleDrop}
      onDragEnter={handleDropStarted}
      onDragLeave={handleDropAborted}
      onDragOver={e => e.preventDefault()}
    ></div>
  )
}
