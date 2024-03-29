import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RocketChatLogin } from '../../redux/features/user/userThunk';
import { getSessionValues, setSessionValues } from '../../utils/sessionHelper';
import { ActionTracker } from '../../redux/features/forum/forumThunk';
import { setUserChatToRead } from '../../redux/features/user/userSlice';
import { getMediaQueryDevice } from '../../utils/common';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

// RocketChat Docs https://developer.rocket.chat/rocket.chat/iframe-integration/iframe-events

const iframeHeight = {
  mobile: '520',
  tablet: '670',
  desktop: '570',
};

const RocketChat = () => {
  const [rocketChatToken, setRocketChatToken] = useState<string>();
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);

  const authenticateIFrame = () => {
    const target = document.getElementById('rcChannel');
    if (target && rocketChatToken) {
      console.log('authenticateIFrame');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      target.contentWindow.postMessage(
        {
          externalCommand: 'login-with-token',
          token: rocketChatToken,
        },
        '*'
      );
    }
  };

  useEffect(() => {
    if (rocketChatToken) {
      authenticateIFrame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rocketChatToken]);

  const manageNotification = (e: MessageEvent<any>) => {
    switch (e?.data?.eventName) {
      case 'unread-changed': {
        console.log('messages to read', e?.data?.data || 0);
        dispatch(setUserChatToRead(e?.data?.data || 0));
        break;
      }
      case 'Custom_Script_Logged_Out': {
        console.log('triggered logout');
        /* TODO make some test
        if (rocketChatToken) {
          clearSessionValues('rocketchat');
          dispatch(closeModal());
        }
        */
      }
    }
  };

  const handleOnRocketChatLoad = () => {
    window.addEventListener('message', manageNotification);
    getRocketChatToken();
  };

  const getRocketChatToken = async () => {
    try {
      const token = JSON.parse(getSessionValues('rocketchat'))?.token;
      if (token) {
        setRocketChatToken(token);
      } else {
        const res = await dispatch(RocketChatLogin());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setRocketChatToken(res.data?.authToken);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setSessionValues('rocketchat', { token: res.data?.authToken });
          dispatch(ActionTracker({ target: 'chat' }));
        }
      }
    } catch (err) {
      console.log('getRocketChatToken error', err);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('message', manageNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calcFrameHeight = () => iframeHeight[getMediaQueryDevice(device)];

  return (
    <div>
      <iframe
        title='rocketchat'
        id='rcChannel'
        name='rcChannel'
        src={`${process.env.REACT_APP_ROCKET_CHAT_BASE_URL}?layout=embedded`}
        width='100%'
        height={calcFrameHeight()}
        onLoad={handleOnRocketChatLoad}
        frameBorder='0'
      ></iframe>
    </div>
  );
};

export default RocketChat;
