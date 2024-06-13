package it.pa.repdgt.ente.util;

import org.springframework.util.StringUtils;

public class RegioneUtil {

    public static String getIndirizzoSede(String regione) {
        switch (regione) {
            case "emilia-romagna": {
                return "Emilia-Romagna";
            }
            case "trentino-alto-adige": {
                return "Trentino-Alto-Adige";
            }
            case "friuli-venezia-giulia": {
                return "Friuli-Venezia-Giulia";
            }
            default: {
                return StringUtils.capitalize(regione);
            }
        }
    }

}
