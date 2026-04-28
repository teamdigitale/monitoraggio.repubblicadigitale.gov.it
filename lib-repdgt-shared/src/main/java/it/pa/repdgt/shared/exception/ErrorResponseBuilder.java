package it.pa.repdgt.shared.exception;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

/**
 * Utility per costruire la response degli errori in modo uniforme.
 *
 * Mitigation per WAPT V07 (Improper Error Handling): gli errori interni
 * (Exception generica, DB, runtime) NON espongono al client dettagli su
 * SQL/serializzazione/stack. Il client riceve un messaggio generico + traceId
 * con cui correlare la richiesta nei log server-side.
 */
public final class ErrorResponseBuilder {

    public static final String GENERIC_ERROR_MESSAGE =
            "Si e' verificato un errore. Riferimento: %s";

    private ErrorResponseBuilder() {
        // utility
    }

    /**
     * Costruisce una response generica per errori interni (5xx). Non include
     * mai il messaggio dell'eccezione originale.
     */
    public static Map<String, String> buildGeneric(HttpServletResponse response) {
        String traceId = UUID.randomUUID().toString();
        Map<String, String> body = new HashMap<>();
        body.put("errorCode", CodiceErroreEnum.G01.toString());
        body.put("message", String.format(GENERIC_ERROR_MESSAGE, traceId));
        body.put("traceId", traceId);
        body.put("exchange-id", readExchangeId(response));
        return body;
    }

    /**
     * Costruisce una response per eccezioni business custom: il messaggio
     * (controllato dagli sviluppatori) puo' essere mostrato al client. Aggiunge
     * sempre traceId per correlation.
     */
    public static Map<String, String> buildBusiness(String message, String errorCode,
            HttpServletResponse response) {
        String traceId = UUID.randomUUID().toString();
        Map<String, String> body = new HashMap<>();
        body.put("errorCode", errorCode);
        body.put("message", message);
        body.put("traceId", traceId);
        body.put("exchange-id", readExchangeId(response));
        return body;
    }

    public static String readExchangeId(HttpServletResponse response) {
        List<String> headers = response == null ? null
                : new java.util.ArrayList<>(response.getHeaders("exchange-id"));
        if (headers == null || headers.isEmpty()) {
            return "";
        }
        return headers.get(0);
    }

}
