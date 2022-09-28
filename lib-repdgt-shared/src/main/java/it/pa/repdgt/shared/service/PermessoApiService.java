package it.pa.repdgt.shared.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.repository.PermessoApiRepository;

@Service
public class PermessoApiService {
	@Autowired
	private PermessoApiRepository permessoApiRepository;
	
	public List<String> getCodiciPermessiApiByMetodoHttpAndPath(String metodoHttp, String endpoint) {
		return this.permessoApiRepository.findCodiciPermessiApiByMetodoHttpAndPath(metodoHttp, endpoint);
	}
}