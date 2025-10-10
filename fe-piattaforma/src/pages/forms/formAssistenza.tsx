import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Select } from '../../components';
import withFormHandler, { withFormHandlerProps } from '../../hoc/withFormHandler';
import { formFieldI, FormHelper, newForm, newFormField } from '../../utils/formHelper';
import { Button, Icon } from 'design-react-kit';
import { uploadFile } from '../../utils/common';
import InputSublabel from '../../components/InputSubLabel/inputSublabel';
import { getTematicheAssistenza } from '../../redux/features/notification/notificationThunk';
import TextEditor from '../../components/General/TextEditor/TextEditor';
import { useDispatch } from 'react-redux';
import './formAssistenza.scss';

// Costante per il valore "Altro" nel dropdown area tematica
const ALTRO_PROBLEMA_VALUE = 'altro_problema';

export interface FormAssistenzaI extends withFormHandlerProps {
    formDisabled?: boolean;
    sendNewValues?: (param?: { [key: string]: formFieldI['value'] }) => void;
    setIsFormValid?: (param: boolean) => void;
    creation?: boolean;
    editMode?: boolean;
    legend?: string;
    onFilesChange?: (files: { name: string; data: File | string }[]) => void;
    initialValues?: { [key: string]: any };
    initialFiles?: { name: string; data: File | string }[];
}

interface FormAssistenzaFullInterface extends withFormHandlerProps, FormAssistenzaI { }


