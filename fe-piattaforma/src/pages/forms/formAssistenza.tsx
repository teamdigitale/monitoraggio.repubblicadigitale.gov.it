import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Select } from '../../components';
import withFormHandler, { withFormHandlerProps } from '../../hoc/withFormHandler';
import { formFieldI, FormHelper, newForm, newFormField } from '../../utils/formHelper';
import TextArea from '../../components/Form/textarea';
import { Button, Icon } from 'design-react-kit';
import { uploadFile } from '../../utils/common';
import InputSublabel from '../../components/InputSubLabel/inputSublabel';
import { getTematicheAssistenza } from '../../redux/features/notification/notificationThunk';
import TextEditor from '../../components/General/TextEditor/TextEditor';

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
    const [editorText, setEditorText] = useState('<p></p>');

    useEffect(() => {
        if (form?.['3']?.value !== undefined && form?.['3']?.value !== editorText) {
            setEditorText(form['3'].value as string);
        }
    }, [form?.['3']?.value]);

    const initialized = useRef(false);

    useEffect(() => {
        const fetchTematicheAndUpdateForm = async () => {
            const res = await getTematicheAssistenza();
            if (res && form?.['1']) {
                const mapped = res.map((t: any) => ({
                    label: t.descrizione,
                    value: t.tag,
                }));

                updateForm({
                    ...form,
                    ['1']: {
                        ...form['1'],
                        options: mapped,
                    },
                });
            }
        };

        fetchTematicheAndUpdateForm();
    }, []);

    useEffect(() => {
        if (form && initialValues && !initialized.current) {
            const updatedFields: formFieldI[] = Object.entries(initialValues).map(([key, value]) => {
                if (!form[key]) return null;

                return newFormField({
                    ...form[key],
                    value,
                });
            }).filter(Boolean) as formFieldI[];

            updateForm(newForm(updatedFields));
            sendNewValues?.(initialValues);
            setIsFormValid?.(FormHelper.isValidForm(form));
            initialized.current = true;
        }
    }, [form, initialValues]);

    useEffect(() => {
        setIsFormValid?.(FormHelper.isValidForm(form));
    }, [form]);


    const onInputDataChange = (value: formFieldI['value'], field?: formFieldI['field']) => {
        onInputChange?.(value, field);

        if (!field) return;

        if (field === '1' && value === 'altro_problema') {
            if (form && !form['4']) {
                updateFormField('4', 'add');
            }

        } else if (field === '1' && value !== 'altro_problema') {
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
                            required: value === 'altro_problema',
                            // resetta valore se cambia da 'altro_problema' a altro_problema valore
                            value: value === 'altro_problema' ? form['4']?.value || '' : '',
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
        }
    }, [initialFiles]);


    const updateFile = () => {
        uploadFile('file', (file: any) => {
            if (file?.name) {
                setFiles(prevFiles => {
                    const newFiles = [...prevFiles, file];
                    onFilesChange?.(newFiles);
                    return newFiles;
                });
            }
        });
    };

    const removeDocument = (index: number) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            onFilesChange?.(updatedFiles);
            return updatedFiles;
        });
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
            className={clsx('')}
            formDisabled={formDisabled}
            marginShowMandatory={false}
            customMargin="mb-3 pb-3"
        >
            <Form.Row className="align-items-end">
                {form?.['1']?.value === 'altro_problema' ? (
                    <>
                        <Select
                            {...form?.['1']}
                            col='col-6'
                            value={form?.['1']?.value || ''}
                            placeholder="Seleziona l'area tematica"
                            onInputChange={onInputDataChange}
                            isDisabled={formDisabled}
                            subLabel='Seleziona l’area tematica di assistenza'
                            className="align-self-end"
                        />

                        <InputSublabel
                            {...form?.['4']}
                            col="col-6"
                            value={form?.['4']?.value || ''}
                            label={form?.['4']?.label || "Specifica un'altra area tematica"}
                            placeholder="Inserisci un'altra area tematica"
                            onInputChange={onInputDataChange}
                            description="Definisci l'area tematica della tua richiesta"
                            className="align-self-end"
                        />
                    </>
                ) : (
                    <Select
                        {...form?.['1']}
                        col='col-12'
                        value={form?.['1']?.value || ''}
                        placeholder="Seleziona l'area tematica"
                        onInputChange={onInputDataChange}
                        isDisabled={formDisabled}
                        subLabel='Seleziona l’area tematica di assistenza'
                    />
                )}


            </Form.Row>
            <Form.Row>
                <InputSublabel
                    {...form?.['2']}
                    col="col-12"
                    value={form?.['2']?.value || ''}
                    label={form?.['2']?.label || 'Oggetto della richiesta'}
                    placeholder="Es: Impossibile modificare i dati del profilo"
                    onInputChange={onInputDataChange}
                    description="Descrivi in modo sintetico l'argomento specifico della tua richiesta"
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
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.777778rem', marginLeft: '9px', marginBottom: '0px' }}>
                    Descrizione
                    <span className="required-asterisk"> *</span>
                </label>
                <p className="form-text"
                    style={{
                        textAlign: 'left',
                        marginLeft: '9px',
                        fontSize: '0.9rem',
                        marginBottom: '5px',
                    }}>Descrivi nei dettagli la tua richiesta. Ti consigliamo di specificare la sezione della piattaforma per cui richiedi assistenza e i passaggi che hai effettuato </p>
                <TextEditor
                    text={editorText}
    
                    onChange={(t: string) => {
                        setEditorText(t);

                        // Rimuove tutti i tag e spazio bianco
                        const plainText = t.replace(/<[^>]+>/g, '').trim();

                        // Se non c'è contenuto, manda stringa vuota
                        const valueToSend = plainText ? t : '';

                        onInputDataChange(valueToSend, '3');
                    }}
                    maxLength={1500}
                />
            </Form.Row>
            <>
                {files.length > 0
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
                                    />
                                </div>
                            </div>
                            <p className='text-muted mt-2'><em>Massimo X MB, formati supportati</em></p>
                        </Form.Row>
                    )) : null}
            </>

            <Form.Row className="mb-4 ml-1">
                <div className='mt-5 d-flex align-items-center'>
                    <strong className='mr-2'>ALLEGA FILE</strong>
                </div>
                <div className='w-100'>
                    <input
                        type='file'
                        id='file'
                        accept='.txt, .rtf, .odt, .zip, .exe, .docx, .doc, .ppt, .pptx, .pdf, .jpg, .png, .gif, .xls, .xlsx, .csv, .mpg, .wmv'
                        ref={inputRef}
                        className='sr-only'
                        onChange={updateFile}
                    />
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className='mt-2 mb-0' style={{ color: '#4c4c4d' }}>
                            Carica file dal tuo dispositivo
                        </p>
                        <Button
                            outline
                            color='primary'
                            className='py-2 px-0 btn-document-modal'
                            onClick={addDocument}
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
                <p className='text-muted mt-2'><em>Massimo X MB, formati supportati</em></p>
            </Form.Row>

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
            { label: 'Opzione di test', value: 'test' },
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
