import React, { useState } from "react";
import { Container, Button, Icon } from "design-react-kit";
import { useAppSelector } from "../../../redux/hooks";
import { selectProfile, selectUser } from "../../../redux/features/user/userSlice";
import AnnullaAssistenzaModal from "./AnnullaAssistenzaModal";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/features/modal/modalSlice";
import UserAvatar from "../../../components/Avatar/UserAvatar/UserAvatar";
import { AvatarSizes, AvatarTextSizes } from "../../../components/Avatar/AvatarInitials/avatarInitials";
import FormAssistenza from "../../forms/formAssistenza";
import { createTicketAssistenza } from "../../../redux/features/notification/notificationThunk";

const AssistenzaArea: React.FC = () => {

    const ruolo = useAppSelector(selectProfile);
    const user = useAppSelector(selectUser);
    const dispatch = useDispatch();
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<{ [key: string]: string | number | boolean | Date | string[] | undefined }>({});
    const [attachedFiles, setAttachedFiles] = useState<{ name: string; data: File | string }[]>([]);
    const [requestOk, setRequestOk] = useState(0); // 0 = caricamento, 1 = inviata ok, 2 = errore

    const [step, setStep] = useState(1); 

    const handleNext = async () => {
        if (step === 2) {
            setStep(3);
            setRequestOk(0); 
            const payload = {
                areaTematica: formValues?.['1'],
                descrizione: formValues?.['3'],
                oggetto: formValues?.['2'],
                altraAreaTematica: formValues?.['4'],
                allegati: attachedFiles.map(file => ({
                    name: file.name,
                    data: file.data
                })),
                nome: user?.nome + ' ' + user?.cognome,
                email: user?.email,
                codiceFiscale: user?.codiceFiscale,
                ruoloUtente: ruolo?.codiceRuolo,

                idProgramma: ruolo?.idProgramma, 
                nomeProgramma: ruolo?.nomeProgramma, 
                idProgetto: ruolo?.idProgetto, 
                nomeProgetto: ruolo?.nomeProgettoBreve,
                policy: ruolo?.policy,
                idEnte: ruolo?.idEnte,
                nomeEnte: ruolo?.nomeEnte,
            }
        
            const res = await createTicketAssistenza(dispatch, payload);
            if (res === true) {
                setRequestOk(1); // successo
            } else {
                setRequestOk(2); // errore
            }

            
        } else if (step === 3 && requestOk === 1) {
            // dopo successo, chiudo la finestra/tab
            window.close();
        } else if (step === 3 && requestOk === 2) {
            // dopo errore, torno alla richiesta
            setStep(2);
            setRequestOk(0);
        } else if (step === 1) {
            setStep(2);
        }
    };


    const handleClose = () => {
        dispatch(
            openModal({
                id: 'AnnullaAssistenza',
            })
        )
    }

    let content;


    if (step === 1) {
        content = (
            <div className="my-5 d-flex flex-column align-items-center">
                <UserAvatar
                    avatarImage={user?.immagineProfilo}
                    user={{ uSurname: user?.cognome, uName: user?.nome }}
                    size={AvatarSizes.Medium}
                    font={AvatarTextSizes.Small}
                />

                <p className="mt-4 mb-3">
                    Stai per inviare una richiesta con il ruolo di <br />
                    <strong>{ruolo?.descrizioneRuolo}</strong>
                </p>

                <p className="text-muted" style={{ maxWidth: 480 }}>
                    Per richiedere assistenza con un ruolo differente, annulla questa richiesta e assicurati
                    di cambiare il ruolo prima di accedere nuovamente all’assistenza.
                </p>
            </div>
        );
    } else if (step === 2) {
        content = (
            <div className="my-5 d-flex flex-column align-items-start" style={{ maxWidth: 720, margin: '0 auto' }}>
                <FormAssistenza
                    setIsFormValid={setIsFormValid}
                    sendNewValues={(newData) => {
                        setFormValues({ ...newData });
                    }}
                    onFilesChange={setAttachedFiles}
                    initialValues={formValues}
                    initialFiles={attachedFiles}
                />
            </div>
        );
    } else if (step === 3) {
        // step 3 è lo step in cui aspetti il risultato della chiamata API
        if (requestOk === 0) {
            content = (
                <div className="my-5 d-flex flex-column align-items-center">
                    <p></p>
                </div>
            );
        } else if (requestOk === 1) {
            content = (
                <div className="my-5 d-flex flex-column align-items-center">
                    <Icon
                        icon='it-check-circle'
                        style={{ width: '111px', height: '111px', fill: '#28a745' }}
                        aria-label='Successo'
                    />
                    <p className="mb-4">La tua richiesta è stata inviata.</p>
                    <p >A breve riceverai una <strong>email di conferma</strong> all&#39;indirizzo {user?.email} </p>
                </div>
            );
        } else if (requestOk === 2) {
            content = (
                <div className="my-5 d-flex flex-column align-items-center">
                    <Icon
                        icon='it-close-circle'
                        style={{ width: '111px', height: '111px', fill: '#dc3545' }}
                        aria-label='Errore'
                    />
                    <p >Ci dispiace, non è stato possibile inviare la tua richiesta. Ti invitiamo a riprovare più tardi.</p>
                </div>
            );
        }
    }

    return (
        <Container className="text-center mt-5" style={{ marginBottom: '200px' }}>
            <h2 className="text-primary">Richiesta di assistenza tecnica</h2>
            <p className="mt-3">
                Chiedi assistenza sul funzionamento della piattaforma Facilita ai nostri esperti dedicati
            </p>

            {content}

            <div className="d-flex justify-content-center" style={{ gap: '24px' }}>
                {(step !== 3 || (requestOk !== 0 && requestOk !== 1)) && <Button color="primary" className="cta-button" outline onClick={handleClose}>
                    {step === 1 ? "Annulla" : "Chiudi" }
                </Button>}
                {(step !== 3 || requestOk !== 0) && <Button color="primary" className="cta-button" onClick={handleNext} disabled={step === 2 && !isFormValid}>
                    {step === 1 ? "Prosegui" : step === 2 ? "Invia" : requestOk === 1 ? "Chiudi" : "Torna alla richiesta"}
                </Button>}
            </div>
            <AnnullaAssistenzaModal />
        </Container>
    );
};

export default AssistenzaArea;
