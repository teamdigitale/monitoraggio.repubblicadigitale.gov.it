import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formTypes } from '../../utils';
import {
  CRUDActionsI,
  CRUDActionTypes,
  ItemsListI,
} from '../../../../../../utils/common';
import { TableRowI } from '../../../../../../components/Table/table';
import {
  closeModal,
  openModal,
} from '../../../../../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import { useAppSelector } from '../../../../../../redux/hooks';
import {
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../../redux/features/app/appSlice';
import clsx from 'clsx';
import ManageHeadquarter from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageHeadquarter/manageHeadquarter';
import HeadquarterDetailsContent from '../../../../../../components/AdministrativeArea/Entities/Headquarters/HeadquarterDetailsContent/HeadquarterDetailsContent';
import {
  GetHeadquarterDetails,
  GetHeadquarterLightDetails,
  HeadquarterFacilitator,
  RemoveAuthorityHeadquarter,
  RemoveHeadquarterFacilitator,
} from '../../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';
import {
  selectHeadquarters,
  setUserDetails,
} from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import ManageFacilitator from '../../../../../../components/AdministrativeArea/Entities/Headquarters/ManageFacilitator/ManageFacilitator';
import DeleteEntityModal from '../../../../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';
import ButtonsBar, {
  ButtonInButtonsBar,
} from '../../../../../../components/ButtonsBar/buttonsBar';
import useGuard from '../../../../../../hooks/guard';
import {
  Accordion,
  CardStatusAction,
  EmptySection,
} from '../../../../../../components';
import Sticky from 'react-sticky-el';

const HeadquartersDetails = () => {
  const { mediaIsPhone } = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { headquarterId, projectId, authorityId, authorityType } = useParams();
  const headquarterfacilitators =
    useAppSelector(selectHeadquarters).detail?.facilitatoriSede;
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;

  const programPolicy =
    useAppSelector(selectHeadquarters).detail?.programmaPolicy;

  const programDetails =
    useAppSelector(selectHeadquarters).detail?.dettaglioProgetto;

  const { hasUserPermission } = useGuard();

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/progetti/${projectId}/${authorityId}/${headquarterId}/${
          programPolicy === 'SCD'
            ? formTypes.VOLONTARIO
            : formTypes.FACILITATORE
        }/${td}`
      );
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            userCF: td,
            text: 'Confermi di voler disassociare questo facilitatore?',
            entity: 'facilitator',
          },
        })
      );
    },
  };

  useEffect(() => {
    // For breadcrumb
    if (programDetails && headquarterDetails && authorityId) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: programDetails?.id,
          nome: programDetails?.nomeBreve,
        })
      );
      dispatch(
        setInfoIdsBreadcrumb({
          id: authorityId,
          nome: headquarterDetails?.enteDiRiferimento,
        })
      );
    }
  }, [programDetails, headquarterDetails, authorityId]);

  useEffect(() => {
    if (headquarterId && projectId && authorityId) {
      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
      dispatch(setUserDetails(null));
    } else if (headquarterId) {
      dispatch(GetHeadquarterLightDetails(headquarterId));
    }
  }, [headquarterId, projectId, authorityId]);

  const itemAccordionList: ItemsListI[] = [
    {
      title: 'Facilitatori',
      items:
        headquarterfacilitators?.map((facilitator: HeadquarterFacilitator) => ({
          nome: `${facilitator.nome} ${facilitator.cognome}`,
          stato: facilitator.stato,
          actions:
            facilitator.stato === 'ATTIVO'
              ? onActionClick
              : {
                  [CRUDActionTypes.VIEW]: onActionClick[CRUDActionTypes.VIEW],
                },
          id: facilitator?.id,
          codiceFiscale: facilitator?.codiceFiscale,
        })) || [],
    },
  ];

  let buttons: ButtonInButtonsBar[] = [];

  if (authorityType) {
    switch (authorityType) {
      case 'ente-partner':
        buttons = hasUserPermission(['upd.sede.partner'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                disabled: headquarterDetails?.stato === 'ATTIVO',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'headquarter',
                        text: 'Confermi di volere eliminare questa sede?',
                      },
                    })
                  ),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.SEDE,
                      payload: { title: 'Modifica Sede' },
                    })
                  ),
              },
            ]
          : [];
        break;
      case 'ente-gestore':
        buttons = hasUserPermission(['upd.sede.gest.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                disabled: headquarterDetails?.stato === 'ATTIVO',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: 'delete-entity',
                      payload: {
                        entity: 'headquarter',
                        text: 'Confermi di volere eliminare questa sede?',
                      },
                    })
                  ),
              },
              {
                size: 'xs',
                color: 'primary',
                text: 'Modifica',
                onClick: () =>
                  dispatch(
                    openModal({
                      id: formTypes.SEDE,
                      payload: { title: 'Modifica Sede' },
                    })
                  ),
              },
            ]
          : [];
        break;
      default:
        break;
    }
  }

  const removeFacilitator = async (userCF: string) => {
    if (userCF && headquarterId && projectId && authorityId) {
      await dispatch(
        RemoveHeadquarterFacilitator(
          userCF,
          authorityId,
          projectId,
          headquarterId
        )
      );

      dispatch(GetHeadquarterDetails(headquarterId, authorityId, projectId));
      dispatch(setUserDetails(null));
    }
  };

  const removeHeadquarter = async () => {
    if (projectId && authorityId && headquarterId) {
      await dispatch(
        RemoveAuthorityHeadquarter(authorityId, headquarterId, projectId)
      );
    }

    navigate(-1);

    dispatch(closeModal());
  };

  const getAccordionCTA = (title?: string) => {
    switch (title) {
      case 'Facilitatori':
        return hasUserPermission(['add.fac']) && authorityType
          ? {
              cta: `Aggiungi ${title}`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id: formTypes.FACILITATORE,
                    payload: {
                      title: `Aggiungi ${title}`,
                    },
                  })
                ),
            }
          : {
              cta: null,
              ctaAction: () => ({}),
            };
      default:
        return {
          cta: null,
          ctaAction: () => ({}),
        };
    }
  };

  return (
    <div
      className={clsx(
        mediaIsPhone
          ? 'd-flex flex-row container'
          : 'd-flex flex-row mt-5 container'
      )}
    >
      <div className='d-flex flex-column w-100'>
        <div className='container'>
          <DetailLayout
            titleInfo={{
              title: headquarterDetails?.nome,
              status: headquarterDetails?.stato,
              upperTitle: { icon: 'it-map-marker-plus', text: formTypes.SEDE },
              subTitle: programDetails?.nomeBreve,
            }}
            //formButtons={buttons}
            // itemsAccordionList={itemAccordionList}
            buttonsPosition='BOTTOM'
          >
            <HeadquarterDetailsContent />
          </DetailLayout>
          {itemAccordionList?.length
            ? itemAccordionList?.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title || ''}
                  totElem={item.items.length}
                  cta={authorityId ? getAccordionCTA(item.title).cta : null}
                  onClickCta={getAccordionCTA(item.title)?.ctaAction}
                  lastBottom={index === itemAccordionList.length - 1}
                >
                  {item.items?.length ? (
                    item.items.map((cardItem) => (
                      <CardStatusAction
                        key={cardItem.id}
                        title={`${cardItem.nome} ${
                          cardItem.cognome ? cardItem.cognome : ''
                        }`.trim()}
                        status={cardItem.stato}
                        id={cardItem.id}
                        fullInfo={cardItem.fullInfo}
                        cf={cardItem.codiceFiscale}
                        onActionClick={cardItem.actions}
                      />
                    ))
                  ) : (
                    <EmptySection
                      title={`Non esistono ${item.title?.toLowerCase()} associati`}
                      horizontal
                      aside
                    />
                  )}
                </Accordion>
              ))
            : null}
          <Sticky mode='bottom' stickyClassName='sticky bg-white container '>
            <div className='container pl-5'>
              <ButtonsBar buttons={buttons} />
            </div>
          </Sticky>
          <ManageHeadquarter />
          <ManageFacilitator creation={true} />
          <DeleteEntityModal
            onClose={() => dispatch(closeModal())}
            onConfirm={(payload) => {
              if (payload?.entity === 'facilitator') {
                removeFacilitator(payload?.userCF);
              }

              if (payload?.entity === 'headquarter') {
                removeHeadquarter();
              }

              dispatch(closeModal());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeadquartersDetails;
