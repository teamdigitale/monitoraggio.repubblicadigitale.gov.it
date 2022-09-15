import React, { ChangeEvent, memo, useState } from 'react';
import { Button, Icon, Input } from 'design-react-kit';

interface SearchBoxI {
  onClick?: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxI> = (props) => {
  const { onClick } = props;
  const [value, setValue] = useState<string | null>();

  const handleChange = ({
    currentTarget: { value: newValue },
  }: ChangeEvent<HTMLInputElement>) => {
    setValue(newValue);
  };

  const handleClick = () => {
    if (onClick && value) onClick(value);
  };
  return (
    <div className='searchbox d-inline-flex align-items-center'>
      <Input onChange={(v) => handleChange(v)} placeholder='Cerca' />
      <Button color='primary' onClick={handleClick}>
        <Icon color='white' icon='it-search' size='sm' aria-label='Cerca' />
      </Button>
    </div>
  );
};

export default memo(SearchBox);
