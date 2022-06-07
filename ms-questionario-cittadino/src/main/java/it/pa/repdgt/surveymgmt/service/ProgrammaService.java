package it.pa.repdgt.surveymgmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.ProgrammaEntity;
import it.pa.repdgt.surveymgmt.repository.ProgrammaRepository;

@Service
public class ProgrammaService {
	@Autowired
	private ProgrammaRepository programmaRepository;

	public ProgrammaEntity getProgrammaById(Long id) {
		return this.programmaRepository.findById(id).get();
	}
}