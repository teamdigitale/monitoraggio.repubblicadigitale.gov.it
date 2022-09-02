import { Button, Chip, ChipLabel, Col, Container, Row } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MessageList from './MessageList/messageList';
import SingleMessage from './SingleMessage/singleMessage';
import './notifications.scss';
import clsx from 'clsx';
import NotificationCard from '../../components/NotificationCards/notificationCard';
import { updateBreadcrumb } from '../../../../../redux/features/app/appSlice';
import PageTitle from '../../../../../components/PageTitle/pageTitle';

const MessageListCardMock = [
  {
    id: 1,
    icon: 'it-mail',
    title: 'Lorem',
    object: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu felis, mollis sed quam a, rhoncus fringilla libero. Sed cursus tortor in iaculis convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam erat neque, commodo at mattis sed, sollicitudin nec nunc. Aliquam erat volutpat. Nam eu porttitor arcu, ac vehicula tortor. Integer erat nisi, molestie quis ex a, placerat blandit nibh. Vivamus sodales, nunc ut consectetur semper, augue metus consequat lectus, ac tristique velit purus nec enim. Maecenas luctus varius ante, eu varius lorem mattis at. Donec eget consequat massa. Phasellus condimentum imperdiet ex et vulputate. Quisque purus libero, placerat vel tristique id, eleifend eget dui.',
    date: '10/05/2022',
  },
  {
    id: 2,
    icon: 'it-mail',
    title: 'Lorem',
    object: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu felis, mollis sed quam a, rhoncus fringilla libero. Sed cursus tortor in iaculis convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam erat neque, commodo at mattis sed, sollicitudin nec nunc. Aliquam erat volutpat. Nam eu porttitor arcu, ac vehicula tortor. Integer erat nisi, molestie quis ex a, placerat blandit nibh. Vivamus sodales, nunc ut consectetur semper, augue metus consequat lectus, ac tristique velit purus nec enim. Maecenas luctus varius ante, eu varius lorem mattis at. Donec eget consequat massa. Phasellus condimentum imperdiet ex et vulputate. Quisque purus libero, placerat vel tristique id, eleifend eget dui.',
    date: '9/05/2022',
  },
  {
    id: 3,
    icon: 'it-mail',
    title: 'Lorem',
    object: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu felis, mollis sed quam a, rhoncus fringilla libero. Sed cursus tortor in iaculis convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam erat neque, commodo at mattis sed, sollicitudin nec nunc. Aliquam erat volutpat. Nam eu porttitor arcu, ac vehicula tortor. Integer erat nisi, molestie quis ex a, placerat blandit nibh. Vivamus sodales, nunc ut consectetur semper, augue metus consequat lectus, ac tristique velit purus nec enim. Maecenas luctus varius ante, eu varius lorem mattis at. Donec eget consequat massa. Phasellus condimentum imperdiet ex et vulputate. Quisque purus libero, placerat vel tristique id, eleifend eget dui.',
    date: '8/05/2022',
  },
  {
    id: 4,
    icon: 'it-mail',
    title: 'Lorem',
    object: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu felis, mollis sed quam a, rhoncus fringilla libero. Sed cursus tortor in iaculis convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam erat neque, commodo at mattis sed, sollicitudin nec nunc. Aliquam erat volutpat. Nam eu porttitor arcu, ac vehicula tortor. Integer erat nisi, molestie quis ex a, placerat blandit nibh. Vivamus sodales, nunc ut consectetur semper, augue metus consequat lectus, ac tristique velit purus nec enim. Maecenas luctus varius ante, eu varius lorem mattis at. Donec eget consequat massa. Phasellus condimentum imperdiet ex et vulputate. Quisque purus libero, placerat vel tristique id, eleifend eget dui.',
    date: '7/05/2022',
  },
];

const SingleMessageCardMock = {
  title: 'Lorem',
  object: 'Lorem ipsum',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu felis, mollis sed quam a, rhoncus fringilla libero. Sed cursus tortor in iaculis convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam erat neque, commodo at mattis sed, sollicitudin nec nunc. Aliquam erat volutpat. Nam eu porttitor arcu, ac vehicula tortor. Integer erat nisi, molestie quis ex a, placerat blandit nibh. Vivamus sodales, nunc ut consectetur semper, augue metus consequat lectus, ac tristique velit purus nec enim. Maecenas luctus varius ante, eu varius lorem mattis at. Donec eget consequat massa. Phasellus condimentum imperdiet ex et vulputate. Quisque purus libero, placerat vel tristique id, eleifend eget dui.',
  date: '10/05/2022',
};

const SingleMessageMock = [SingleMessageCardMock];
/*const openSingleMessage = () => {
  console.log('APRI MESSAGGIO SINGOLO');
};*/

const NotificationOnePropsMock = {
  icon: 'it-inbox',
  title: 'Da leggere',
  value: 1,
  ariaLabel: 'da leggere',
};
const NotificationTwoPropsMock = {
  icon: 'it-files',
  title: 'Lette',
  value: 15,
  ariaLabel: 'lette',
};
const NotificationMock = [NotificationOnePropsMock, NotificationTwoPropsMock];

const Notifications = () => {
  const dispatch = useDispatch();
  const [notification] = useState(NotificationMock);

  const handleDeleteMessage = () => {
    console.log('Elimina messaggio');
  };

  useEffect(() => {
    dispatch(
      updateBreadcrumb([
        {
          label: 'Area notifiche',
          url: '/notifiche',
          link: false,
        },
      ])
    );
  }, []);

  return (
    <>
      <PageTitle title='Le tue notifiche' />
      {notification?.length ? (
        <div className='notifications-card-container pt-4'>
          {notification.map((notificationElement, i) => (
            <NotificationCard key={i} {...notificationElement} />
          ))}
        </div>
      ) : null}
      <Container>
        <Row className='notifications-container pb-5'>
          <Col
            md={3}
            className='mt-5 notifications-container__column-message-list'
          >
            {MessageListCardMock.length ? (
              <>
                {MessageListCardMock.map((list, i) => (
                  <div key={i} role='button' /*onClick={openSingleMessage}*/>
                    <MessageList
                      // TODO update key with a unique value
                      {...list}
                    />
                  </div>
                ))}
              </>
            ) : null}
          </Col>
          <Col md={8} className='mt-2'>
            {SingleMessageMock?.length ? (
              <>
                {SingleMessageMock.map((doc, i) => (
                  <SingleMessage
                    // TODO update key with a unique value
                    key={i}
                    {...doc}
                  />
                ))}
                <Chip
                  className={clsx(
                    'mb-2',
                    'mt-3',
                    'ml-5',
                    'w-20',
                    'no-border',
                    'primary-bg-a9',
                    'table-container__status-label'
                  )}
                >
                  <ChipLabel className='text-white'>DA LEGGERE</ChipLabel>
                </Chip>
                <div className='buttons-container'>
                  <Button className='btn btn-outline-primary mr-3'>
                    Vai al progetto
                  </Button>
                  <Button
                    className='btn btn-primary'
                    onClick={() => handleDeleteMessage}
                  >
                    Elimina
                  </Button>
                </div>
              </>
            ) : (
              <div className='my-4'>Non ci sono messaggi selezionati</div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default memo(Notifications);
