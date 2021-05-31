import React from 'react'
import { asHtml } from '../util/render'

export interface MarkdownRenderProps {
  content: string
}
export const MarkdownRender = ({ content }: MarkdownRenderProps): JSX.Element => {
  return <div dangerouslySetInnerHTML={{ __html: asHtml(content) }} />
}
