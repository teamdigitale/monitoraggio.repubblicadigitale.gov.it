package it.pa.repdgt.surveymgmt.request;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@JsonInclude(value = Include.NON_NULL)
@Getter
@Setter
@ToString
public class ConfigurazioneMinorenniPaginatiRequest implements Serializable{

    @JsonProperty(value = "currentPage")
    private Integer currentPage;

    @JsonProperty(value = "pageSize")
    private Integer pageSize;

    @JsonProperty(value = "sortBy")
    private String sortBy;

    @JsonProperty(value = "sortOrder")
    private String sortOrder;
    
}
