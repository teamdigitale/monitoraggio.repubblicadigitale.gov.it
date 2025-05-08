import React, { useEffect, useState } from 'react';
import { Button, Icon } from 'design-react-kit';
import {
    Paginator,
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
import { GetAllConfigurazioniMinorenniPaginate } from '../../../../redux/features/citizensArea/citizensAreaThunk';
import { selectEntityPagination, setEntityPagination } from '../../../../redux/features/citizensArea/citizensAreaSlice';
import { useAppSelector } from '../../../../redux/hooks';
import useGuard from '../../../../hooks/guard';

const ConfigManagementMinorenni: React.FC = () => {
    const [creation, setCreation] = useState<boolean>(false);
    const [programmi, setProgrammi] = useState<any>([]);
    const pagination = useAppSelector(selectEntityPagination);
    const { pageNumber } = pagination;
    const { hasUserPermission } = useGuard();    
    const dispatch = useDispatch();
    const [sortDirection, setSortDirection] = useState<string>('desc');
    const [sortBy, setSortBy] = useState<string>('data_abilitazione');

    const fetchData = async (currentPage: number, sortByProps?: string, sortDirectionProps?: string) => {  
              
        try {
            const payload = {
                currentPage: currentPage - 1,
                pageSize: 8,
                sortBy: sortByProps ? sortByProps : sortBy,
                sortOrder: sortDirectionProps ? sortDirectionProps : sortDirection,
            };
            const data = await dispatch(GetAllConfigurazioniMinorenniPaginate(payload)) as any;       
            dispatch(setEntityPagination({ pageSize: 8, totalElements: data.numeroTotaleElementi, totalPages: data.numeroPagine }));     
            setProgrammi(data.configurazioniMinorenniList); 
          } catch (error) {
            console.error("Failed to fetch data:", error);
          }
    };

    const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
        dispatch(setEntityPagination({ pageNumber }));
        fetchData(pageNumber);
    };
    
    const updateTableValues = () => {        
        return programmi && programmi?.length > 0 ? newTable(
            TableHeadingMinorenni,
            programmi.map((td: any) => ({
                id: td.id,
                id_prog: td.idProgramma,
                nomeProgramma: td.nomeProgramma,
                intervento: td.intervento,
                dataAbilitazione: new Date(td.dataAbilitazione).toLocaleDateString('it-IT'),
                dataDecorrenza: new Date(td.dataDecorrenza).toLocaleDateString('it-IT'),
                stato: <StatusChip status={new Date(td.dataDecorrenza) > new Date() ? 'PROGRAMMATA' : 'ABILITATA'} rowTableId={td.nome} />,
                actions: new Date(td.dataDecorrenza) > new Date() ? ['edit'] : [], // solo se PROGRAMMATA
            }))
        ) : newTable(
            TableHeadingMinorenni,
            []
        );
    };

    const [tableValues, setTableValues] = useState(updateTableValues());

    useEffect(() => {
        if (Array.isArray(programmi) && programmi.length)
          setTableValues(updateTableValues());
    }, [programmi]);

 
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
        dispatch(GetProgramDetail(row.id_prog as string));        
        dispatch(
            openModal({
              id: formTypes.PROGRAMMA,
              payload: {
                title: 'Modifica abilitazione',
                row: row,
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
                        disabled={!hasUserPermission(['gest.conf.min'])}
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
                onActionClick={
                    hasUserPermission(['gest.conf.min']) 
                        ? {
                              edit: (row) => {
                                  if (typeof row !== 'string') {
                                      handleModificaProgramma(row);
                                  } else {
                                      console.error('Invalid row type:', row);
                                  }
                              },
                          }
                        : {}
                }
                withActions
                totalCounter={programmi?.length}
                className='table-compact-cmin'
                onSort={(orderBy: string, direction: string) => {
                    setSortBy(orderBy);
                    setSortDirection(direction);
                    fetchData(pagination?.pageNumber, orderBy, direction);
                }}
                canSort
            />
            {pagination?.pageNumber ? (
              <Paginator
                activePage={pagination?.pageNumber}
                center
                refID='#table'
                pageSize={pagination?.pageSize}
                total={pagination?.totalPages}
                onChange={handleOnChangePage}
              />
            ) : null}
            <ManageAbilitaProgramma creation={creation} fetchData={fetchData}/>
        </div>
    );
};

export default ConfigManagementMinorenni;