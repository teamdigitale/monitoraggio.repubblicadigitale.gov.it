package it.pa.repdgt.opendata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

@Configuration
public class MongoMapKeyDotReplacementConfiguration {
    @Autowired
    public void setMapKeyDotReplacement(MappingMongoConverter mongoConverter) {
    	//metodo per andare a fare il replace del '.' in '_' sull'id del singolo record
        mongoConverter.setMapKeyDotReplacement("_");
    }
}