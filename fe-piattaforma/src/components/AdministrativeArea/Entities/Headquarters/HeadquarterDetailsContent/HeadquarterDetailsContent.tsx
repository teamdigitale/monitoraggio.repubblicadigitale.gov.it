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
        className='mb-0'
        showMandatory={false}
      >
        <Form.Row className='justify-content-between'>
          <Input
            label='Sede itinerante'
            value={headquarterDetails?.itinere ? 'Sì' : 'No'}
            disabled
            col='col-12 col-lg-6'
          />
          <Input
            label='Servizi offerti in altre lingue'
            value={renderServiziAltreLingueLabel(
              headquarterDetails?.serviziAltreLingue
            )}
            disabled
            col='col-12 col-lg-6'
          />
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
