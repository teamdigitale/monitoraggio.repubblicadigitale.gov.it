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

// Funzione per preservare le virgolette non escapate nel contenuto testuale
const preserveQuotes = (html: string): string => {
  // Sostituisce tutte le &quot; con " per preservare il testo originale
  // Questo funziona perché l'editor ha una toolbar limitata senza link o attributi complessi
  let processedHtml = html.replace(/&quot;/g, '"');
  
  // Gestione specifica per il pattern '.."' usando zero-width space per prevenire escaping
  // Aggiunge uno zero-width space (\u200B) prima delle virgolette problematiche
  processedHtml = processedHtml.replace(/\.\."/g, '..\u200B"');
  
  return processedHtml;
};

// Funzione per ripulire il testo quando viene caricato nell'editor
const cleanInputText = (text: string): string => {
  // Rimuove gli zero-width space che potrebbero essere stati aggiunti precedentemente
  return text.replace(/\u200B/g, '');
};

interface TextEditorI {
  text: string;
  onChange: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const TextEditor = ({ text, onChange, maxLength = 1500, placeholder }: TextEditorI) => {
  const [hasFocus, setHasFocus] = useState(false);
  const cleanedText = cleanInputText(text);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(cleanedText).contentBlocks,
        convertFromHTML(cleanedText).entityMap
      )
    )
  );

  useEffect(() => {
    const currentHtml = preserveQuotes(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    const cleanedText = cleanInputText(text);
    const cleanedCurrentHtml = cleanInputText(currentHtml);
    
    // Confronta solo se c'è una vera differenza nel contenuto, ignorando gli zero-width spaces
    if (cleanedCurrentHtml !== cleanedText)
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(cleanedText).contentBlocks,
            convertFromHTML(cleanedText).entityMap
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
        placeholder={placeholder}
        onEditorStateChange={(editorState) => {
          if (
            editorState.getCurrentContent().getPlainText().length <= maxLength
          ) {
            setEditorState(editorState);
            onChange(
              preserveQuotes(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            );
          } else {
            setEditorState(
              EditorState.createWithContent(
                ContentState.createFromBlockArray(
                  convertFromHTML(cleanInputText(text)).contentBlocks,
                  convertFromHTML(cleanInputText(text)).entityMap
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
          onChange(preserveQuotes(draftToHtml(convertToRaw(editorState.getCurrentContent()))));
        }}
        onFocus={() => {
          setHasFocus(true);
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(cleanInputText(text)).contentBlocks,
                convertFromHTML(cleanInputText(text)).entityMap
              )
            )
          );
        }}
      />
    </div>
  );
};

export default TextEditor;
