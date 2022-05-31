import React from 'react';
import { Icon } from 'design-react-kit';

const Loader: React.FC = () => (
  <div className='custom-loader'>
    <Icon icon='it-refresh' className='custom-loader--rotate' />
  </div>
);

export default Loader;
