package it.pa.repdgt.shared.repository.tipologica;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.pa.repdgt.shared.entity.tipologica.TipologiaUbicazioneSedeEntity;

@Repository
public interface TipologiaUbicazioneSedeRepository extends JpaRepository<TipologiaUbicazioneSedeEntity, Long> {
}
