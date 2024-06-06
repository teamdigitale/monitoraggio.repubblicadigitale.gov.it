package it.pa.repdgt.surveymgmt.util;

import java.util.HashMap;
import java.util.Map;

public class CSVMapUtil {

    public static Map<String, String> getAN7Map() {
        Map<String, String> map = new HashMap<>();
        map.put("F", "A");
        map.put("M", "B");
        map.put("Non binario", "C");
        map.put("Preferisco non rispondere", "D");
        return map;
    }

    public static Map<Integer, String> getAN8Map() {
        Map<Integer, String> map = new HashMap<>();
        map.put(1, "A");
        map.put(2, "B");
        map.put(3, "C");
        map.put(4, "D");
        return map;
    }

    public static Map<String, String> getAN9Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Licenza elementare", "A");
        map.put("Licenza media", "B");
        map.put("Diploma di scuola superiore", "C");
        map.put("Istruzione post secondaria non terziaria", "D");
        map.put("Diploma di qualifica professionale", "E");
        map.put("Certificato di specializzazione tecnica superiore (IFTS)", "F");
        map.put("Diploma di tecnico superiore (ITS)", "G");
        map.put("Laurea a ciclo breve / diploma universitario", "H");
        map.put("Laurea specialistica / magistrale / vecchio ordinamento o livello equivalente", "I");
        map.put("Master o livello equivalente", "J");
        map.put("Dottorato o livello equivalente", "K");
        map.put("Non conosciuto / non fornito / altro", "L");
        return map;
    }

    public static Map<String, String> getAN10Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Dipendente", "A");
        map.put("Imprenditore", "B");
        map.put("Libero professionista", "C");
        map.put("Non occupato", "D");
        map.put("Studente o studentessa / in formazione", "E");
        map.put("Casalinga/o", "F");
        map.put("Persona ritirata dal lavoro / pensionato/a", "G");
        map.put("Altro", "H");
        return map;
    }

    public static Map<String, String> getAN11Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Italiana", "A");
        map.put("Straniera, di un Paese ALL’INTERNO dell’Unione Europea", "B");
        map.put("Straniera, di un Paese AL DI FUORI dell’Unione Europea", "C");
        return map;
    }

    public static Map<String, String> getPR2Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Facilitazione individuale", "A");
        map.put("Facilitazione di gruppo", "B");
        map.put("Formazione in presenza", "C");
        map.put("Formazione online", "D");
        map.put("Altro", "E");
        return map;
    }

    public static Map<String, String> getSE3Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Facilitazione individuale", "A");
        map.put("Facilitazione di gruppo", "B");
        map.put("Formazione in presenza", "C");
        map.put("Formazione online", "D");
        map.put("Altro", "E");
        return map;
    }

    public static Map<String, String> getSE4Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Alfabetizzazione su informazioni e dati", "A");
        map.put("Comunicazione e collaborazione", "B");
        map.put("Creazione di contenuti digitali", "C");
        map.put("Sicurezza", "D");
        map.put("Risolvere i problemi tecnici (es.: software e hardware)", "E");
        return map;
    }

    public static Map<String, String> getSE5Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Navigare, ricercare e filtrare dati, informazioni e contenuti digitali (es.: consultare siti istituzionali, cercare atti e norme, leggere notizie online, guardare video su piattaforme in abbonamento)",
                "1");
        map.put("Valutare dati, informazioni e contenuti digitali (es.: riconoscere le fake news)", "2");
        map.put("Gestire dati, informazioni e contenuti digitali (es.: organizzare file, scaricare contenuti multimediali, utilizzare videogiochi)",
                "3");
        map.put("Interagire attraverso le tecnologie digitali (es.: usare servizi di messaggistica istantanea, effettuare chiamate o videochiamate via Internet)",
                "4");
        map.put("Condividere informazioni attraverso le tecnologie digitali (es.: usare la PEC, comunicare il domicilio digitale)",
                "5");
        map.put("Esercitare la cittadinanza attraverso le tecnologie digitali (es.: utilizzare i servizi pubblici digitali, fare acquisti online, gestire servizi bancari e di pagamento via Internet)",
                "6");
        map.put("Collaborare attraverso le tecnologie digitali", "7");
        map.put("Conoscere le regole di comportamento per il reciproco rispetto online (netiquette)", "8");
        map.put("Gestire l’identità digitale (es.: richiedere e usare SPID, CNS e CIE e identificativi social)", "9");
        map.put("Creazione di contenuti digitali", "10");
        map.put("Proteggere i dispositivi (es.: impostare e gestire password, riconoscere ed evitare i messaggi di phishing)",
                "11");
        map.put("Proteggere i dati personali e la privacy (es.: gestire i cookie, comunicare dati bancari per i pagamenti online)",
                "12");
        map.put("Risolvere i problemi tecnici (es.: software e hardware)", "13");
        return map;
    }

    public static Map<String, String> getSE6Map() {
        Map<String, String> map = new HashMap<>();
        map.put("App IO", "A");
        map.put("Sistemi di pagamenti elettronici (pagoPA)", "B");
        map.put("Servizi anagrafici tramite ANPR (es. richiedere certificati)", "C");
        map.put("Fascicolo sanitario elettronico", "D");
        map.put("Fatturazione elettronica", "E");
        map.put("Cultura e turismo (es. consultare biblioteche e archivi, prenotare biglietti per musei e spettacoli o servizi turistici)",
                "F");
        map.put("Istruzione (es. fare l’iscrizione a servizi per l’infanzia, mense e trasporti scolastici, richiedere agevolazioni, consultare il registro elettronico)",
                "G");
        map.put("Formazione (es. iscriversi all’università o a corsi per adulti)", "H");
        map.put("Sport (es. prenotazione impianti sportivi)", "I");
        map.put("Servizi di sostegno all’occupazione (es. iscriversi al centro per l’impiego, consultare l’Informalavoro, rivolgersi a career service o servizi di consulenza)",
                "J");
        map.put("Commercio e impresa (es. sportelli unici per le attività produttive)", "K");
        map.put("Servizi previdenziali e assistenziali (es. accedere a prestazioni assistenziali e previdenziali, servizi per l’immigrazione)",
                "L");
        map.put("Servizi sanitari diversi da FSE (es. prenotare visite ed esami con il Centro Unico di Prenotazione, scegliere il medico di famiglia, ritirare referti, richiedere l’assistenza domiciliare)",
                "M");
        map.put("Adempimenti fiscali (es. dichiarazione dei redditi precompilata)", "N");
        map.put("Servizi tributari e contravvenzioni (es. dichiarazioni IMU, TASI, TARi, consultazione accertamenti e pagamenti delle contravvenzioni)",
                "O");
        map.put("Urbanistica ed edilizia (es. Gestire pratiche edilizie SCIA e CILA)", "P");
        map.put("Infrastrutture e mobilità (es. fare il biglietto o l’abbonamento per il trasporto pubblico locale, effettuare pagamenti per parcheggi, taxi e ZTL)",
                "Q");
        map.put("Utilizzo di piattaforme di partecipazione", "R");
        map.put("Nessuna delle precedenti", "S");
        return map;
    }

    public static Map<String, String> getES1Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Sportello", "A");
        map.put("Telefono", "B");
        map.put("Sito internet", "C");
        map.put("Social media", "D");
        map.put("TV", "E");
        map.put("Radio", "F");
        map.put("Giornale", "G");
        map.put("Durante un evento online", "H");
        map.put("Durante un evento in presenza", "I");
        map.put("Durante un evento della Settimana nazionale per le competenze Digitali", "J");
        map.put("Materiale informativo e promozionale stampato", "K");
        map.put("Passaparola", "L");
        map.put("Facilitatore/ Formatore", "M");
        return map;
    }

    public static Map<String, String> getES2Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Migliorare nello studio", "A");
        map.put("Ricerca di lavoro", "B");
        map.put("Migliorare nel mio lavoro", "C");
        map.put("Cambiare lavoro", "D");
        map.put("Cultura e crescita personale", "E");
        map.put("Avere maggiore dimestichezza nell’utilizzo dei servizi digitali in generale", "F");
        map.put("Risolvere problemi specifici relativi ai servizi pubblici", "G");
        map.put("Risolvere problemi specifici relativi agli acquisti e ai pagamenti online", "H");
        map.put("Frequento volentieri questo punto di facilitazione", "I");
        map.put("Non ho un motivo particolare", "J");
        map.put("Recuperare un precedente servizio non fruito", "K");
        map.put("Altro", "L");
        return map;
    }

    public static Map<String, String> getES3Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Sì, per facilitazione", "A");
        map.put("Sì, per formazione", "B");
        map.put("Non saprei", "C");
        map.put("No, non ne ho bisogno", "D");
        map.put("No, riconosco il bisogno ma non trovo giovamento nel tornare", "E");
        return map;
    }

    public static Map<String, String> getES5Map() {
        Map<String, String> map = new HashMap<>();
        map.put("Chiedere aiuto a parenti e amici", "A");
        map.put("Chiedere aiuto ai colleghi", "B");
        map.put("Punto di facilitazione", "C");
        map.put("Facilitazione online (es.: videochiamata)", "D");
        map.put("Formazione e seminari in presenza gratuiti", "E");
        map.put("Formazione e seminari in presenza a pagamento", "F");
        map.put("Formazione e seminari online", "G");
        map.put("Piattaforma “ACCEDI”", "H");
        map.put("Motori di ricerca su Internet", "I");
        map.put("Video (es.: YouTube)", "J");
        map.put("Podcast", "K");
        map.put("Blog e forum online", "L");
        map.put("Chat (es.: WhatsApp) e chatbot", "M");
        map.put("Materiale informativo, giornali, articoli e altre pubblicazioni stampate", "N");
        map.put("Materiale informativo, giornali, articoli e altre pubblicazioni online", "O");
        return map;
    }
}
