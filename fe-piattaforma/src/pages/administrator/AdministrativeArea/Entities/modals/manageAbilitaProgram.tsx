import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EmptySection, SearchBar } from '../../../../../components';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import Table, {
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import {
  resetProgramDetails,
  selectEntityList,
  selectPrograms,
  setProgramDetails,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  closeModal,
  openModal,
  selectModalState,
} from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { formFieldI } from '../../../../../utils/formHelper';
import { formTypes } from '../utils';
import '../../../../../components/SearchBar/searchBar.scss';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { GetEntityValues } from '../../../../../redux/features/administrativeArea/administrativeAreaThunk';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import FormAbilitaProgrammaAMinori from '../../../../forms/formPrograms/formAbilitaProgrammaAMinori';
import ConfirmRevocaAbilitazioneMinori from './confirmRevocaAbilitazioneMinori';

const id = formTypes.PROGRAMMA;

export const headings: TableHeadingI[] = [
  {
    label: 'Nome Programma',
    field: 'nomeBreve',
    size: 'medium',
  },
  {
    label: 'ID',
    field: 'codice',
    size: 'medium',
  },
  {
    label: 'Intervento',
    field: 'policy',
    size: 'medium',
  },
];

interface ManageReferalFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageReferalI extends withFormHandlerProps, ManageReferalFormI {}

const ManageAbilitaProgramma: React.FC<ManageReferalI> = ({
  clearForm = () => ({}),
  // formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [alreadySearched, setAlreadySearched] = useState<boolean>(false);
  const dispatch = useDispatch();
  let { programmi: programmiList = [] } = useAppSelector(selectEntityList);
  
  const open = useAppSelector(selectModalState);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [interventoSelected, setInterventoSelected] = useState<string>('RFD');
  const programDetails =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;
  
  const [selectedRow, setSelectedRow] = useState<TableRowI | null>(null);


  const resetModal = (toClose = true) => {
    clearForm();
    setShowForm(false);
    setAlreadySearched(false);
    setIsProgramSelected(false);
    dispatch(setProgramDetails({}));
    programmiList = null;
    if (toClose) dispatch(closeModal());
  };

  useEffect(() => {
    if (open) {
      resetModal(false);
      if (creation) dispatch(resetProgramDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, creation]);

  const handleSaveAbilitazioneProgramma = () => {

  };
  const handleModificaAbilitazioneProgramma = () => {

  };

  const onQueryChange = (query: string) => {
    if (query.trim() !== '') {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const handleInterventoChange = (value: string) => {
    setInterventoSelected(value);
  }

  const handleSearchProgram = async (search: string) => {
    if (search) {
      const entity = 'programma';
      dispatch(GetEntityValues({ entity }));    //cambiare metodo che recupera programmi usando search e interventoOption
    }
    setShowForm(false);
    setAlreadySearched(true);
  };

  const handleSelectProgram: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      
      if(isProgramSelected) {
        if (typeof td !== 'string') {
          dispatch(GetProgramDetail(td.id as string));
        }
        setShowForm(true);
      }else{
        if (typeof td !== 'string') {
          setSelectedRow(td);
        }
        setIsProgramSelected(true);
      }
    },
  };

  const handleRevocaAbilitazione = () => {
    dispatch(closeModal());
    dispatch(
      openModal({
        id: 'confirmRevocaAbilitazioneMinori'
      })
    );
  };

  const onCloseRevocaAbilitazione = () => {
    dispatch(closeModal());
    dispatch(
      openModal({
        id: formTypes.PROGRAMMA,
        payload: {
          title: 'Modifica programma',
        },
      })
    );
  };

  const onConfirmRevocaAbilitazione = () => {
    dispatch(closeModal());
    alert('onConfirm');
  }


  let content;
  if (showForm) {
    content = (
      <FormAbilitaProgrammaAMinori
        intoModal
        formDisabled={true}
        sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
        }
        setIsFormValid={(isValid) => setIsFormValid(isValid ?? false)}
        creation={creation}
        idProgramma={selectedRow?.id ? String(selectedRow.id) : ''}
      />
    );
  } else if (programmiList && programmiList.length > 0 && alreadySearched) {
    content = (
      <Table
        heading={headings}
        values={programmiList.map((item: { nomeBreve: any; codice: any; policy: any; id:any; }) => ({
          nomeBreve: item.nomeBreve,
          codice: item.codice,
          policy: item.policy,
          id: item.id,
        }))}
        onActionRadio={handleSelectProgram}
        id='table'
      />
    );
  } else if (
    alreadySearched &&
    (programmiList?.length === 0 || !programmiList) &&
    !showForm
  ) {
    content = <EmptySection title='Nessun risultato' withIcon horizontal />;
  }else if(!creation){
    content = (
        <FormAbilitaProgrammaAMinori
          intoModal
          formDisabled={true}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
          setNewFormValues({ ...newData })
          }
          setIsFormValid={(isValid) => setIsFormValid(isValid ?? false)}
          creation={creation}
          idProgramma={selectedRow?.id ? String(selectedRow.id) : ''}
        />
    );
  }

  return (
    <>
    <GenericModal
      id={id}
      primaryCTA={{
        // disabled: !isFormValid || !isProgramSelected,
        disabled: !showForm ? !isProgramSelected : !isFormValid,
        label: showForm || !creation ? 'Conferma' : 'Seleziona',
        onClick: showForm
          ? handleSaveAbilitazioneProgramma
          : !creation ? handleModificaAbilitazioneProgramma
            : () => selectedRow && handleSelectProgram[CRUDActionTypes.SELECT](selectedRow),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
      }}
      {...(!creation
        ? {
            tertiaryCTA: {
              label: 'Revoca abilitazione',
              onClick: handleRevocaAbilitazione,
              buttonsClass: 'btn btn-outline-danger',
            },
          }
        : null)}
      
      {...(creation
        ? {
        subtitle: (
          <>
            {showForm ? (
          <>
            Consulta i dati del programma selezionato, inserisci la data di decorrenza dell’abilitazione,
            <br /> cioè quella a partire da cui l’abilitazione è valida, e conferma.
          </>
            ) : (
          <>
            Cerca e seleziona il programma che vuoi abilitare all'inserimento dei codici fiscali di minori.
            <br />
            I programmi già abilitati o con abilitazione programmata non compariranno tra i risultati di ricerca.
          </>
            )}
          </>
        ),
          }
        : {
        subtitle: (
          <>
            Seleziona una nuova data di decorrenza dell'abilitazione e conferma la modifica
          </>
        ),
          })}
    >
      <div>
        {creation && !showForm ? (
          <SearchBar
            className={clsx(
              'w-100',
              'py-4',
              'px-5',
              // 'search-bar-borders',
              'search-bar-bg'
            )}
            // searchType={selectedSteps.FISCAL_CODE}
            onQueryChange={onQueryChange}
            disableSubmit={!canSubmit}
            placeholder="Inserisci il nome o l'ID del programma"
            onSubmit={handleSearchProgram}
            onReset={() => {
              resetModal(false);
              setCanSubmit(false);
            }}
            title=''
            search
            interventoCheckbox
            onInterventoChange={handleInterventoChange}
          />
        ) : null}
        <div className='mx-5'>{content}</div>
      </div>
    </GenericModal>
    <ConfirmRevocaAbilitazioneMinori onConfirm={onConfirmRevocaAbilitazione} onClose={onCloseRevocaAbilitazione} nomeProgramma={programDetails?.nome}/>
    </>
  );
};

export default ManageAbilitaProgramma;
