import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Sticky from 'react-sticky-el';
import clsx from 'clsx';
import { entityStatus, formTypes, userRoles } from '../../utils';
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
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import { useAppSelector } from '../../../../../../redux/hooks';
import {
  resetInfoIdsBreadcrumb,
  selectDevice,
  setInfoIdsBreadcrumb,
} from '../../../../../../redux/features/app/appSlice';
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
  selectPrograms,
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
import { GetProgramDetail } from '../../../../../../redux/features/administrativeArea/programs/programsThunk';
import IconNote from '/public/assets/img/it-note-primary.png';
import { policy } from '../../utils';
import { selectProfile } from '../../../../../../redux/features/user/userSlice';

const HeadquartersDetails = () => {
  const { mediaIsPhone } = useAppSelector(selectDevice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const { hasUserPermission } = useGuard();
  const {
    headquarterId,
    projectId,
    authorityId,
    authorityType,
    identeDiRiferimento,
    entityId,
  } = useParams();
  const headquarterfacilitators =
    useAppSelector(selectHeadquarters).detail?.facilitatoriSede;
  const headquarterDetails =
    useAppSelector(selectHeadquarters).detail?.dettagliInfoSede;
  const programPolicy =
    useAppSelector(selectHeadquarters).detail?.programmaPolicy;
  const projectDetails =
    useAppSelector(selectHeadquarters).detail?.dettaglioProgetto;
  const programDetails =
    useAppSelector(selectPrograms).detail?.dettagliInfoProgramma || {};

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      if (!authorityType && (authorityId || identeDiRiferimento)) {
        navigate(
          `/area-amministrativa/${
            entityId ? `programmi/${entityId}/` : ''
          }progetti/${projectId}/${
            authorityId || identeDiRiferimento
          }/${headquarterId}/${
            programPolicy === 'SCD' ? userRoles.VOL : userRoles.FAC
          }/${td}`
        );
      } else if (authorityType) {
        navigate(
          `/area-amministrativa/${
            entityId ? `programmi/${entityId}/` : ''
          }progetti/${projectId}/${
            authorityType === formTypes.ENTI_PARTNER
              ? formTypes.ENTI_PARTNER
              : formTypes.ENTE_GESTORE_PROGETTO
          }/${authorityId || identeDiRiferimento}/${headquarterId}/${
            programPolicy === 'SCD' ? userRoles.VOL : userRoles.FAC
          }/${td}`
        );
      }
    },
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            userCF: td,
            text: programPolicy == policy.SCD ? 'Confermi di voler disassociare questo volontario?':'Confermi di voler disassociare questo facilitatore?',
            entity: 'facilitator',
          },
        })
      );
    },
  };

  useEffect(() => {
    // For breadcrumb
    if (entityId && !programDetails?.nomeBreve)
      dispatch(GetProgramDetail(entityId));
  }, []);

  useEffect(() => {
    // For breadcrumb
    dispatch(resetInfoIdsBreadcrumb());
    if (entityId && programDetails?.nomeBreve) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: entityId,
          nome: programDetails?.nomeBreve,
        })
      );
    }
    if (
      headquarterDetails &&
      headquarterId &&
      (authorityId || identeDiRiferimento)
    ) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: authorityId || identeDiRiferimento,
          nome: headquarterDetails?.enteDiRiferimento,
        })
      );
      dispatch(
        setInfoIdsBreadcrumb({
          id: headquarterId,
          nome: headquarterDetails?.nome,
        })
      );
    }
    if (projectId && headquarterDetails) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: projectId,
          nome: projectDetails?.nomeBreve,
        })
      );
    }
  }, [
    entityId,
    programDetails,
    projectDetails,
    projectDetails,
    headquarterDetails,
    authorityId,
    identeDiRiferimento,
  ]);

  useEffect(() => {
    if (headquarterId && projectId && (authorityId || identeDiRiferimento)) {
      dispatch(
        GetHeadquarterDetails(
          headquarterId,
          authorityId || identeDiRiferimento || '',
          projectId
        )
      );
      dispatch(setUserDetails(null));
    } else if (headquarterId) {
      dispatch(GetHeadquarterLightDetails(headquarterId));
    }
  }, [headquarterId, projectId, authorityId]);

  let itemAccordionList: ItemsListI[] = [
    {
      title: 'Facilitatori',
      items:
        headquarterfacilitators?.map((facilitator: HeadquarterFacilitator) => ({
          nome: `${facilitator.cognome} ${facilitator.nome} `,
          stato: facilitator.stato,
          actions: facilitator.associatoAUtente
            ? facilitator.stato === entityStatus.ATTIVO &&
              authorityType &&
              (((authorityType === formTypes.ENTE_GESTORE_PROGRAMMA ||
                authorityType === formTypes.ENTE_GESTORE_PROGETTO) &&
                hasUserPermission(['add.fac'])) ||
                (authorityType === formTypes.ENTI_PARTNER &&
                  hasUserPermission(['add.fac.partner'])))
              ? onActionClick
              : {
                  [CRUDActionTypes.VIEW]:
                    ((authorityType === formTypes.ENTE_GESTORE_PROGRAMMA ||
                      authorityType === formTypes.ENTE_GESTORE_PROGETTO) &&
                      hasUserPermission(['add.fac'])) ||
                    (authorityType === formTypes.ENTI_PARTNER &&
                      hasUserPermission(['add.fac.partner']))
                      ? onActionClick[CRUDActionTypes.VIEW]
                      : undefined,
                }
            : {},
          id: facilitator?.id,
          codiceFiscale: facilitator?.codiceFiscale,
        })) || [],
    },
  ];

  const ruolo = useAppSelector(selectProfile)?.codiceRuolo;
  const idEnteRuolo = useAppSelector(selectProfile)?.idEnte;
  const showIconBasedOnRole = () => {
    // 1 MODIFICA
    // 2 VISUALIZZA
    // 3 -    
    const params = useParams();
    const idEnteDiRiferimento = params.identeDiRiferimento;
    switch (ruolo) {
      case 'DTD':
          if(headquarterDetails && headquarterDetails?.stato === entityStatus.TERMINATO) return 2;
          else return 1;
      case 'DEG':
      case 'REG':
        return 2;
      case 'REGP':
      case 'DEGP':
      case 'REPP':
      case 'DEPP':
        if (idEnteRuolo == idEnteDiRiferimento) return 1;
        else return 2;
      case 'FAC':
      case 'VOL':
        return 3;
    }
    return 3;
  };

  function updateFacilitators(){
    itemAccordionList = [
      {
        title: 'Facilitatori',
        items:
          headquarterfacilitators?.map((facilitator: HeadquarterFacilitator) => ({
            nome: `${facilitator.cognome} ${facilitator.nome} `,
            stato: facilitator.stato,
            actions: facilitator.associatoAUtente
              ? facilitator.stato === entityStatus.ATTIVO &&
                authorityType &&
                (((authorityType === formTypes.ENTE_GESTORE_PROGRAMMA ||
                  authorityType === formTypes.ENTE_GESTORE_PROGETTO) &&
                  hasUserPermission(['add.fac'])) ||
                  (authorityType === formTypes.ENTI_PARTNER &&
                    hasUserPermission(['add.fac.partner'])))
                ? onActionClick
                : {
                    [CRUDActionTypes.VIEW]:
                      ((authorityType === formTypes.ENTE_GESTORE_PROGRAMMA ||
                        authorityType === formTypes.ENTE_GESTORE_PROGETTO) &&
                        hasUserPermission(['add.fac'])) ||
                      (authorityType === formTypes.ENTI_PARTNER &&
                        hasUserPermission(['add.fac.partner']))
                        ? onActionClick[CRUDActionTypes.VIEW]
                        : undefined,
                  }
              : {},
            id: facilitator?.id,
            codiceFiscale: facilitator?.codiceFiscale,
          })) || [],
      },
    ];
  }

  let buttons: ButtonInButtonsBar[] = [];

  if (authorityType) {
    switch (authorityType) {
      case formTypes.ENTI_PARTNER:
        buttons = hasUserPermission(['upd.sede.partner'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                disabled: headquarterDetails?.stato !== entityStatus.NON_ATTIVO,
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
                disabled: headquarterDetails?.stato === entityStatus.TERMINATO,
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
      case formTypes.ENTE_GESTORE_PROGRAMMA:
      case formTypes.ENTE_GESTORE_PROGETTO:
        buttons = hasUserPermission(['upd.sede.gest.prgt'])
          ? [
              {
                size: 'xs',
                outline: true,
                color: 'primary',
                text: 'Elimina',
                buttonClass: 'btn-secondary',
                disabled: headquarterDetails?.stato !== entityStatus.NON_ATTIVO,
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
                disabled: headquarterDetails?.stato === entityStatus.TERMINATO,
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
  } else {
    buttons = showIconBasedOnRole() === 1
      ? [
        {
          size: 'xs',
          outline: true,
          color: 'primary',
          text: 'Elimina',
          buttonClass: 'btn-secondary',
          disabled: headquarterDetails?.stato !== entityStatus.NON_ATTIVO,
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
          disabled: headquarterDetails?.stato === entityStatus.TERMINATO,
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
    } else if(projectId && identeDiRiferimento && headquarterId){
      await dispatch(
        RemoveAuthorityHeadquarter(identeDiRiferimento, headquarterId, projectId)
      );
    }

    navigate(-1);

    dispatch(closeModal());
  };

  const getAccordionCTA = (title?: string) => {
    switch (title) {
      case 'Facilitatori':
        return (authorityType || identeDiRiferimento) &&
          (((authorityType === formTypes.ENTE_GESTORE_PROGRAMMA ||
            authorityType === formTypes.ENTE_GESTORE_PROGETTO || identeDiRiferimento) &&
            hasUserPermission(['add.fac'])) ||
            (authorityType === formTypes.ENTI_PARTNER &&
              hasUserPermission(['add.fac.partner']))) &&
          headquarterDetails?.stato !== entityStatus.TERMINATO
          ? {
              cta: `Aggiungi ${programPolicy !== 'SCD' ? title : 'Volontari'}`,
              ctaAction: () =>
                dispatch(
                  openModal({
                    id: formTypes.FACILITATORE,
                    payload: {
                      title: `Aggiungi ${
                        programPolicy !== 'SCD' ? title : 'Volontari'
                      }`,
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
              subTitle: projectDetails?.nomeBreve || programDetails?.nomeBreve,
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
                  title={
                    (programPolicy !== 'SCD' ? item.title : 'Volontari') || ''
                  }
                  totElem={item.items.length}
                  cta={authorityId || identeDiRiferimento ? getAccordionCTA(item.title).cta : null}
                  onClickCta={getAccordionCTA(item.title)?.ctaAction}
                  lastBottom={index === itemAccordionList.length - 1}
                  detailAccordion
                >
                  {item.items?.length ? (
                    item.items.map((cardItem) => (
                      <CardStatusAction
                        key={cardItem.id}
                        title={`${cardItem.cognome ? cardItem.cognome : ''} ${
                          cardItem.nome
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
                      title={`Non sono presenti ${item.title?.toLowerCase()} associati.`}
                      icon={IconNote}
                      withIcon
                      noMargin
                    />
                  )}
                </Accordion>
              ))
            : null}
          <Sticky
            mode='bottom'
            stickyClassName={clsx(
              'sticky bg-white container',
              device.mediaIsPhone && 'pr-5'
            )}
          >
            <div className='container'>
              <ButtonsBar buttons={buttons} />
            </div>
          </Sticky>
          <ManageHeadquarter />
          <ManageFacilitator creation updateFacilitators={updateFacilitators}/>
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
