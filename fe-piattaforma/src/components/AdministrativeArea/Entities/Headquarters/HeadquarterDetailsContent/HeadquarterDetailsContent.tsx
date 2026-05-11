import { Icon, UncontrolledTooltip } from 'design-react-kit';
import { selectHeadquarters } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import FormHeadquarter from '../FormHeadquarter/FormHeadquarter';

const renderServiziAltreLingueLabel = (value: boolean | undefined | null) => {
  if (value === true) return 'Sì, altre lingue diverse dall’italiano';
  if (value === false) return 'No, solo in lingua italiana';
  return '-';
};

const HeadquarterDetailsContent = () => {
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;

  return (
    <>
      <FormHeadquarter formDisabled />
      <Form
        id='form-headquarter-details'
        className='mb-5 pr-5 pl-2'
        showMandatory={false}
      >
        <Form.Row>
          <div className='col-12 col-md-6'>
            <div className='d-flex align-items-center mb-2'>
              <span className='mr-2'>Sede itinerante</span>
              <span id='tooltip-sede-itinerante-detail' className='d-inline-flex'>
                <Icon
                  icon='it-info-circle'
                  size='sm'
                  color='primary'
                  aria-label='Informazione sede itinerante'
                />
              </span>
              <UncontrolledTooltip
                placement='right'
                target='tooltip-sede-itinerante-detail'
                autohide={false}
              >
                <strong>Che cos&apos;è una sede itinerante?</strong>
                <br />
                Per sede itinerante si intende qualsiasi soluzione logistica
                che garantisca la presenza periodica del punto di facilitazione
                sul territorio, per esempio i mezzi mobili attrezzati (come i
                camper) oppure i team di facilitatori che operano periodicamente
                presso spazi messi a disposizione da comuni, enti pubblici o
                soggetti privati aderenti all&apos;iniziativa. Scopri di più sul{' '}
                <a
                  href='https://dtd-gov.notion.site/3-I-luoghi-della-facilitazione-digitale-b88f2c81c3f445bc81b1d583cd9e1283'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  Manuale della Facilitazione
                </a>
                .
              </UncontrolledTooltip>
            </div>
            <Input
              value={headquarterDetails?.itinere ? 'Sì' : 'No'}
              disabled
              col='col-12'
            />
          </div>
          <div className='col-12 col-md-6'>
            <label className='mb-2 d-block'>
              Servizi offerti in altre lingue
            </label>
            <Input
              value={renderServiziAltreLingueLabel(
                headquarterDetails?.serviziAltreLingue
              )}
              disabled
              col='col-12'
            />
          </div>
        </Form.Row>
      </Form>
      <AccordionAddressList
        addressList={headquarterDetails?.indirizziSedeFasceOrarie || []}
        isReadOnly
        detailAccordion
      />
    </>
  );
};

export default HeadquarterDetailsContent;
