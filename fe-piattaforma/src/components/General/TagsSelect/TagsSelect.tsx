import _ from 'lodash';
import React from 'react';
import AsyncSelect from 'react-select/async';
import { proxyCall } from '../../../redux/features/forum/forumThunk';

interface TagsSelectI {
  selectedTags: string[];
}

const TagsSelect = ({ selectedTags }: TagsSelectI) => {
  const getFilteredTags = _.debounce(async (inputValue: string) => {
    try {
      //const res = await proxyCall(`api/search/tags?keys=${inputValue}`, 'GET')
      console.log(inputValue);

      const res = await proxyCall(`/tags/retrieve`, 'GET');
      const newTags: any[] = res.data?.data?.items || [];
      console.log(newTags.filter((t) => !selectedTags.includes(t)));

      return newTags
        .filter((t) => !selectedTags.includes(t))
        .map((t) => ({
          label: t.name,
          value: t.name,
        }));
    } catch (error) {
      console.log(error);
    }
  }, 500);

  return (
    <div>
      <AsyncSelect loadOptions={getFilteredTags} />
    </div>
  );
};

export default TagsSelect;
