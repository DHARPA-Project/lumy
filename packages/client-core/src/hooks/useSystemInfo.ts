import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

type SystemInfo = Messages.Activity.SystemInfo

const getLumyUIVersion = () => {
  const version = process.env.LUMY_VERSION ?? 'unknown'
  const buildHash = process.env.LUMY_BUILD_HASH ?? 'unknown'
  return `${version}-${buildHash}`
}

export const useSystemInfo = (): SystemInfo => {
  const context = useContext(BackEndContext)
  const [info, setInfo] = useState<SystemInfo>({ versions: {} })

  useEffect(() => {
    const handler = handlerAdapter(Messages.Activity.codec.SystemInfo.decode, msg => setInfo(msg))
    context.subscribe(Target.Activity, handler)

    // get the most recent data on first use
    context.sendMessage(Target.Activity, Messages.Activity.codec.GetSystemInfo.encode(null))

    return () => context.unsubscribe(Target.Activity, handler)
  }, [])

  return info != null
    ? { ...info, versions: Object.assign(info?.versions ?? {}, { ui: getLumyUIVersion() }) }
    : undefined
}
