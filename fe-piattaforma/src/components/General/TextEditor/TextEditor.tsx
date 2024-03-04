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
import clsx from 'clsx';

interface TextEditorI {
  text: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

const TextEditor = ({ text, onChange, maxLength = 1500 }: TextEditorI) => {
  const [hasFocus, setHasFocus] = useState(false);
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
      );
  }, [text]);

  return (
    <div className={clsx('editor-container', hasFocus && 'has-focus')}>
      <Editor
        toolbar={{
          options: ['inline'],
          inline: {
            options: ['bold', 'italic', 'underline'],
          },
        }}
        editorState={editorState}
        onEditorStateChange={(editorState) => {
          if (
            editorState.getCurrentContent().getPlainText().length <= maxLength
          ) {
            setEditorState(editorState);
            onChange(
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            );
          } else {
            setEditorState(
              EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(text).contentBlocks,
                  convertFromHTML(text).entityMap
                )
              )
            );
          }
        }}
        wrapperClassName='wrapper'
        editorClassName='editor'
        toolbarClassName='toolbar'
        handlePastedText={() => false}
        onBlur={() => {
          setHasFocus(false);
          onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        }}
        onFocus={() => {
          setHasFocus(true);
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(text).contentBlocks,
                convertFromHTML(text).entityMap
              )
            )
          );
        }}
      />
    </div>
  );
};

export default TextEditor;
