import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imgLaptop from '/public/assets/img/landing-page-img.jpg';
import { Button } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import { setLoginType } from '../../redux/features/user/userSlice';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setLoginType('spid'));
    }, [dispatch]);
 
    const handleAccess = () => {
        navigate('/auth');
    };

    return (
        <div className="my-5 ml-4 md:ml-0" style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Colonna Testuale */}
            <div>
                <p
                    className={clsx(
                        'font-weight-bold primary-color h4 mb-4'
                    )}>                    
                    Ti diamo il benvenuto su Facilita
                </p>
                <p className="text-gray-700 text-base md:text-lg max-w-md mb-5">
                    Facilita è il progetto del Dipartimento per la trasformazione digitale per gestire e monitorare i servizi di facilitazione digitale promossi dalla Rete dei servizi di facilitazione digitale e dal Servizio civile digitale.
                </p>
                <Button className='cta-button' onClick={() => handleAccess()} color='primary'>
                    Accedi
                </Button>
            </div>
            <div>
                <img
                    src={imgLaptop}
                    alt="Laptop with Facilita interface"
                    className={clsx('w-full', 'max-w-md')}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
            </div>
        </div>
    );
};

export default LandingPage;
