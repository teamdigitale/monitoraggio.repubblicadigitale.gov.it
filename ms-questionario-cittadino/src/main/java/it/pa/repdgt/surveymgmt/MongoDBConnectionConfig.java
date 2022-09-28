package it.pa.repdgt.surveymgmt;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mongo.MongoClientFactory;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;

@Configuration
@Profile("dev")
public class MongoDBConnectionConfig {

	@Value("${MONGODB_HOST}")
	private String host;
	@Value("${MONGODB_PORT}")
	private String port;
	@Value("${DB_MONGO_USERNAME}")
	private String dbUsername;
	@Value("${DB_MONGO_PASSWORD}")
	private String dbPassword;
	@Value("${MONGODB_NAME}")
	private String dbName;
	
	@Autowired
	private Environment environment;
	
	@Bean
	@ConditionalOnMissingBean(MongoClient.class)
	public MongoClient mongo(MongoProperties properties, Environment environment,
			ObjectProvider<MongoClientSettingsBuilderCustomizer> builderCustomizers,
			ObjectProvider<MongoClientSettings> settings) {
		
		StringBuilder uriBuilder = new StringBuilder("mongodb://");
		
		if(!Arrays.asList(this.environment.getActiveProfiles()).contains("locale")) {
			String uri = uriBuilder.append(dbUsername).append(":").append(dbPassword).append("@").append(host).append(":").append(port).append("/be?retryWrites=false").toString();
			properties.setUri(uri);
		} else {
			properties.setUri(uriBuilder.append("localhost:27017").toString());
		}
		
		properties.setDatabase(dbName);
		
		MongoClientSettings mongoClientSettings = settings.getIfAvailable();
		List<MongoClientSettingsBuilderCustomizer> listMongoClientSettings = builderCustomizers.orderedStream()
				.collect(Collectors.toList());

		MongoClient mongoClientFactory = new MongoClientFactory(listMongoClientSettings)
				.createMongoClient(mongoClientSettings);

		return mongoClientFactory;
	}
}