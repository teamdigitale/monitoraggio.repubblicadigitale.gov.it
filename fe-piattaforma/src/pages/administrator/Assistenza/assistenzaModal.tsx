import React, { useEffect, useState } from 'react';
import { withFormHandlerProps } from '../../../hoc/withFormHandler';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux/hooks';
import { closeModal, selectModalState } from '../../../redux/features/modal/modalSlice';
import GenericModal from '../../../components/Modals/GenericModal/genericModal';
import { selectProfile } from '../../../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { hrefValues } from './assistenzaUtils';



const id = 'ASSISTENZA';

interface ManageReferalFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageReferalI extends withFormHandlerProps, ManageReferalFormI { }

const AssistenzaModal: React.FC<ManageReferalI> = ({
  // clearForm = () => ({}),
  // formDisabled,
  creation = false,
}) => {
  const dispatch = useDispatch();
  const open = useAppSelector(selectModalState);
  const [assistenzaEnabled, setAssistenzaEnabled] = useState(true);
  const ruolo = useAppSelector(selectProfile);
  const codRole = ruolo?.codiceRuolo;
  const policyRole = ruolo?.policy;
  const navigate = useNavigate();

  const getHref = (label: string) => hrefValues.find(h => h.label === label)?.href || '#';


  const resetModal = (toClose = true) => {
    if (toClose) dispatch(closeModal());
  };

  useEffect(() => {
    if (open) {
      resetModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, creation]);

  useEffect(() => {
    if (codRole === 'FAC' && policyRole === 'RFD') {
      setAssistenzaEnabled(true);
    } else if ((codRole === 'VOL' || codRole === 'REG' || codRole === 'REGP' || codRole === 'REPP') && policyRole === 'SCD') {
      setAssistenzaEnabled(true);
    } else if ((codRole === 'REG' || codRole === 'REGP' || codRole === 'REPP') && policyRole === 'RFD') {
      setAssistenzaEnabled(true);
    } else {
      setAssistenzaEnabled(false);
    }
  }, [codRole, policyRole]);

  // console.log('codRole:', codRole, 'policyRole:', policyRole);

  let content;

  const contentFacRfd = (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded p-6 text-center max-w-xl" style={{ backgroundColor: '#eeeeee' }}>
        <div className='p-3'>
          <p className='my-3 mx-5'>
            Ti ricordiamo che tutte le informazioni per poter utilizzare facilita sono disponibili nel{' '}
            <a href={getHref('VademecumFacilitatori')} target="_blank" className="text-blue-600 underline">
              vademecum per le facilitatrici e facilitatori
            </a>
          </p>
          <p className='my-3 mx-5'>
            Se il tuo problema riguarda l’attività di facilitazione vai al{' '}
            <a href={getHref('ManualeFacilitazione')} target="_blank" className="text-blue-600 underline">
              manuale della facilitazione
            </a>
          </p>
        </div>
      </div>

      <div className="text-center mb-5">
        <div className="font-bold text-gray-700 my-3"><b>Oppure</b></div>
        <p className="text-gray-700">
          per trovare la soluzione <br />
          Invia una richiesta all’assistenza tecnica
        </p>
      </div>
    </div>
  );

  const contentVolRefScd = (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded p-6 text-center max-w-xl" style={{ backgroundColor: '#eeeeee' }}>
        <div className='p-3'>
          <p className='my-3 mx-5'>
            Ti ricordiamo che tutte le informazioni per poter utilizzare facilita sono disponibili nel{' '}
            <a href={getHref('VademecumVolontari')} target="_blank" className="text-blue-600 underline">
              vademecum per operatrici e operatori volontari
            </a>
          </p>
          <p className='my-3 mx-5'>
            Se il tuo problema riguarda l’attività di facilitazione vai al{' '}
            <a href={getHref('ManualeVolontario')} target="_blank" className="text-blue-600 underline">
              manuale dell'operatore volontario
            </a>
          </p>
        </div>
      </div>

      <div className="text-center mb-5">
        <div className="font-bold text-gray-700 my-3"><b>Oppure</b></div>
        <p className="text-gray-700">
          per trovare la soluzione <br />
          Invia una richiesta all’assistenza tecnica
        </p>
      </div>
    </div>
  );

  const contentRefRfd = (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded p-6 text-center max-w-xl" style={{ backgroundColor: '#eeeeee' }}>
        <div className='p-3'>
          <p className='my-3 mx-5'>
            Ti ricordiamo che tutte le informazioni per poter utilizzare facilita sono disponibili nel{' '}
            <a href={getHref('VademecumEntiGestoriPartner')} target="_blank" className="text-blue-600 underline">
              vademecum per enti gestori e partner di progetto
            </a>
          </p>
          <p className='my-3 mx-5'>
            Se il tuo problema riguarda l’attività di facilitazione vai al{' '}
            <a href={getHref('ManualeVolontario')} target='_blank' className="text-blue-600 underline">
              manuale dell'operatore volontario
            </a>
          </p>
        </div>
      </div>

      <div className="text-center mb-5">
        <div className="font-bold text-gray-700 my-3"><b>Oppure</b></div>
        <p className="text-gray-700">
          per trovare la soluzione <br />
          Invia una richiesta all’assistenza tecnica
        </p>
      </div>
    </div>
  );

  const contentNoAssistenza = (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded p-6 text-center max-w-xl my-5" style={{ backgroundColor: '#eeeeee' }}>
        <div className='p-3'>
          <p className='my-3 mx-5'>
            Il servizio di assistenza tecnica non è disponibile per il tuo ruolo.
          </p>
        </div>
      </div>
    </div>
  );

  if (codRole === 'FAC' && policyRole === 'RFD') { // Facilitatore RFD
    content = contentFacRfd;
  } else if ((codRole === 'VOL' || codRole === 'REG' || codRole === 'REGP' || codRole === 'REPP') && policyRole === 'SCD') { // Volontario o Referente SCD
    content = contentVolRefScd;
  } else if ((codRole === 'REG' || codRole === 'REGP' || codRole === 'REPP') && policyRole === 'RFD') {  // Referente RFD
    content = contentRefRfd;
  } else {
    content = contentNoAssistenza;
  }


  return (
    <>
    <GenericModal
      id={id}
      centerButtons={true}
      primaryCTA={{
        // disabled: !isFormValid || !isProgramSelected,
        disabled: !assistenzaEnabled,
        label: "Vai all'assistenza",
        onClick: () => {navigate('/richiesta-assistenza', { state: { from: location.pathname } });},
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: resetModal,
        }}
        withCTAIcon=
        {<svg
          xmlns='http://www.w3.org/2000/svg'
          className='svg_style'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M19.5 4H14C13.7239 4 13.5 4.22386 13.5 4.5C13.5 4.77614 13.7239 5 14 5H18.6996L10.3307 13.3689C10.1355 13.5642 10.1355 13.8808 10.3307 14.076C10.526 14.2713 10.8426 14.2713 11.0378 14.076L19.5 5.61385V10.5C19.5 10.7761 19.7239 11 20 11C20.2761 11 20.5 10.7761 20.5 10.5V5C20.5 4.44772 20.0523 4 19.5 4ZM17.51 12.5C17.51 12.2239 17.7339 12 18.01 12C18.2784 12.0053 18.4947 12.2216 18.5 12.49V18C18.5 19.6569 17.1569 21 15.5 21H6.5C4.84315 21 3.5 19.6569 3.5 18V9C3.5 7.34315 4.84315 6 6.5 6H11.5C11.7739 6.00532 11.9947 6.22609 12 6.5C12 6.77614 11.7761 7 11.5 7H6.5C5.39543 7 4.5 7.89543 4.5 9V18C4.5 19.1046 5.39543 20 6.5 20H15.51C16.6146 20 17.51 19.1046 17.51 18V12.5Z'
            fill='#63D6D1'
          ></path>
        </svg>}
      >
        <div>
          <div className='mx-5'>{content}</div>
        </div>

      </GenericModal>
    </>
  );
};

export default AssistenzaModal;
