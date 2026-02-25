import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imgLaptop from '/public/assets/img/landing-page-img-alternativo.jpg';
import { Button } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import { setLoginType } from '../../redux/features/user/userSlice';


const LandingPageNoSpid: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showImage, setShowImage] = React.useState(false);

    useEffect(() => {
        dispatch(setLoginType('nospid'));

        // controlla se mostrare immagine
        const mq = window.matchMedia('(min-width: 768px)');
        const onChange = (e: MediaQueryListEvent) => setShowImage(e.matches);
        setShowImage(mq.matches);
        if (mq.addEventListener) {
            mq.addEventListener('change', onChange);
        } else {
            mq.addListener(onChange);
        }
        return () => {
            if (mq.removeEventListener) {
                mq.removeEventListener('change', onChange);
            } else {
                mq.removeListener(onChange);
            }
        };
    }, [dispatch]);

    const handleAccess = () => {
        navigate('/auth');
    };

    return (
        <div className="my-5 mx-4 md:mx-0" style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Colonna Testuale */}
            <div>
                <p
                    className={clsx(
                        'font-weight-bold primary-color h4 mb-4'
                    )}>                    
                    Accedi senza identità digitale
                </p>

                <p className={clsx('font-weight-bold', 'text-gray-700', 'text-base', 'md:text-lg', 'max-w-md', 'mb-3')}>
                    Questa pagina di accesso è riservata agli utenti che non dispongono di identità digitale (SPID o CIE).
                </p>

                <p className="text-gray-700 text-base md:text-lg max-w-md mb-5">
                    Facilita è il progetto del Dipartimento per la trasformazione digitale per gestire e monitorare i servizi di facilitazione digitale promossi dalla Rete dei servizi di facilitazione digitale e dal Servizio civile digitale.
                </p>
                <Button className='cta-button' onClick={() => handleAccess()} color='primary'>
                    Accedi
                </Button>
            </div>
            {showImage && (
                <div>
                    <img
                        src={imgLaptop}
                        alt="Laptop with Facilita interface"
                        className={clsx('w-full', 'max-w-md')}
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
            )}
        </div>
    );
};

export default LandingPageNoSpid;
