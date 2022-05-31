import React from 'react';

import { Icon } from 'design-react-kit';
import { IconProps } from 'design-react-kit/src/Icon/Icon';

export interface additionalIconProps extends IconProps {
  backgroundColor?: string;
  borderRadius?: string;
}

interface InfoCardI {
  text: string;
  icon?: additionalIconProps;
  image?: string;
}

const Infocard: React.FC<InfoCardI> = ({ text, image, icon }) => (
  <div className='info-card-custom'>
    <div className='d-flex justify-content-start align-items-center'>
      <div className='info-card-custom__picture'>
        {image ? <img src={image} /> : null}
        {icon ? (
          <Icon
            {...icon}
            style={{
              backgroundColor: icon.backgroundColor,
              borderRadius: icon.borderRadius,
            }}
          />
        ) : null}
      </div>
      <div>
        <p>{text}</p>
      </div>
    </div>
  </div>
);

export default Infocard;
