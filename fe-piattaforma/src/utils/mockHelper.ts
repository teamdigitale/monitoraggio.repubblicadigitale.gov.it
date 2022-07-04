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

    mockInstance.onGet('/ente/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaEnti.json');
      return [200, response];
    });

    mockInstance.onPost('/ente/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaEnti.json');
      return [200, response];
    });

    mockInstance.onGet('/utente/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaUtenti.json');
      return [200, response];
    });

    mockInstance.onPost('/utente/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaUtenti.json');
      return [200, response];
    });

    mockInstance.onPost('/questionarioTemplate/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaQuestionari.json');
      return [200, response];
    });

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

    mockInstance.onPost('/ente/profili/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/profiloDropdown.json');
      return [200, response];
    });

    mockInstance.onPost('/ente/stati/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/statiDropdown.json');
      return [200, response];
    });

    mockInstance.onPost('/ente/projects/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/progettiDropdown.json');
      return [200, response];
    });

    mockInstance.onPost('/ente/programmi/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/programmiDropdown.json');
      return [200, response];
    });

    mockInstance.onPost('/utente/ruoli/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/roleDropdown.json');
      return [200, response];
    });

    mockInstance.onPost('/utente/stati/dropdown').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/statiDropdown.json');
      return [200, response];
    });

    mockInstance.onGet('/cittadino/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaCittadini.json');
      return [200, response];
    });

    mockInstance.onPost('/cittadino/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaCittadini.json');
      return [200, response];
    });

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

    mockInstance.onGet('/cittadino/light/idCittadino').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/cittadinoDetailSearchDetail.json');
      return [200, response];
    });

    mockInstance.onGet('/roles/all/test').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaRuoli.json');
      return [200, response];
    });

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

    mockInstance.onGet('/programmi/321321/projects').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/listaProgetti.json');
      return [200, response];
    });

    mockInstance.onGet('/utente/idUtente').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/userMock.json');
      return [200, response];
    });

    mockInstance.onGet('/questionario/tewbebe').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/responseQuestionario.json');
      return [200, response];
    });

    mockInstance.onGet('/eventi/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/allEvents.json');
      return [200, response];
    });

    mockInstance.onPost('/eventi/all').reply(async () => {
      // @ts-ignore
      const response = await import('/mock/allEvents.json');
      return [200, response];
    });

    mockInstance
      .onPost('areaCittadini/eventi/stati/dropdown/')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/statiDropdown.json');
        return [200, response];
      });

    mockInstance
      .onGet('areaAmministrativa/services/servizio1')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/servicesDetail.json');
        return [200, response];
      });

    mockInstance
      .onPost('areaCittadini/servizi/dettaglio/stati/dropdown')
      .reply(async () => {
        // @ts-ignore
        const response = await import('/mock/statiServiziDropdown.json');
        return [200, response];
      });
  }
};
