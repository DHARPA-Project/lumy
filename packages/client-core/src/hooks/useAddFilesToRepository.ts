import { useContext } from 'react'
import { BackEndContext } from '../common/context'

export const useAddFilesToRepository = (): [(files: File[]) => Promise<void>] => {
  const context = useContext(BackEndContext)

  const addFiles = (files: File[]): Promise<void> => {
    return context.addFilesToRepository(files)
  }

  return [addFiles]
}
