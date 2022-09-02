package it.pa.repdgt.ente.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.IndirizzoSedeFasciaOrariaEntity;

@Repository
public interface IndirizzoSedeFasciaOrariaRepository extends JpaRepository<IndirizzoSedeFasciaOrariaEntity, Long> {

	Optional<IndirizzoSedeFasciaOrariaEntity> findByIdIndirizzoSede(@Param(value = "idIndirizzoSede") Long idIndirizzoSede); 
}