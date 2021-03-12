export interface MessageEnvelope<T, A extends string = string> {
  action: A
  content: T
}

export type ME<T, A extends string = string> = MessageEnvelope<T, A>

export type IDecode<T, A extends string = string> = (msg: ME<T, A>) => T | undefined
export type IEncode<T, A extends string = string> = (content: T) => MessageEnvelope<T, A>

type ICodec<T, A extends string = string> = {
  decode: IDecode<T, A>
  encode: IEncode<T, A>
}

export const Codec = <T, A extends string = string>(action: A): ICodec<T, A> => ({
  decode: (msg: ME<T, A>): T | undefined => {
    if (msg.action === action) return msg.content
    return undefined
  },
  encode: (content: T): MessageEnvelope<T, A> => ({
    action,
    content
  })
})
