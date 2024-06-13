package it.pa.repdgt.surveymgmt.configurations;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
@RequiredArgsConstructor
public class S3Config {

    private final S3PropertiesConfig s3PropertiesConfig;

    @Bean
    public AmazonS3 s3() {
        return AmazonS3ClientBuilder
                .standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(s3PropertiesConfig.getEndpoint(),
                        s3PropertiesConfig.getRegion()))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(
                        s3PropertiesConfig.getAccessKey(), getS3PropertiesConfig().getSecretKey())))
                .build();
    }
}
