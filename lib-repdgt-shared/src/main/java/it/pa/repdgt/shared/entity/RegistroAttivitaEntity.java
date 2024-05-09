package it.pa.repdgt.shared.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

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
public class RegistroAttivitaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    @NotEmpty
    private String operatore;

    @NotNull
    @JsonFormat(pattern = "dd/mm/yyyy")
    private Date dataInserimento;
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
}
