package it.pa.repdgt.shared.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Builder
@Entity
@Table(name = "registro_attivita")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
public class RegistroAttivitaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @NotEmpty
    private String operatore;
    @CreatedDate
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "Europe/Rome")
    private Date dataInserimento;
    @JsonIgnore
    private String codiceFiscale;
    @NotNull
    private Integer totaleRigheFile;
    @NotNull
    private Integer righeScartate;
    @NotNull
    private Integer serviziAcquisiti;
    @NotNull
    private Integer cittadiniAggiunti;
    @NotNull
    private Integer rilevazioneDiEsperienzaCompilate;
    @NotNull
    private Long idEnte;
    @NotNull
    private Long idProgetto; 
    private String fileName;
    private boolean isFileUpdated;
}
