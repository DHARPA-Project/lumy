import React, { useContext } from 'react'

import { OptionSelector, Option } from '../../../common/OptionSelector'
import { NetworkGraphContext } from '../../../../context'

const colorCodeNodeValues: Option[] = [
  { value: String(false), label: 'current group from the mapping step' },
  { value: String(true), label: 'same for all nodes' }
]

const NodeColor = (): JSX.Element => {
  const { colorCodeNodes, setColorCodeNodes } = useContext(NetworkGraphContext)

  return (
    <OptionSelector
      value={String(colorCodeNodes)}
      onValueChanged={v => setColorCodeNodes?.(v === String(true))}
      label="node color"
      values={colorCodeNodeValues}
    />
  )
}

export default NodeColor
