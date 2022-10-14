import React from 'react'

interface HTMLParseI {
    html?: string | undefined
}

const HTMLParser = ({ html = '<p></p>' }: HTMLParseI) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
)

export default HTMLParser