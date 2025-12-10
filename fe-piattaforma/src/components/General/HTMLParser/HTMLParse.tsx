import React from 'react';
import DOMPurify from 'dompurify';

interface HTMLParseI {
  html?: string | undefined;
}

const HTMLParser = ({ html = '<p></p>' }: HTMLParseI) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

export default HTMLParser;
