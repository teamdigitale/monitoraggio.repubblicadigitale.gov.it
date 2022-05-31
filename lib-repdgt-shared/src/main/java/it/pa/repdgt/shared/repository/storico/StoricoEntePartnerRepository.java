package it.pa.repdgt.shared.repository.storico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.storico.StoricoEntePartnerEntity;

@Repository
public interface StoricoEntePartnerRepository extends JpaRepository<StoricoEntePartnerEntity, Long> { }