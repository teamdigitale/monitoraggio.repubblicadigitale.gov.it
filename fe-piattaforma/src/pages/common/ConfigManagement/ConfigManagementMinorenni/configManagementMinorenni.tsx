import React, { useState } from 'react';
import { Button, Icon } from 'design-react-kit';
import {
    StatusChip,
    Table,
} from '../../../../components';
import { newTable, TableRowI } from '../../../../components/Table/table';
import { formTypes, TableHeadingMinorenni } from '../../../administrator/AdministrativeArea/Entities/utils';
import '../configManagement.scss';
import ManageAbilitaProgramma from '../../../administrator/AdministrativeArea/Entities/modals/manageAbilitaProgram';
import { openModal } from '../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { GetProgramDetail } from '../../../../redux/features/administrativeArea/programs/programsThunk';


const ConfigManagementMinorenni: React.FC = () => {
    const [creation, setCreation] = useState<boolean>(false);
    const dispatch = useDispatch();
    const programmi = [         //dati per mockup, sostiuire con metodo che recupera righe tabella configurazione_minorenni
        {
            nome: '#digitalizziamoci',
            intervento: 'RFD',
            dataAbilitazione: '15/01/2025',
            dataDecorrenza: '16/01/2025',
            stato: 'PROGRAMMATA',
            statoClasse: 'badge badge-primary'
        },
        {
            nome: 'Programma 2',
            intervento: 'RFD',
            dataAbilitazione: '01/11/2024',
            dataDecorrenza: '30/11/2024',
            stato: 'ABILITATA',
            statoClasse: 'badge badge-secondary'
        }
    ];
    const tableValues = newTable(
        TableHeadingMinorenni,
        programmi.map((td: any) => ({
            nomeProgramma: td.nome,
            intervento: td.intervento,
            dataAbilitazione: td.dataAbilitazione,
            dataDecorrenza: td.dataDecorrenza,
            stato: <StatusChip status={td.stato} rowTableId={td.nome} />,
        }))
    );
 
    const handleAbilitaProgramma = () => {
        setCreation(true);
        dispatch(
              openModal({
                id: formTypes.PROGRAMMA,
                payload: {
                  title: 'Abilita programma',
                },
              })
            );
    };

    const handleModificaProgramma = (row: TableRowI) => {
        setCreation(false);
        console.log("id:",row.id);              //modificare dopo che la tabella sarà stata sistemata
        
        GetProgramDetail(row.id as string)
        dispatch(
            openModal({
              id: formTypes.PROGRAMMA,
              payload: {
                title: 'Modifica programma',
              },
            })
          );
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-start">
                <div style={{ marginRight: '50px', marginBottom: '100px' }}>
                    <p className='custom-section-title__section-title main-title primary-color-a9 text-left'>Programmi abilitati all'inserimento di minori</p>
                    <p className='primary-color-a9 mb-0'> I programmi di entrambi gli interventi (RFD e SCD) possono accogliere la partecipazione di persone di minore età a condizione che siano abilitati alla raccolta e all’inserimento su Facilita dei relativi codici fiscali.
                        <br />Gestisci l’abilitazione dei programmi all’inserimento dei codici fiscali di minori. </p>
                </div>
                <div className='mt-3'>
                    <Button
                        color='primary'
                        icon
                        className='page-title__cta'
                        onClick={handleAbilitaProgramma}
                        aria-label={`Abilita programma`}
                    >
                        <Icon
                            color='white'
                            icon='it-plus'
                            className='mr-2'
                            aria-label={'Abilita programma'}
                            aria-hidden={true}
                        />
                        <span className='text-nowrap'>Abilita programma</span>
                    </Button>
                </div>
            </div>

            <Table
                {...tableValues}
                id='table'
                onActionClick={{
                    edit: (row) => {
                        if (typeof row !== 'string') {
                            handleModificaProgramma(row);
                        } else {
                            console.error('Invalid row type:', row);
                        }
                    },
                }}
                withActions
                totalCounter={programmi.length}
                className='table-compact'
                canSort
                onSort={(orderBy: string, direction: string) => {   //da gestire
                    console.log(`Sorting by ${orderBy} in ${direction} order`);
                }}
            />
            <ManageAbilitaProgramma creation={creation}/>
        </div>
    );
};

export default ConfigManagementMinorenni;