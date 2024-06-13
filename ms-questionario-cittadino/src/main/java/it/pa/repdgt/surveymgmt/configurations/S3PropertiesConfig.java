package it.pa.repdgt.surveymgmt.configurations;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "aws.s3")
public class S3PropertiesConfig {
    private String accessKey;

    private String secretKey;

    private String region;

    private String bucketName;

    private String endpoint;

    private Integer expirationTimeInMinutes;
}
