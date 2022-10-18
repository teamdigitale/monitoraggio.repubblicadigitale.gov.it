import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Row } from 'design-react-kit';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { dispatchNotify } from '../utils/notifictionHelper';
import {
  Form,
  InfoPanel,
  Input,
  Rating,
  Stepper,
  DropdownFilter,
  ProgressBar,
  PrefixPhone,
  StatusChip,
} from '../components';
import CheckboxGroup from '../components/Form/checkboxGroup';
import withFormHandler, { withFormHandlerProps } from '../hoc/withFormHandler';
import { formFieldI, newForm, newFormField } from '../utils/formHelper';
import { i18nChangeLanguage } from '../utils/i18nHelper';
import { guard } from '../utils/guardHelper';
import { FilterI } from '../components/DropdownFilter/dropdownFilter';
// import { groupOptions } from '../components/Form/multipleSelectConstants';
// import ManageOTP from '../components/AdministrativeArea/Entities/Surveys/ManageOTP/ManageOTP';
import SelectMultipleCheckbox from '../components/Form/selectMultipleCheckbox';
import {
  serviceScopeOptions,
  serviceScopeOptionsValues,
} from '../components/Form/multipleSelectConstants';
// import { groupOptions } from '../components/Form/multipleSelectConstants';
// import ManageOTP from '../components/AdministrativeArea/Entities/Surveys/ManageOTP/ManageOTP';
import ProtectedComponent from '../hoc/AuthGuard/ProtectedComponent/ProtectedComponent';
import { updateCustomBreadcrumb } from '../redux/features/app/appSlice';
// import Comment from '../components/Comments/comment';
import ReportFlowCard from '../components/ReportFlow/reportFlowCard';
import ManageComment from './administrator/AdministrativeArea/Entities/modals/manageComment';
import ManageDocument from './administrator/AdministrativeArea/Entities/modals/manageDocument';
import PillDropDown from '../components/PillDropDown/pillDropDown';
// import SectionDetail from '../components/DocumentDetail/sectionDetail';
import Slider from '../components/General/Slider/Slider';
import TextEditor from '../components/General/TextEditor/TextEditor';

export const DocumentCardDetailMock = {
  typology: 'TIPOLOGIA — ',
  category: 'CATEGORIA — ',
  date: '02/07/2022',
  title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh nibh, tincidunt non ultricies viverra, malesuada et massa. Mauris quis tortor magna. In suscipit nulla vitae ex efficitur, a cursus mi aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh nibh, tincidunt non ultricies viverra, malesuada et massa.',
};

// const DocumentDetailMock = [DocumentCardDetailMock];
import UserAvatar from '../components/Avatar/UserAvatar/UserAvatar';
import { closeModal, openModal } from '../redux/features/modal/modalSlice';
import GenericModal from '../components/Modals/GenericModal/genericModal';

