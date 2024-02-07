/* https://github.com/ctimmerm/axios-mock-adapter */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';

//const shouldUseMock = process.env.NODE_ENV === 'development'
const shouldUseMock = true;

export const initMock = (apiInstance: AxiosInstance) => {
  if (apiInstance && shouldUseMock) {
    const mockInstance = new MockAdapter(apiInstance, {
      onNoMatch: 'passthrough',
    });

    /*mockInstance.onPut('/programma').reply(() => {
      return [500];
    });*/

    /*mockInstance.onPost('/programma').reply(() => {
      return [201];
    });*/

    /*mockInstance.onPost('/programma/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaProgrammi.json');
      return [200, response];
    });*/

    /*  mockInstance.onPost('/progetto/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaProgetti.json');
      return [200, response];
    }); */

    /*mockInstance.onPost('/ente/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaEnti.json');
      return [200, response];
    });*/

    // mockInstance.onPost('/utente/all').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/listaUtenti.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/questionarioTemplate/all').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/listaQuestionari.json');
    //   return [200, response];
    // });

    mockInstance.onPatch('/questionari/default-scd').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaQuestionari.json');
      return [200, response];
    });

    mockInstance.onPatch('/questionari/default-rfd').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaQuestionari.json');
      return [200, response];
    });

    /*mockInstance.onPost('/programma/policies/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/policyDropdown.json');
      return [200, response.data];
    });*/

    /*mockInstance.onPost('/programma/stati/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/statiDropdown.json');
      return [200, response.data];
    });*/

    /*mockInstance.onPost('/progetto/policies/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/policyDropdown.json');
      return [200, response.data];
    });*/

    /*mockInstance.onPost('/progetto/programmi/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/programmiDropdown.json');
      return [200, response.data];
    });*/

    /*mockInstance.onPost('/progetto/stati/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/statiDropdown.json');
      return [200, response.data];
    });*/

    /*mockInstance.onPost('/ente/profili/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/profiloDropdown.json');
      return [200, response];
    });*/

    mockInstance.onPost('/ente/stati/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/statiDropdown.json');
      return [200, response];
    });

    /*mockInstance.onPost('/ente/progetti/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/progettiDropdown.json');
      return [200, response];
    });*/

    /*mockInstance.onPost('/ente/programmi/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/programmiDropdown.json');
      return [200, response];
    });*/

    // mockInstance.onPost('/utente/ruoli/dropdown').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/roleDropdown.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/utente/stati/dropdown').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/statiDropdown.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/cittadino/all').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/listaCittadini.json');
    //   return [200, response];
    // });

    mockInstance.onGet('/citizensArea/site/dropdown/test').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/sedeDropdown.json');
      return [200, response];
    });

    mockInstance
      .onGet('/citizensArea/project/dropdown/test')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/progettiDropdown.json');
        return [200, response];
      });

    mockInstance
      .onGet('/citizensArea/program/dropdown/test')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/programmiDropdown.json');
        return [200, response];
      });

    mockInstance.onGet('/citizensArea/policy/dropdown/test').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/policyDropdown.json');
      return [200, response];
    });

    mockInstance.onGet('/cittadino/1').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/cittadinoDetail.json');
      return [200, response];
    });

    // mockInstance
    //   .onGet('/servizio/cittadino?criterioRicerca=aaa&tipoDocumento=CF')
    //   .reply(async () => {
    //     // @ts-ignore
    //     const response = await import('/mock/cittadinoDetailSearchDetail.json');
    //     return [200, response];
    //   });

    /*mockInstance.onGet('/ruolo?tipologiaRuoli=NP').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaRuoli.json');
      return [200, response.data];
    });*/

    /*mockInstance.onGet('/ruolo/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaRuoli.json');
      return [200, response.data];
    });*/

    /*mockInstance.onGet('/ruolo/DTD').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/roleDetails.json');
      return [200, response.data];
    });*/

    /*mockInstance.onGet('/gruppo/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaRuoliGruppi.json');
      return [200, response.data];
    });*/

    /*mockInstance.onGet('/programma/idProgramma').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/programmaMock.json');
      return [200, response];
    });*/

    mockInstance
      .onGet('/ente/321321/gestoreProgramma/prova')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/enteProgrammaMock.json');
        return [200, response];
      });
    mockInstance
      .onGet('/ente/project1/gestoreProgetto/prova')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/enteProgettoMock.json');
        return [200, response];
      });
    mockInstance.onGet('/ente/project1/partner/prova').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/entePartnerMock.json');
      return [200, response];
    });
    mockInstance.onGet('/sede/idSede').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/sedeMock.json');
      return [200, response];
    });

    /*mockInstance.onGet('/progetto/idProgetto').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/progettoMock.json');
      return [200, response];
    });*/

    mockInstance.onGet('/ente/project1/partner/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaEnti.json');
      return [200, response];
    });
    mockInstance.onGet('/ente-sede/project1/prova/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaSedi.json');
      return [200, response];
    });

    mockInstance.onGet('/ente/project1/gestoreProgetto/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaGestoriProgetto.json');
      return [200, response];
    });
    /*
    mockInstance.onGet('/programmi/321321/projects').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaProgetti.json');
      return [200, response];
    });
*/
    mockInstance.onGet('/utente/idUtente').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/userMock.json');
      return [200, response];
    });

    // mockInstance
    //   .onPost('/questionarioTemplate/stati/dropdown')
    //   .reply(async () => {
    //     // @ts-ignore
    //     const response = await import('/mock/statiDropdown.json');
    //     return [200, response];
    //   });

    // mockInstance.onGet('/questionarioTemplate/1').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/responseQuestionario.json');
    //   return [200, response];
    // });

    // mockInstance
    //   .onGet('/questionarioTemplate/6c00da35-c6ee-4be1-bf2b-e28e7bcaeea8')
    //   .reply(async () => {
    //     // @ts-ignore
    //     const response = await import('/mock/responseQuestionario.json');
    //     return [200, response];
    //   });

    // mockInstance.onGet('/questionarioTemplate/prova2').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/responseQuestionario.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/servizio/all').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/listaServizi.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/servizio/stati/dropdown').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/listaServizi.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/servizio/stati/dropdown').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/statiDropdown.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/servizio/tipologiaServizio/dropdown').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/tipologiaServizioDropdown.json');
    //   return [200, response];
    // });

    // mockInstance.onGet('/servizio/1/schedaDettaglio').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/servicesDetail.json');
    //   return [200, response];
    // });

    // mockInstance.onPost('/servizio/cittadino/all/1').reply(async () => {
    //   // @ts-ignore
    //   const response = await import('/mock/servicesCitizenList.json');
    //   return [200, response];
    // });

    // mockInstance
    //   .onPost('/servizio/cittadino/stati/dropdown/1')
    //   .reply(async () => {
    //     // @ts-ignore
    //     const response = await import('/mock/statiServiziDropdown.json');
    //     return [200, response];
    //   });

    mockInstance.onPost('/Notifications/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/notificationsList.json');
      return [200, response];
    });

    /*mockInstance.onPost('/contesto').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/userContext.json');
      return [200, response];
    });*/

    /*mockInstance.onPost('/contesto/confermaIntegrazione').reply(async () => {
      return [200];
    });*/

    /*mockInstance.onPost('/contesto/sceltaProfilo').reply(async () => {
      return [200];
    });*/

    /*mockInstance.onGet('/open-data/count/download').reply(async () => {
      // @ts-ignore
      return [200, Math.floor(Math.random() * 9999)];
    });*/

    mockInstance

      .onGet('/servizio/cittadino/questionarioCompilato/test/anonimo')

      .reply(async () => {
        const response = await import(
          // @ts-ignore
          // prettier-ignore
          '/mock/responseQuestionarioOnlineMock.json'
        );
        return [200, response];
      });
    mockInstance

      .onPost('/servizio/cittadino/questionarioCompilato/test/compila/anonimo')

      .reply(async () => {
        return [200];
      });

    mockInstance.onGet('/board/items').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/newsList.json');
      return [200, response];
    });

    mockInstance.onGet('/board/item/id/user/userId').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/newsMock.json');
      return [200, response];
    });

    mockInstance.onGet('/document/items').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/docsList.json');
      return [200, response];
    });

    mockInstance.onGet('/document/item/id/user/userId').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/docMock.json');
      return [200, response];
    });

    mockInstance.onGet('/community/items').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/topicsList.json');
      return [200, response];
    });

    mockInstance.onGet('/community/item/id/user/userId').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/topicMock.json');
      return [200, response];
    });

    mockInstance.onGet('/search/items').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/searchResultsList.json');
      return [200, response];
    });

    mockInstance.onGet('api/user/userId/items').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/userItems.json');
      return [200, response];
    });

    mockInstance.onGet('/item/itemId/comments/user/userId').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/commentsList.json');
      return [200, response];
    });

    mockInstance.onGet('/category/retrieve').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/categoriesList.json');
      return [200, response];
    });
  }
};
