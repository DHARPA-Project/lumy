import React, { useContext } from 'react'

import { OptionSelector, Option } from '../../../common/OptionSelector'
import { ScalingMethod } from '../../../../structure'
import { NetworkGraphContext } from '../../../../context'

const scalingMethodLabels: Record<ScalingMethod, string> = {
  degree: 'most connections to other nodes (hubs)',
  betweenness: 'bridges between groups of nodes (brokers)',
  eigenvector: 'best connected to hubs',
  indegree: 'In degree',
  outdegree: 'Out degree'
}
const scalingMethodValues: Option[] = [{ value: undefined, label: 'equal' }].concat(
  Object.entries(scalingMethodLabels).map(([value, label]) => ({ value, label }))
)

type NodeSizeProps = {
  subsettingId: string
}

const NodeSize = ({}: NodeSizeProps): JSX.Element => {
  const { nodeScalingMethod, setNodeScalingMethod } = useContext(NetworkGraphContext)

  return (
    <OptionSelector
      value={nodeScalingMethod}
      onValueChanged={v => setNodeScalingMethod?.(v as ScalingMethod)}
      label="size"
      options={scalingMethodValues}
    />
  )
}

export default NodeSize
