package it.pa.repdgt.integrazione;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.zendesk.client.v2.Zendesk;


@Configuration
@Profile("dev")
public class ZendeskConnectionConfig {

    @Value("${ZENDESK_URL}")
    private String zendeskUrl;

    @Value("${ZENDESK_USERNAME}")
    private String zendeskUsername;

    @Value("${ZENDESK_TOKEN}") 
    private String zendeskToken;

    @Bean
    public Zendesk zendeskClient() {
        return new Zendesk.Builder(zendeskUrl)
                .setUsername(zendeskUsername)
                .setToken(zendeskToken)
                .build();
    }
}
