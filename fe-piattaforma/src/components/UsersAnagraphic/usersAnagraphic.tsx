import { useEffect } from 'react';
import { GetUsersAnagrapic } from '../../redux/features/anagraphic/anagraphicThunk';
import { useDispatch } from 'react-redux';

interface UsersAnagraphicI {
  clock?: number;
}

const UsersAnagraphic: React.FC<UsersAnagraphicI> = (props) => {
  const { clock = 2000 } = props;
  const dispatch = useDispatch();

  const getUsersAnagraphic = () => {
    dispatch(GetUsersAnagrapic());
  };

  const initiateCron = () => {
    setInterval(getUsersAnagraphic, clock);
  };

  useEffect(() => {
    initiateCron();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default UsersAnagraphic;
