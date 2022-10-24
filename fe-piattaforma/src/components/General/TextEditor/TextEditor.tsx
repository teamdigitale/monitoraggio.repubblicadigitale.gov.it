import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './TextEditor.scss';

interface TextEditorI {
  text: string;
  onChange: (text: string) => void;
}

const TextEditor = ({ text, onChange }: TextEditorI) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(text).contentBlocks,
        convertFromHTML(text).entityMap
      )
    )
  );

  useEffect(() => {
    if (draftToHtml(convertToRaw(editorState.getCurrentContent())) !== text)
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(text).contentBlocks,
            convertFromHTML(text).entityMap
          )
        )
      )
  }, [text])

  return (
    <div className='editor-container'>
      <Editor
      toolbar={{
        options: ['inline'],
        inline: {
          options: ['bold', 'italic', 'underline']
        }
      }}
        editorState={editorState}
        onEditorStateChange={(editorState) => {
          setEditorState(editorState)
          onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
        wrapperClassName='wrapper'
        editorClassName='editor'
        toolbarClassName='toolbar'
        onBlur={() =>
          onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
        onFocus={() =>
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(text).contentBlocks,
                convertFromHTML(text).entityMap
              )
            )
          )
        }
      />
    </div>
  );
};

export default TextEditor;
