package it.pa.repdgt.gestioneutente;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class MyConfiguration implements WebMvcConfigurer {
    @Autowired
    private LogReqResInterceptor logReqResInterceptor;

    /**
     * Origini fidate CORS (mitigation V08 SAST + WAPT V8).
     * Configurate in application(-dev).properties come lista separata da virgole.
     * NOTA: la configurazione effettiva di Access-Control-Allow-Origin in
     * produzione e' gestita anche da AWS API Gateway. Questa configurazione
     * applicativa funge da defense in depth.
     * TODO PROD: aggiungere origini produzione (verificare con team)
     */
    @Value("${cors.allowed-origins:}")
    private String[] allowedOrigins;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logReqResInterceptor);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (allowedOrigins == null || allowedOrigins.length == 0) {
            return;
        }
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}