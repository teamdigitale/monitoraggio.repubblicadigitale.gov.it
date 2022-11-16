import _ from 'lodash';
import React from 'react';
import AsyncSelect from 'react-select/async';

interface TagsSelectI {
  id?: string | undefined;
  tags: {
    label: string;
    value: string;
  }[];
  selectedTags: string[];
  addTag: (tag: string) => void;
}

const TagsSelect = ({ selectedTags, tags, addTag, id = '' }: TagsSelectI) => {

  const getFilteredTags = async (inputValue: string) =>
    new Promise((resolve) =>
      resolve(() =>
        tags.filter(
          (t) =>
            !selectedTags.includes(t.label) &&
            t.label.toLowerCase().includes(inputValue.toLowerCase())
        ).length
          ? tags.filter(
            (t) =>
              !selectedTags.includes(t.label) &&
              t.label.toLowerCase().includes(inputValue.toLowerCase())
          )
          : [
            {
              label: inputValue,
              value: inputValue,
            },
          ]
      )
    );

  return (
    <div className='col-12 my-3 p-0'>
      <AsyncSelect
        value=''
        defaultOptions={tags as any}
        maxMenuHeight={160}
        noOptionsMessage={() => "Nessuna opzione disponibile"}
        loadOptions={getFilteredTags}
        onChange={(val: any) => addTag(val.value as string)}
        placeholder='Digita la parola chiave e utilizza il completamento automatico per evitare errori di digitazione.'
        aria-label='campo di testo'
        id={id}
      />
    </div>
  );
};

export default TagsSelect;
