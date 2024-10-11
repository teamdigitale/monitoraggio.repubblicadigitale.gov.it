package it.pa.repdgt.surveymgmt.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.VMonitoraggioCaricamentiEntity;

import java.sql.Date;
import java.util.List;

@Repository
public interface VMonitoraggioCaricamentiRepository extends JpaRepository<VMonitoraggioCaricamentiEntity, Long> {

        @Query(value = "SELECT * FROM v_monitoraggio_caricamenti\n" +
                        "WHERE (:intervento IS NULL OR intervento = :intervento)\n" +
                        "AND (:idProgetto IS NULL OR id_progetto = :idProgetto)\n" +
                        "AND (:idProgramma IS NULL OR id_programma = :idProgramma)\n" +
                        "AND (COALESCE(:idEnti) IS NULL OR id_ente IN (:idEnti))\n" +
                        "AND (:dataInizio IS NULL OR data_caricamenti >= :dataInizio)\n" +
                        "AND (:dataFine IS NULL OR data_caricamenti <= :dataFine)\n", nativeQuery = true)
        public Page<VMonitoraggioCaricamentiEntity> findAllPaginate(@Param("intervento") String intervento,
                        @Param("idProgetto") Long idProgetto,
                        @Param("idProgramma") Long idProgramma, @Param("idEnti") List<Long> idEnti,
                        @Param("dataInizio") Date dataInizio,
                        @Param("dataFine") Date dataFine, Pageable pageable);

        @Query(value = "SELECT * FROM v_monitoraggio_caricamenti\n" +
                        "WHERE (:intervento IS NULL OR intervento = :intervento)\n" +
                        "AND (:idProgetto IS NULL OR id_progetto = :idProgetto)\n" +
                        "AND (:idProgramma IS NULL OR id_programma = :idProgramma)\n" +
                        "AND (COALESCE(:idEnti) IS NULL OR id_ente IN (:idEnti))\n" +
                        "AND (:dataInizio IS NULL OR data_caricamenti >= :dataInizio)\n" +
                        "AND (:dataFine IS NULL OR data_caricamenti <= :dataFine)\n", nativeQuery = true)
        public List<VMonitoraggioCaricamentiEntity> findAll(@Param("intervento") String intervento,
                        @Param("idProgetto") Long idProgetto,
                        @Param("idProgramma") Long idProgramma, @Param("idEnti") List<Long> idEnti,
                        @Param("dataInizio") Date dataInizio,
                        @Param("dataFine") Date dataFine);

}
