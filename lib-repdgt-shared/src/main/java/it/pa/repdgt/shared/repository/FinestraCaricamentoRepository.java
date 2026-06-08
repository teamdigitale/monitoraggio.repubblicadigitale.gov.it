package it.pa.repdgt.shared.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.FinestraCaricamentoEntity;

@Repository
public interface FinestraCaricamentoRepository extends JpaRepository<FinestraCaricamentoEntity, Integer> {

}