const Playground: React.FC<withFormHandlerProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [editorText, setEditorText] = useState('');

  useEffect(() => {
    dispatch(
      updateCustomBreadcrumb([
        {
          label: 'Playground',
          url: '/playground',
          link: false,
        },
      ])
    );
  }, []);

  const createNotify = () => {
    dispatchNotify({
      closable: true,
      message: `ciao ${new Date().getTime()}`,
      id: new Date().getTime(),
    });
  };

  const handleInputChange = (
    value: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    let newValue = value;
    switch (field) {
      case 'surname': {
        newValue = newValue?.toString().substring(0, 10);
        break;
      }
      default:
    }
    if (props.onInputChange) props.onInputChange(newValue, field);
  };

  const examplePanel = {
    title: 'esempio infoPanel',
    list: [
      'ciao',
      'non',
      'vorrei',
      'disturbare',
      'volevo',
      'parlarti',
      'e',
      'ho',
      'chiesto',
      'di',
      'te',
      'ma',
      'se',
      'per',
      'caso',
    ],
    rowsNo: 6,
    onlyList: true,
  };

  /* const device = useAppSelector(selectDevice); */

  const [values, setValues] = useState<FilterI[]>([]);
  const [multipleSelectValue, setMultipleSelectValue] = useState<string>('');

  const onInputChange = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    console.log('PLAYGROUND onInputChange', value, field);
    if (typeof value === 'string') setMultipleSelectValue(value);
  };

  const handleInputCheckbox = (
    value?: formFieldI['value'],
    field?: formFieldI['field']
  ) => {
    console.log('PLAYGROUND handleInputCheckbox', value, field);
  };

  return (
    <div className='container mt-4'>
      <h1>Playground {t('hello')}</h1>

      <CheckboxGroup
        className='col-12'
        onInputChange={onInputChange}
        styleLabelForm
        noLabel
        optionsInColumn
        separator='§'
        options={[
          { label: 'AAA', value: 'AAA' },
          { label: 'OOO', value: 'OOO' },
          { label: 'UUU', value: 'UUU' },
        ]}
        value={multipleSelectValue}
      />
      <div className='my-5'>
        {/* Testing Protected Component */}

        <section>
          <ReportFlowCard />
        </section>

        <ProtectedComponent visibleTo={[]}>
          <DropdownFilter
            filterName='test'
            id='test'
            options={[
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
            ]}
            onOptionsChecked={(newOptions) => {
              console.log(newOptions);
              setValues(newOptions);
            }}
            values={values}
          />
        </ProtectedComponent>
        <DropdownFilter
          filterName='test'
          id='test'
          options={[
            { label: 'a', value: 'a' },
            { label: 'b', value: 'b' },
          ]}
          onOptionsChecked={(newOptions) => {
            console.log(newOptions);
            setValues(newOptions);
          }}
          values={values}
        />
      </div>

      <div className='d-flex w-100 flex-wrap'>
        <div className='d-flex w-100 justify-content-center'> {'CIAO'} </div>
        <div className='d-flex w-100 justify-content-center'>
          <UserAvatar
            // avatarImage={profilePicture}
            user={{ uSurname: 'Galassi', uName: 'Riccardo' }}
            //size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
            /*  font={
              device.mediaIsPhone ? AvatarTextSizes.Big : AvatarTextSizes.Small
            } */
            //lightColor={device.mediaIsPhone}
          />
          <div> {'CIAO'} </div>
          <StatusChip
            className={clsx(
              'table-container__status-label',
              'primary-bg-a9',
              'ml-4',
              'section-chip',
              'no-border'
              //device.mediaIsPhone ? 'mx-0 ml-2 my-3' : 'mx-3'
            )}
            status={'ATTIVO'}
            //rowTableId={name?.replace(/\s/g, '') || new Date().getTime()}
          />
        </div>
        <div className='d-flex w-100 justify-content-center'> {'CIAO'} </div>
      </div>

      <Row className='mt-2'>
        <Form id='form-playground-2'>
          <FormGroup check>
            <div className='my-3'>
              <Input name='pippo' type='radio' id={`1`} label='1' withLabel />
            </div>
            <div className='my-3'>
              <Input name='pippo' type='radio' id={`2`} label='2' withLabel />
            </div>
            <div className='my-3'>
              <Input name='pippo' type='radio' id={`3`} label='3' withLabel />
            </div>
          </FormGroup>
        </Form>
      </Row>
      <Row className='mt-2'>
        <Col sm={6} md={4}>
          <Button color='primary' onClick={() => i18nChangeLanguage('it')}>
            Aggiorna lingua
          </Button>
        </Col>
        <Col sm={6} md={4}>
          <Button color='primary' onClick={() => i18nChangeLanguage('de')}>
            Sprache aktualisieren
          </Button>
        </Col>
      </Row>
      <Row className='my-5'>
        <Col sm={12} md={12}>
          <InfoPanel {...examplePanel} />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm={6} md={4}>
          <Button color='primary' onClick={createNotify} size='sm'>
            Dispatch Notify
          </Button>
        </Col>
      </Row>
      <Form id='form-playground-1' className='mt-5 mb-5'>
        <Form.Row>
          <Input
            {...props.form?.name}
            label='Nome'
            placeholder='Inserisci nome'
            col='col-12 col-md-6'
            onInputBlur={props.onInputChange}
          />
          <Input
            {...props.form?.surname}
            label='Cognome'
            placeholder='Inserisci cognome'
            //onInputChange={props.onInputChange}
            onInputChange={handleInputChange}
          />
        </Form.Row>
      </Form>
      <Row className='my-5'>{guard(<h1>Prova</h1>, ['admin', 'guest'])}</Row>

      <Row className='my-5'>
        <ProgressBar
          steps={[
            'Nome sezione 1',
            'Nome sezione 2',
            'Nome sezione 3',
            'Nome sezione 4',
          ]}
          currentStep={1}
        />
      </Row>

      <section className='mb-4'>
        <Row>
          <Button
            outline
            color='primary'
            size='sm'
            onClick={() => {
              dispatch(
                openModal({
                  id: 'addCommentModal',
                  payload: { title: 'Aggiungi commento' },
                })
              );
            }}
          >
            Aggiungi commento
          </Button>
          <ManageComment />
        </Row>
      </section>

      <section>
        <Row>
          <Button
            outline
            color='primary'
            size='sm'
            onClick={() => {
              dispatch(
                openModal({
                  id: 'loadDocumentModal',
                  payload: { title: 'Carica documento' },
                })
              );
            }}
          >
            Carica documento
          </Button>
          <ManageDocument />
        </Row>
      </section>

      <section>
        <PillDropDown />
      </section>



      <Stepper nSteps={5} currentStep={3} />
      <Rating />

      <section className='py-5 my-5'>
        {/* <Comment
          writingUser={user}
          commentBody='Questa è la prova di un commento per vedere se è tutto posizionato in modo corretto
          Questa è la prova di un commento per vedere se è tutto posizionato in modo corretto
           Questa è la prova di un commento per vedere se è tutto posizionato in modo corretto
           Questa è la prova di un commento per vedere se è tutto posizionato in modo corretto '
        /> */}
      </section>

      <section>
        <Row>
          <Button
            color='primary'
            outline
            size='lg'
            onClick={() => {
              dispatch(openModal({ id: 'playground-modal' }));
            }}
          >
            Apri modale
          </Button>
          <GenericModal
            id='playground-modal'
            title='Modale Playground'
            primaryCTA={{
              label: 'Chiudi',
              onClick: () => dispatch(closeModal()),
            }}
            centerButtons
          >
            Modal content
          </GenericModal>
        </Row>
      </section>

      <section>
        <Row>
          <Form id='form-playground-3'>
            <fieldset>
              <Input type='text' onInputChange={(e) => console.log(e)} />
            </fieldset>
          </Form>
        </Row>
      </section>

      <section>
        <Slider>
          {new Array(3).fill([1, 2, 3]).map((el, i) => (
            <div
              key={`slide-${i}`}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {el.map((e: any, index: any) => (
                <div
                  key={`card-${i}-${index}`}
                  style={{
                    height: '300px',
                    width: '20%',
                    backgroundColor: '#acacac',
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
          ))}
        </Slider>
      </section>
      <section className='p-5'>
        <TextEditor
          text={editorText}
          onChange={(t: string) => setEditorText(t)}
        />
      </section>
      <div className='w-100 my-5'>
        <Form id='form-playground-4'>
          <Form.Row>
            <PrefixPhone
              {...props.form?.surname}
              label='Prefisso'
              onInputChange={props.onInputChange}
            />
          </Form.Row>
        </Form>
      </div>
      <SelectMultipleCheckbox
        label='Label field *'
        options={serviceScopeOptions}
        field={'primo livello'}
        secondLevelField={'secondo livello'}
        onInputChange={handleInputCheckbox}
        onSecondLevelInputChange={handleInputCheckbox}
        valueSecondLevelString={serviceScopeOptionsValues
          .map((val) => val.value)
          .join('§')}
      />
    </div>
  );
};

const form = newForm([
  newFormField({
    field: 'name',
  }),
  newFormField({
    field: 'surname',
    required: true,
  }),
]);

export default withFormHandler({ form }, Playground);
