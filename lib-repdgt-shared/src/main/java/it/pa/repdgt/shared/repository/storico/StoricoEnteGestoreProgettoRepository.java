package it.pa.repdgt.shared.repository.storico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.storico.StoricoEnteGestoreProgettoEntity;

@Repository
public interface StoricoEnteGestoreProgettoRepository extends JpaRepository<StoricoEnteGestoreProgettoEntity, Long> { }