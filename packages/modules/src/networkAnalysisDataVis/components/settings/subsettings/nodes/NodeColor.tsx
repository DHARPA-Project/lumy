import React, { useContext } from 'react'

import { OptionSelector, Option } from '../../../common/OptionSelector'
import { NetworkGraphContext } from '../../../../context'

const colorCodeNodeValues: Option[] = [
  { value: String(false), label: 'current group from the mapping step' },
  { value: String(true), label: 'same for all nodes' }
]

type NodeColorProps = {
  subsettingId: string
}

const NodeColor = ({ subsettingId }: NodeColorProps): JSX.Element => {
  const { colorCodeNodes, setColorCodeNodes } = useContext(NetworkGraphContext)

  return (
    <OptionSelector
      value={String(colorCodeNodes)}
      onValueChanged={v => setColorCodeNodes?.(v === String(true))}
      documentationId={subsettingId}
      label="node color"
      options={colorCodeNodeValues}
    />
  )
}

export default NodeColor
