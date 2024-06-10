package it.pa.repdgt.surveymgmt.components;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import it.pa.repdgt.surveymgmt.configurations.S3PropertiesConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URL;
import java.util.Calendar;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService {

    private final AmazonS3 amazonS3;
    private final S3PropertiesConfig s3PropertiesConfig;

    public String generateUrl(String fileName, HttpMethod httpMethod, String bucketName) {
        log.debug("bucketName {} e fileName {}", bucketName, fileName);
        log.info("bucketName {} e fileName {}", bucketName, fileName);
        if (stripSOPrefix(fileName) != null && stripSOPrefix(fileName).equals("")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE, s3PropertiesConfig.getExpirationTimeInMinutes());
        String url = amazonS3.generatePresignedUrl(bucketName, fileName, calendar.getTime(), httpMethod).toString();
        log.debug("url generato {}", url);
        log.info("url generato {}", url);
        return url;
    }


    public String save(String fileName, String bucketName) {
        return generateUrl(fileName, HttpMethod.PUT, bucketName);
    }

    public String stripSOPrefix(String filePath){
        return filePath.replaceAll("\\d+\\/","");
    }
}
