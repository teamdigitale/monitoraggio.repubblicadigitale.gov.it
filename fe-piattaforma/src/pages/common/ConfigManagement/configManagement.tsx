import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { Nav, NavItem } from 'design-react-kit';
import { NavLink } from '../../../components';
import clsx from 'clsx';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfigManagementMinorenni from './ConfigManagementMinorenni/configManagementMinorenni';

const tabs = {
    CARICAMENTIMASSIVI: 'caricamenti-massivi',
    MINORENNI: 'minorenni',
};

const ConfigManagement: React.FC = () => {
    const device = useAppSelector(selectDevice);
    const [activeTab, setActiveTab] = useState<string>(tabs.MINORENNI);  
    const navigate = useNavigate();
    const location = useLocation();
    
    const disabledPageContent = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        </div>
    );


    const [content, setContent] = useState<JSX.Element>(disabledPageContent);

    useEffect(() => {
        const locationSplit = location.pathname.split('/');
        if (locationSplit.length) {
            const lastSegment = locationSplit[locationSplit.length - 1]; 
            switch (lastSegment) {
                case tabs.CARICAMENTIMASSIVI:
                    setActiveTab(tabs.CARICAMENTIMASSIVI);
                    setContent(disabledPageContent);
                    break;
                case tabs.MINORENNI:
                    setActiveTab(tabs.MINORENNI);
                    setContent(<ConfigManagementMinorenni />);
                    break;
                default:
                    setActiveTab(tabs.MINORENNI);
                    navigate('/gestione-configurazioni/minorenni', { replace: true });
                    break;
            }
        }
    }, [location, navigate]);

    const nav = (
        <Nav
            tabs
            className={clsx('mb-5', !device.mediaIsPhone && 'overflow-hidden')}
            role='menu'
        >
            {/* <NavItem role='none'>           decommentare quando vi sarà necessità di un'altra tab
                <span>
                    <NavLink
                        to={`/gestione-configurazioni/caricamenti-massivi`}
                        active={activeTab === tabs.CARICAMENTIMASSIVI}
                        role='menuitem'
                        onKeyDown={() => setActiveTab(tabs.CARICAMENTIMASSIVI)}
                    >
                        Caricamenti massivi
                    </NavLink>
                </span>
            </NavItem> */}
            <NavItem role='none'>
                <span>
                    <NavLink
                        to={`/gestione-configurazioni/minorenni`}
                        active={activeTab === tabs.MINORENNI}
                        role='menuitem'
                        onKeyDown={() => setActiveTab(tabs.MINORENNI)}
                    >
                        Abilitazione CF minori
                    </NavLink>
                </span>
            </NavItem>
        </Nav>
    );


    return (
        <>
            <PageTitle title="Gestione configurazioni" subtitle='Lorem ipsum'/>
            <div
            className={clsx(
                'd-flex',
                'justify-content-center',
                'w-100',
                'mt-5',
                device.mediaIsPhone ? 'mb-0' : 'mb-5'
            )}
            >
            {nav}
            </div>
            <div style={{marginBottom: '100px'}}>
                {content}
            </div>
            

        </>
    );
};

export default ConfigManagement;