const FormAssistenza: React.FC<FormAssistenzaFullInterface> = ({
    form,
    onInputChange = () => ({}),
    sendNewValues,
    updateForm = () => ({}),
    updateFormField = () => ({}),
    setIsFormValid = () => ({}),
    getFormValues,
    legend = '',
    formDisabled = false,
    onFilesChange = () => ({}),
    initialFiles,
    initialValues,
}) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<{ name: string; data: File | string }[]>([]);
    const [fileSizes, setFileSizes] = useState<{ [fileName: string]: number }>({});
    const [editorText, setEditorText] = useState('<p></p>');
    const [fileSizeError, setFileSizeError] = useState<boolean>(false);
    const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
    const dispatch = useDispatch();

    // Funzione per calcolare quali campi devono essere abilitati
    const getEnabledFields = () => {
        const field1Value = form?.['1']?.value;
        const field2Value = form?.['2']?.value;
        const field3Value = form?.['3']?.value;
        const field4Value = form?.['4']?.value;

        // Campo 1 sempre abilitato
        const enabledFields = { '1': true, '2': false, '3': false, '4': false, files: false };

        // Se campo 1 è valorizzato, abilita campo 2
        if (field1Value) {
            enabledFields['2'] = true;
            
            // Se campo 1 è "altro_problema", abilita anche campo 4
            if (field1Value === ALTRO_PROBLEMA_VALUE) {
                enabledFields['4'] = true;
            }
        }

        // Se campo 2 è valorizzato, abilita campo 3
        if (field2Value) {
            enabledFields['3'] = true;
        }

        // Se campo 3 è valorizzato E (campo 4 non è richiesto O campo 4 è valorizzato), abilita files
        if (field3Value) {
            const isField4Required = field1Value === ALTRO_PROBLEMA_VALUE;
            const isField4Valid = !isField4Required || (isField4Required && field4Value);
            
            if (isField4Valid) {
                enabledFields.files = true;
            }
        }

        return enabledFields;
    };

    const enabledFields = getEnabledFields();

    useEffect(() => {
        const plainCurrent = editorText.replace(/<[^>]+>/g, '').trim();
        const plainIncoming = (form?.['3']?.value as string)?.replace(/<[^>]+>/g, '').trim();

        if (plainCurrent === '' && plainIncoming && plainIncoming !== editorText && form!= undefined) {
            setEditorText(form['3'].value as string);
        }
    }, [form?.['3']?.value]);

    // Aggiorna il TextEditor quando i valori iniziali cambiano
    useEffect(() => {
        if (initialValues && initialValues['3'] && typeof initialValues['3'] === 'string') {
            setEditorText(initialValues['3']);
        }
    }, [initialValues]);


    const initialized = useRef(false);
    const prevInitialValues = useRef<{ [key: string]: any } | undefined>(undefined);
    const optionsLoaded = useRef(false);

    useEffect(() => {
        const fetchTematicheAndUpdateForm = async () => {
            const res = await getTematicheAssistenza(dispatch);
            if (res && form?.['1']) {
                const mapped = res.map((t: any) => ({
                    label: t.descrizione,
                    value: t.tag,
                }));

                // Aggiungo l'opzione "Altro" se non è già presente
                const hasAltroOption = mapped.some((option: any) => option.value === ALTRO_PROBLEMA_VALUE);
                if (!hasAltroOption) {
                    mapped.push({
                        label: 'Altro',
                        value: ALTRO_PROBLEMA_VALUE,
                    });
                }

                updateForm({
                    ...form,
                    ['1']: {
                        ...form['1'],
                        options: mapped,
                    },
                });
                
                optionsLoaded.current = true;
            }
        };

        fetchTematicheAndUpdateForm();
    }, []);

    useEffect(() => {
        // Aspetta che le opzioni siano caricate prima di inizializzare con i valori iniziali
        const shouldInitialize = form && initialValues && optionsLoaded.current && (
            !initialized.current || 
            JSON.stringify(prevInitialValues.current) !== JSON.stringify(initialValues)
        );

        if (shouldInitialize) {
            const updatedFields: formFieldI[] = Object.entries(initialValues).map(([key, value]) => {
                if (!form[key]) return null;

                return newFormField({
                    ...form[key],
                    value,
                });
            }).filter(Boolean) as formFieldI[];

            let newFormData = newForm(updatedFields);
            
            // Mantieni le opzioni del dropdown che sono state caricate
            if (form['1'] && form['1'].options && (newFormData as any)['1']) {
                (newFormData as any)['1'] = {
                    ...(newFormData as any)['1'],
                    options: form['1'].options,
                };
            }
            
            // Se il campo '1' ha valore "altro_problema", assicurati che il campo '4' sia presente
            if (initialValues['1'] === ALTRO_PROBLEMA_VALUE) {
                const field4 = form['4'];
                if (field4) {
                    newFormData = {
                        ...newFormData,
                        '4': {
                            ...field4,
                            value: initialValues['4'] || '',
                            required: true,
                        }
                    };
                }
            }

            updateForm(newFormData);
            
            // Invia tutti i valori del form corrente, non solo gli initialValues
            const allCurrentValues = FormHelper.getFormValues(newFormData);
            sendNewValues?.(allCurrentValues);
            setIsFormValid?.(FormHelper.isValidForm(newFormData));
            initialized.current = true;
            prevInitialValues.current = initialValues;
        }
    }, [form, initialValues, optionsLoaded.current]);

    useEffect(() => {
        setIsFormValid?.(FormHelper.isValidForm(form));
    }, [form]);


    const onInputDataChange = (value: formFieldI['value'], field?: formFieldI['field']) => {
        onInputChange?.(value, field);

        if (!field) return;

        if (field === '1' && value === ALTRO_PROBLEMA_VALUE) {
            if (form && !form['4']) {
                updateFormField('4', 'add');
            }

        } else if (field === '1' && value !== ALTRO_PROBLEMA_VALUE) {
            if (form && form['4']) {
                updateFormField('4', 'remove');
            }
        }

        const currentValues = getFormValues?.() || {};

        const updatedValues = {
            ...currentValues,
            [field]: value,
            // ...(field === '1' && value !== 'altro_problema' ? { '4': '' } : {}),
        };

        const updatedForm = form
            ? {
                ...form,
                [field]: {
                    ...(form[field] || {}),
                    value: value === undefined ? form[field]?.value ?? '' : value,
                },
                ...(field === '1'
                    ? {
                        '4': {
                            ...(form['4'] || {}),
                            // required solo se il valore è 'altro_problema'
                            required: value === ALTRO_PROBLEMA_VALUE,
                            // resetta valore se cambia da 'altro_problema' a altro_problema valore
                            value: value === ALTRO_PROBLEMA_VALUE ? form['4']?.value || '' : '',
                        },
                    }
                    : {}),
            }
            : {};

        setIsFormValid?.(FormHelper.isValidForm(updatedForm));
        sendNewValues?.(updatedValues);
        updateForm(updatedForm);
    };


    useEffect(() => {
        if (initialFiles?.length) {
            setFiles(initialFiles);
            // Per i file iniziali, se sono oggetti File, tracciamo le loro dimensioni
            // Se sono stringhe, manteniamo le dimensioni esistenti in fileSizes
            setFileSizes(prev => {
                const newSizes = { ...prev }; // Mantieni le dimensioni esistenti
                initialFiles.forEach(file => {
                    // Solo se non abbiamo già una dimensione per questo file
                    if (!newSizes[file.name]) {
                        if (file.data instanceof File) {
                            newSizes[file.name] = file.data.size;
                        } else {
                            // Per i file in formato stringa, assumiamo una dimensione zero
                            // solo se non abbiamo già una dimensione
                            newSizes[file.name] = 0;
                        }
                    }
                });
                console.log('useEffect initialFiles - fileSizes aggiornato:', newSizes);
                return newSizes;
            });
        }
    }, [initialFiles]);


    const updateFile = () => {
        console.log('=== INIZIO updateFile ===');
        console.log('Current files array:', files);
        console.log('Current fileSizes:', fileSizes);
        console.log('isProcessingFile:', isProcessingFile);
        
        // Previeni multiple esecuzioni simultanee
        if (isProcessingFile) {
            console.log('DEBUG - updateFile bloccata, elaborazione in corso');
            return;
        }
        
        // Ottengo riferimento al file selezionato PRIMA che l'input venga resettato
        if (!inputRef.current?.files?.length) {
            console.log('ERROR - Nessun file selezionato');
            return;
        }
        
        const selectedFile = inputRef.current.files[0];
        console.log('File selezionato:', {
            name: selectedFile.name,
            size: selectedFile.size,
            sizeInMB: (selectedFile.size / (1024 * 1024)).toFixed(2)
        });
        
        // CALCOLO DIRETTO: Somma tutte le dimensioni dei file già presenti
        let currentTotalSize = 0;
        console.log('=== CALCOLO DIMENSIONI ===');
        console.log('files.length:', files.length);
        
        files.forEach((existingFile, index) => {
            const fileSize = fileSizes[existingFile.name];
            console.log(`File ${index}: ${existingFile.name} -> size: ${fileSize || 'UNDEFINED'}`);
            if (fileSizes[existingFile.name]) {
                currentTotalSize += fileSizes[existingFile.name];
            }
        });
        
        console.log('currentTotalSize calcolato:', currentTotalSize);
        
        const newTotalSize = currentTotalSize + selectedFile.size;
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        console.log('=== RISULTATO FINALE ===');
        console.log('currentTotalSize:', currentTotalSize, '(' + (currentTotalSize / (1024 * 1024)).toFixed(2) + ' MB)');
        console.log('selectedFile.size:', selectedFile.size, '(' + (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB)');
        console.log('newTotalSize:', newTotalSize, '(' + (newTotalSize / (1024 * 1024)).toFixed(2) + ' MB)');
        console.log('maxSize:', maxSize, '(' + (maxSize / (1024 * 1024)).toFixed(2) + ' MB)');
        console.log('SUPERA LIMITE?', newTotalSize > maxSize);
        
        // Se il nuovo totale supererebbe i 10MB, blocca
        if (newTotalSize > maxSize) {
            console.log('🚨 BLOCCATO! Dimensione totale supererebbe il limite');
            setFileSizeError(true);
            // Reset dell'input dopo aver rilevato l'errore
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            
            // Nasconde automaticamente l'errore dopo 5 secondi
            setTimeout(() => {
                setFileSizeError(false);
            }, 5000);
            
            return;
        }
        
        console.log('✅ FILE ACCETTATO - Procedo con upload');
        
        // Imposta il lock per prevenire elaborazioni multiple
        setIsProcessingFile(true);
        
        // Salvo le informazioni del file prima di chiamare uploadFile
        const fileInfo = {
            name: selectedFile.name,
            size: selectedFile.size
        };
        
        uploadFile('file', (file: any) => {
            if (file?.name) {
                console.log('=== CALLBACK uploadFile ===');
                console.log('file.name da callback:', file.name);
                console.log('fileInfo.name salvato:', fileInfo.name);
                console.log('fileInfo.size salvato:', fileInfo.size);
                console.log('NOMI UGUALI?', file.name === fileInfo.name);
                
                // Uso le informazioni salvate per tracciare la dimensione nello stato
                setFileSizes(prev => {
                    const updated = {
                        ...prev,
                        [file.name]: fileInfo.size  // Uso file.name dalla callback come chiave
                    };
                    console.log('fileSizes PRIMA dell\'aggiornamento:', prev);
                    console.log('fileSizes DOPO l\'aggiornamento:', updated);
                    return updated;
                });
                
                setFileSizeError(false);
                setFiles(prevFiles => {
                    const newFiles = [...prevFiles, file];
                    console.log('files array PRIMA:', prevFiles.map(f => f.name));
                    console.log('file aggiunto:', file.name);
                    console.log('files array DOPO:', newFiles.map(f => f.name));
                    onFilesChange?.(newFiles);
                    return newFiles;
                });
                // Reset dell'input dopo aver aggiunto il file
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            }
            
            // Rilascia il lock
            setIsProcessingFile(false);
        });
    };

    const removeDocument = (index: number) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            
            // Rimuovi anche le dimensioni del file eliminato
            const removedFile = prevFiles[index];
            if (removedFile) {
                // Aggiorna lo stato
                setFileSizes(prev => {
                    const updated = { ...prev };
                    delete updated[removedFile.name];
                    return updated;
                });
            }
            
            onFilesChange?.(updatedFiles);
            return updatedFiles;
        });
        
        // Verifica se dopo la rimozione la dimensione totale è ora accettabile
        setTimeout(() => {
            // Calcolo diretto della dimensione rimanente
            let remainingSize = 0;
            files.forEach(file => {
                if (fileSizes[file.name]) {
                    remainingSize += fileSizes[file.name];
                }
            });
            
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (remainingSize <= maxSize) {
                setFileSizeError(false);
            }
        }, 0);
        
        // Reset dell'input dopo aver rimosso il file
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const addDocument = () => {
        if (inputRef.current !== null) {
            inputRef.current.click();
        }
    };

    return (
        <Form
            legend={legend}
            id="form-assistenza"
            className={clsx('form-assistenza')}
            formDisabled={formDisabled}
            marginShowMandatory={false}
            customMargin="mb-3 pb-3"
        >
            <Form.Row className="align-items-end">
                {form?.['1']?.value === ALTRO_PROBLEMA_VALUE ? (
                    <>
                        <Select
                            {...form?.['1']}
                            col='col-12 col-lg-6'
                            value={form?.['1']?.value || ''}
                            placeholder="Seleziona l'area tematica"
                            onInputChange={onInputDataChange}
                            isDisabled={formDisabled || !enabledFields['1']}
                            subLabel="Seleziona l'area per cui hai bisogno di assistenza"
                            className="align-self-end"
                        />

                        <InputSublabel
                            {...form?.['4']}
                            col="col-12 col-lg-6"
                            value={form?.['4']?.value || ''}
                            label={form?.['4']?.label || "Specifica un'altra area tematica"}
                            placeholder="Inserisci un'altra area tematica"
                            onInputChange={enabledFields['4'] ? onInputDataChange : () => {}}
                            description="Definisci l'area tematica della tua richiesta"
                            className={clsx("align-self-end", !enabledFields['4'] && "disabled-field")}
                        />
                    </>
                ) : (
                    <Select
                        {...form?.['1']}
                        col='col-12 col-lg-6'
                        value={form?.['1']?.value || ''}
                        placeholder="Seleziona l'area tematica"
                        onInputChange={onInputDataChange}
                        isDisabled={formDisabled || !enabledFields['1']}
                        subLabel="Seleziona l'area per cui hai bisogno di assistenza"
                    />
                )}


            </Form.Row>
            <Form.Row className={clsx(!enabledFields['2'] && "disabled-field")}>
                <InputSublabel
                    {...form?.['2']}
                    col="col-12"
                    value={form?.['2']?.value || ''}
                    label={form?.['2']?.label || 'Oggetto della richiesta'}
                    placeholder="Es: Impossibile modificare i dati del profilo"
                    onInputChange={enabledFields['2'] ? onInputDataChange : () => {}}
                    description="Descrivi in modo sintetico l'argomento specifico della tua richiesta"
                    // className={clsx(!enabledFields['2'] && "disabled-field")}
                />
            </Form.Row>
            <Form.Row>
                {/* <TextArea
                    {...form?.['3']}
                    value={form?.['3']?.value || ''}
                    col="col-12"
                    placeholder="Inserisci la descrizione dettagliata della tua richiesta"
                    onInputChange={onInputDataChange}
                    style={{ marginLeft: '6px' }}
                    subLabel="Descrivi nei dettagli la tua richiesta. Ti consigliamo di specificare la sezione della piattaforma per cui richiedi assistenza e i passaggi che hai effettuto"
                /> */}
                <label className={clsx("form-assistenza-label", !enabledFields['3'] && "disabled-field")} style={{ marginLeft: '9px' }}>
                    Descrizione
                    <span className="required-asterisk"> *</span>
                </label>
                <p className={clsx("form-text", !enabledFields['3'] && "disabled-field")}
                    style={{
                        textAlign: 'left',
                        marginLeft: '9px',
                        fontSize: '0.9rem',
                        marginBottom: '5px',
                    }}>Descrivi nei dettagli la tua richiesta. Ti consigliamo di specificare la sezione della piattaforma per cui richiedi assistenza e i passaggi che hai effettuato </p>
                <div className={clsx(!enabledFields['3'] && "disabled-field") } style={{ width: '100%', textAlign: 'justify'} }>
                    <TextEditor
                        text={editorText}
                        onChange={enabledFields['3'] ? (t: string) => {
                            setEditorText(t);

                            // Rimuove tutti i tag e spazio bianco
                            const plainText = t.replace(/<[^>]+>/g, '').trim();

                            // Se non c'è contenuto, manda stringa vuota
                            const valueToSend = plainText ? t : '';

                            onInputDataChange(valueToSend, '3');
                        } : () => {}}
                        maxLength={1500}
                        placeholder="Inserisci la descrizione dettagliata della tua richiesta"
                    />
                </div>
            </Form.Row>
            <>
                {files.length > 0 && enabledFields.files
                    ? files.map((file, index) => (
                        <Form.Row key={index} className="mb-4 ml-1">
                            <div className='mt-5 d-flex align-items-center'>
                                <strong className='mr-2'>ALLEGA FILE</strong>
                            </div>
                            <div className='w-100'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <p className='mt-2 mb-0' style={{ color: '#4c4c4d' }}>
                                        {file.name}
                                    </p>
                                    <Icon
                                        icon='it-delete'
                                        color='primary'
                                        size='sm'
                                        className='ml-3'
                                        onClick={() => removeDocument(index)}
                                        aria-label='Elimina'
                                        aria-hidden
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            {/* <p className='text-muted mt-2 text-left'><em>Massimo 50 MB</em></p> */}
                        </Form.Row>
                    )) : null}
            </>

            <Form.Row className="mb-4 ml-1">
                <div className={clsx('mt-5 d-flex align-items-center', !enabledFields.files && "disabled-field")}>
                    <strong className='mr-2'>ALLEGA FILE</strong>
                </div>
                <div className='w-100'>
                    <input
                        type='file'
                        id='file'
                        accept='.txt, .rtf, .odt, .zip, .docx, .doc, .ppt, .pptx, .pdf, .jpg, .png, .gif, .xls, .xlsx, .csv, .mpg, .wmv'
                        ref={inputRef}
                        className='sr-only'
                        onChange={enabledFields.files ? updateFile : () => {}}
                        disabled={!enabledFields.files}
                    />
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className={clsx('mt-2 mb-0', !enabledFields.files && "disabled-field")} style={{ color: '#4c4c4d' }}>
                            Carica file dal tuo dispositivo
                        </p>
                        <Button
                            outline
                            color='primary'
                            className='py-2 px-0 btn-document-modal'
                            onClick={enabledFields.files ? addDocument : () => {}}
                            disabled={!enabledFields.files}
                        >
                            <Icon
                                icon='it-plus'
                                size='sm'
                                color='primary'
                                className='pb-1'
                                aria-label='Seleziona file'
                                aria-hidden
                            />
                            Seleziona file
                        </Button>
                    </div>
                </div>
                {/* <p className={clsx('text-muted mt-2 text-left', !enabledFields.files && "disabled-field")}>
                    <em>Massimo 50 MB</em></p> */}
                <p className={clsx('text-muted mt-2 text-left', !enabledFields.files && "disabled-field")}>
                    <em>Il sistema accetta allegati fino a un massimo di 10MB complessivi</em>
                </p>
            </Form.Row>
            
            {/* Messaggio di errore per file troppo grandi */}
            {fileSizeError ? (
                <Form.Row className="mb-2 ml-1">
                    <div className="w-100">
                        <p className="text-danger mt-0 mb-0" style={{ fontSize: '0.875rem' }}>
                            <Icon icon="it-error" size="sm" className="mr-1" />
                            La dimensione totale degli allegati supera i 10MB consentiti.
                        </p>
                    </div>
                </Form.Row>
            ) : (
                <></>
            )}
        </Form>
    );
};

const form = newForm([
    newFormField({
        keyBE: 'areaTematica',
        id: '1',
        field: '1',
        label: 'Area tematica',
        type: 'select',
        options: [
            { label: 'Opzione', value: 'test' },
            // { label: 'Errore nella piattaforma', value: 'errore' },
            // { label: 'Richiesta di informazioni', value: 'informazioni' },
            // { label: 'altro_problema', value: 'altro_problema' },
        ],
        required: true,
    }),
    newFormField({
        keyBE: 'altraAreaTematica',
        id: '4',
        field: '4',
        label: "Specifica un'altra area tematica",
        type: 'text',
        required: false,
    }),
    newFormField({
        keyBE: 'oggetto',
        id: '2',
        field: '2',
        label: 'Oggetto della richiesta',
        type: 'text',
        required: true,
    }),
    newFormField({
        keyBE: 'descrizione',
        id: '3',
        field: '3',
        label: 'Descrizione',
        type: 'text',
        required: true,
    }),
]);

export default withFormHandler({ form }, FormAssistenza);
