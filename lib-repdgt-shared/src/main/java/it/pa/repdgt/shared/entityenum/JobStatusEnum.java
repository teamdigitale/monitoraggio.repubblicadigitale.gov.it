package it.pa.repdgt.shared.entityenum;

import lombok.Getter;

@Getter
public enum JobStatusEnum {

    IN_PROGRESS("IN_PROGRESS"), SUCCESS("SUCCESS"), FAIL_MONGO("FAIL_MONGO"), FAIL_S3_API("FAIL_S3_API"),
    FAIL_S3_UPLOAD("FAIL_S3_UPLOAD"), GENERIC_FAIL("GENERIC_FAIL");

    private final String value;

    JobStatusEnum(String value) {
        this.value = value;
    }
}
