import { useContext, useState, useEffect } from 'react'
import { deserialize } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TabularDataFilter } from '../common/types'
import { getHash } from '../common/utils/hash'

export const useDataRepositoryItemValue = <ValueType, MetadataType = unknown, FilterType = TabularDataFilter>(
  itemId: string,
  filter?: FilterType
): [ValueType | undefined, MetadataType | undefined] => {
  const context = useContext(BackEndContext)
  const [value, setValue] = useState<ValueType>()
  const [metadata, setMetadata] = useState<MetadataType>()

  const getValue = () => {
    const msg = Messages.DataRepository.codec.GetItemValue.encode({
      itemId,
      filter
    })
    context.sendMessage(Target.DataRepository, msg)
  }

  useEffect(() => {
    if (itemId == null) return
    const getValueHandler = handlerAdapter(Messages.DataRepository.codec.ItemValue.decode, content => {
      if (content.itemId === itemId && getHash(content.filter) === getHash(filter)) {
        const [newValue, newMetadata] = deserialize<ValueType, MetadataType>(
          content.value,
          content.metadata,
          content.type
        )
        setValue(newValue)
        setMetadata(newMetadata)
      }
    })

    context.subscribe(Target.DataRepository, getValueHandler)

    // get value straight away
    getValue()

    return () => context.unsubscribe(Target.ModuleIO, getValueHandler)
  }, [itemId, getHash(filter)])

  return [value, metadata]
}
