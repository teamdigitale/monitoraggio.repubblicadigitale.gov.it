 -- CREAZIONE ANAGRAFICA UTENTI 
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('UIHPLW87R49F205X', 'Polly', 'Smith', 'polly.smith@email.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('SMTPAL67R31F111X', 'Gina',  'Foo', 'gina.foo@email.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('ASDPDS17R65F313X', 'Alice', 'Bar', 'alice.smith@bar.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('MZADDD89E21E123S', 'Felix', 'Reynolds', 'felix@mort.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('XTAAAA54E91E123Z', 'Pippo',  'Dunomn', 'pippo.dunmon@email.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione)
    values('MWEDSQ99E20K123A', 'Mia', 'Stan', 'mia.stan@bar.it', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione) 
	values('FACILITATORE1','F1', 'F1', 'f1@a.com', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione) 
	values('FACILITATORE2','F2', 'F2', 'f2@a.com', 'ATTIVO', CURRENT_TIME( ));
 insert into utente (codice_fiscale, nome, cognome, email, stato, data_ora_creazione) 
	values('UTENTE2','U2', 'U2', 'u2@a.com', 'ATTIVO', CURRENT_TIME());

-- CREAZIONE ANAGRAFICA RUOLI
  insert into ruolo(codice, nome, predefinito)
    values('DTD', 'DTD AMMINISTRATORE', false);
  insert into ruolo(codice, nome, predefinito)
    values('DSCU', 'DSCU .....', true);
  insert into ruolo(codice, nome, predefinito)
    values('REG', 'REFERENTE ENTE GESTORE PROGRAMMA', true);
  insert into ruolo(codice, nome, predefinito)
    values('REGP', 'REFERENTE ENTE GESTORE PROGETTO', true);
  insert into ruolo(codice, nome, predefinito)
    values('DEG', 'DELEGATO ENTE GESTORE PROGRAMMA', true);
  insert into ruolo(codice, nome, predefinito)
    values('DEGP', 'DELEGATO ENTE GESTORE PROGETTO', true);
  insert into ruolo(codice, nome, predefinito)
    values('REP', 'REFERENTE ENTE PARTNER GESTORE PROGRAMMA', true);
  insert into ruolo(codice, nome, predefinito)
    values('REPP', 'REFERENTE ENTE PARTNER GESTORE PROGETTO', true);
  insert into ruolo(codice, nome, predefinito)
    values('DEP', 'DELEGATO ENTE PARTNER GESTORE PROGRAMMA', true);
  insert into ruolo(codice, nome, predefinito)
    values('DEPP', 'DELEGATO ENTE PARTNER GESTORE PROGETTO', true);
  insert into ruolo(codice, nome, predefinito)
    values('FAC', 'FACILITATORE', true);
  insert into ruolo(codice, nome, predefinito)
    values('VOL', 'VOLONTARIO', true);
    
  -- ASSEGNAMENTO RUOLO A UTENTE
  insert into utente_x_ruolo(utente_id, ruolo_codice)
  	values('UIHPLW87R49F205X', 'DTD');
  insert into utente_x_ruolo(utente_id, ruolo_codice)
  	values('SMTPAL67R31F111X', 'DTD');
  insert into utente_x_ruolo(utente_id, ruolo_codice)
  	values('ASDPDS17R65F313X', 'DSCU');
  insert into utente_x_ruolo(utente_id, ruolo_codice)
	values('MZADDD89E21E123S', 'REPP');
	  insert into utente_x_ruolo(utente_id, ruolo_codice)
	values('MZADDD89E21E123S', 'REGP');
  insert into utente_x_ruolo(utente_id, ruolo_codice)
	values('XTAAAA54E91E123Z', 'REPP');
	  insert into utente_x_ruolo(utente_id, ruolo_codice)
	values('XTAAAA54E91E123Z', 'DEGP');
  insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('MWEDSQ99E20K123A', 'REPP');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('FACILITATORE1', 'VOL');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'FAC');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'VOL');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'REGP');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'DEGP');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'REPP');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('UTENTE2', 'DEPP');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('XTAAAA54E91E123Z', 'REG');
 insert into utente_x_ruolo(utente_id, ruolo_codice) 
	values('MWEDSQ99E20K123A', 'DEG');
  		


 -- CREAZIONE ANAGRAFICA PROGRAMMI
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(100, 'Programma Alfa', 'A100', 'codice1', 'Programma Alfa', 'SCD', 'ATTIVO', CURRENT_TIME( ));
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(101, 'Programma Beta', 'B101', 'codice2', 'Programma Beta', 'SCD', 'ATTIVO', CURRENT_TIME( ));
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(102, 'Programma Gamma','G102', 'codice3', 'Programma Gamma', 'SCD', 'ATTIVO', CURRENT_TIME( ));
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(103, 'Programma Sigma','D103', 'codice4', 'Programma Sigma', 'SCD', 'ATTIVO', CURRENT_TIME( ));
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(104, 'Programma Rho', 'R104', 'codice5', 'Programma Rho', 'SCD', 'ATTIVO', CURRENT_TIME( ));
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato, data_ora_creazione)
	values(105, 'Programma Tau', 'T105', 'codice6', 'Programma Tau', 'SCD', 'ATTIVO', CURRENT_TIME( ));
	
-- CREAZIONE ANAGRAFICA PROGETTI
 insert into progetto(id, nome, nome_breve, stato, data_ora_creazione, cup)
	values(250, 'Progetto Sviluppo Web', 'Programma Sviluppo Web', 'ATTIVO', CURRENT_TIME( ), 'AQWQQ1FD2244');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(251, 'Progetto Sicurezza Lavoro', 'Progetto Sicurezza Lavoro', 'ATTIVO', CURRENT_TIME( ), 'DF77QWQWQWQQ1441');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(252, 'Progetto Sicurezza Informatica', 'Programma Sicurezza Informatica',  'ATTIVO', CURRENT_TIME( ), 'DFFE677FFWQWQQ1441');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(253, 'Progetto Alfabetizzazione Informatica', 'Programma Alfabetizzazione Informatica', 'ATTIVO', CURRENT_TIME( ), 'DFFPPP0000WQWQQ1441');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(254, 'Progetto Social Network', 'Programma Social Network', 'ATTIVO', CURRENT_TIME( ), 'DFFWQWQQ14QRQF33QWPJL41');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(255, 'Progetto SEO Specialist', 'Programma SEO Specialist', 'ATTIVO', CURRENT_TIME( ), 'DFFWQFAA54WQQ14WQ41');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(256, 'Progetto Data Science', 'Progetto Data Science', 'ATTIVO', CURRENT_TIME( ), 'DFFWQ3423FPOWQQ1441WQ');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(257, 'Progetto Block Chain', 'Progetto Block Chain', 'ATTIVO', CURRENT_TIME( ), 'DFFEQQ3WQWQQ14QW41');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(258, 'Progetto Sviluppo Mobile', 'Progetto Sviluppo Mobile', 'ATTIVO', CURRENT_TIME( ), 'DFFWQWQASZQ14FAFAFA41');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(259, 'Progetto Sviluppo Videogame', 'Progetto Sviluppo Videogame', 'ATTIVO', CURRENT_TIME( ), 'FFDFGVCXWQFAQQ1441');
		
-- ASSOCIAZIONE DEI PROGETTI AI PROGRAMMI
 update progetto
    set id_programma = 100
 where id = 250;
 update progetto
    set id_programma = 100 
 where id = 251;
  update progetto
    set id_programma = 100 
 where id = 252;
 update progetto
    set id_programma = 101 
 where id = 253;
  update progetto
    set id_programma = 101 
 where id = 254;
 update progetto
    set id_programma = 102 
 where id = 255;
 update progetto
    set id_programma = 103 
 where id = 256;
 update progetto
    set id_programma = 104 
 where id = 257;
 update progetto
    set id_programma = 105
 where id = 258;
 update progetto
    set id_programma = 105
 where id = 259;
 
 -- CREAZIONE ANAGRAFICA ENTI
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1000, 'Regione Lombardia', 'Regione Lombardia', 'pubblico', '11345578800', 'Piazza Della Scala,2 20121 Milano', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1001, 'Regione Lazio', 'Regione Lazio', 'pubblico', '99345668001', 'Piazza Fontana,1 00123 Roma', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1002, 'Regione Siclia', 'Regione Sicilia', 'pubblico', '88345778801', 'Piazza Elena,22 92027 Licata', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1003, 'Regione Piemonte', 'Regione Piemonte', 'pubblico', '77355688901', 'Via Po,79 10124 Torino', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1004, 'Ospedale Humanitas Milano', 'Ospedale Humanitas Milano', 'privato', '55335678999', 'Via Paolo Sarpi,15 20121 Milano', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1005, 'Regione Molise', 'Regione Molise', 'pubblico', '44456789119', 'Via Volta,6 75100 Matera', CURRENT_TIME( ));
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale, data_ora_creazione) 
     values(1006, 'Regione Campania', 'Regione Campania', 'pubblico', '22344672811', 'Via Battisti,15 80124 Napoli', CURRENT_TIME( ));
     
 -- CREAZIONE ANAGRAFICA SEDE
 insert into sede(id, nome)
	values(1, 'Sede x');
 insert into sede(id, nome)
	values(2, 'Sede y');
 insert into sede(id, nome)
	values(3, 'Sede z');
 insert into sede(id, nome)
	values(4, 'Sede w');
	
-- CREAZIONE ANAGRAFICA INDIRIZZO_SEDE E ASSOCIAZIONE A SEDE
insert into indirizzo_sede(id, cap, civico, comune, data_ora_aggiornamento, data_ora_creazione, sede_id, nazione, provincia, via) 
	values(1, '92027', '11', 'Licata', NULL, CURRENT_TIME(), 1, 'ITALIA', 'AG', 'via Torino');
insert into indirizzo_sede(id, cap, civico, comune, data_ora_aggiornamento, data_ora_creazione, sede_id, nazione, provincia, via)
	values(2, '20183', '98A', 'Genova', NULL, CURRENT_TIME(), 1, 'ITALIA', 'GE', 'via Crispi');
insert into indirizzo_sede(id, cap, civico, comune, data_ora_aggiornamento, data_ora_creazione, sede_id, nazione, provincia, via)
	values(3, '20122', '8A', 'Milano', NULL, CURRENT_TIME(), 2, 'ITALIA', 'MI', 'via Paolo Sarpi');
insert into indirizzo_sede(id, cap, civico, comune, data_ora_aggiornamento, data_ora_creazione, sede_id, nazione, provincia, via)
	values(4, '00871', '11', 'Bari', NULL, CURRENT_TIME(), 3, 'ITALIA', 'BA', 'via Pincopallo');
insert into indirizzo_sede(id, cap, civico, comune, data_ora_aggiornamento, data_ora_creazione, sede_id, nazione, provincia, via)
	values(5, '00157', '99', 'Roma', NULL, CURRENT_TIME(), 4, 'ITALIA', 'RM', 'via Giulio Cesare');
	
	
-- CREAZIONE ANAGRAFICA INDIRIZZO_SEDE_FASCIA_ORARIA E ASSOCIAZIONE A INDIRIZZO_SEDE

 -- ASSEGNAMENTO DEGLI ENTI GESTORI DI PROGRAMMA AI PROGRAMMI
 -- E ASSEGNAZIONE STATO DELL'ENTE GESTORE DI PROGRAMMA
 update programma
    set 
    	  id_ente_gestore_programma = 1000
    	 ,stato_gestore_programma = 'NON ATTIVO'
 where id = 100;
 update programma
    set 
    	  id_ente_gestore_programma = 1001
    	 ,stato_gestore_programma = 'NON ATTIVO'
 where id = 101;
 update programma
    set 
    	  id_ente_gestore_programma = 1001
    	 ,stato_gestore_programma = 'NON ATTIVO'
 where id = 102;
 update programma
    set 
    	  id_ente_gestore_programma = 1002
    	 ,stato_gestore_programma = 'NON ATTIVO'
 where id = 103;
 update programma
    set 
    	  id_ente_gestore_programma = 1003
    	 ,stato_gestore_programma = 'NON ATTIVO'
 where id = 104;
 
  -- ASSEGNAMENTO DEGLI ENTI GESTORI DI PROGETTO AI PROGETTI
  -- E ASSEGNAZIONE STATO DELL'ENTE GESTORE DI PROGETTO
 update progetto
	set 
		 id_ente_gestore_progetto = 1000
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 250;
  update progetto
	set 
		 id_ente_gestore_progetto = 1000
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 251;
  update progetto
	set 
		 id_ente_gestore_progetto = 1001
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 252;
  update progetto
	set 
		id_ente_gestore_progetto = 1002
  where id = 253;
  update progetto
	set 
		id_ente_gestore_progetto = 1002
  where id = 254;
  update progetto
	set 
		 id_ente_gestore_progetto = 1003
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 255;
  update progetto
	set 
		 id_ente_gestore_progetto = 1004
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 256;
  update progetto
	set 
		 id_ente_gestore_progetto = 1004
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 257;
  update progetto
	set 
		 id_ente_gestore_progetto = 1005
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 258;
  update progetto
	set 
		 id_ente_gestore_progetto = 1006
		,stato_gestore_progetto = 'NON ATTIVO'
  where id = 259;
 
-- ASSEGNAMENTO DEGLI ENTI PARTNER A PROGETTO
insert into ente_partner(id_ente, id_progetto, stato_ente_partner, data_ora_creazione) 
	values(1005, 256, 'ATTIVO', CURRENT_TIME( ));
insert into ente_partner(id_ente, id_progetto, stato_ente_partner, data_ora_creazione)  
	values(1006, 256, 'ATTIVO', CURRENT_TIME( ));
	
-- ASSEGNAMENTO DEI REFERENTI/DELEGATI PARTNER AGLI ENTI
insert into referente_delegati_partner(cf_utente, id_ente, id_progetto, codice_ruolo, data_ora_creazione)   
	values('MZADDD89E21E123S', 1005, 256, 'REPP', CURRENT_TIME( ));
insert into referente_delegati_partner(cf_utente, id_ente, id_progetto, codice_ruolo, data_ora_creazione)   
	values('XTAAAA54E91E123Z', 1005, 256, 'REPP', CURRENT_TIME( ));
insert into referente_delegati_partner(cf_utente, id_ente, id_progetto, codice_ruolo, data_ora_creazione)   
	values('MWEDSQ99E20K123A', 1005, 256, 'REPP', CURRENT_TIME( ));
insert into referente_delegati_partner(cf_utente, id_ente, id_progetto, codice_ruolo, data_ora_creazione)  
	values('MWEDSQ99E20K123A', 1006, 256, 'REPP', CURRENT_TIME( ));
	
-- ASSEGNAMENTO ENTE_SEDE_PROGETTO
insert into ente_sede_progetto(id_ente, id_progetto, id_sede, ruolo_ente, stato_sede)
	values(1005, 256, 1, 'EGP', 'ATTIVO');
insert into ente_sede_progetto(id_ente, id_progetto, id_sede, ruolo_ente, stato_sede)
	values(1005, 251, 2, 'EGP', 'ATTIVO');
insert into ente_sede_progetto(id_ente, id_progetto, id_sede, ruolo_ente, stato_sede)
	values(1005, 254, 1, 'EGP', 'NON ATTIVO');
insert into ente_sede_progetto(id_ente, id_progetto, id_sede, ruolo_ente, stato_sede)
	values(1000, 251, 1, 'EGP', 'ATTIVO');
insert into ente_sede_progetto(id_ente, id_progetto, id_sede) 
	values(1000, 250, 1);
	
-- ASSEGNAMENTO ENTE_SEDE_PROGETTO_FACILITATORE
insert into ente_sede_progetto_facilitatore(id_ente, id_facilitatore, id_progetto, id_sede, ruolo_utente)
	values(1005, 'UTENTE2',  256, 1, 'FAC');
insert into ente_sede_progetto_facilitatore(id_ente, id_facilitatore, id_progetto, id_sede, ruolo_utente) 
	values(1005, 'UTENTE2',  254, 1, 'VOL');
insert into ente_sede_progetto_facilitatore (id_ente, id_progetto, id_sede, id_facilitatore, ruolo_utente) 
	values (1005, 256, 1, 'FACILITATORE1', 'VOL'); 
insert into ente_sede_progetto_facilitatore (id_ente, ID_progetto, id_sede, id_facilitatore, ruolo_utente) 
	values (1005, 251, 1, 'FACILITATORE2', 'VOL'); 

--ASSEGNAMENTO REFERENTI / DELEGATI ENTE GESTORE PROGETTO
 insert into referente_delegati_gestore_progetto(cf_utente, id_progetto, id_ente, codice_ruolo, data_ora_aggiornamento, data_ora_creazione, stato_utente)
	values('XTAAAA54E91E123Z', 256, 1004, 'DEGP', null, CURRENT_TIME(), 'ATTIVO');
 insert into referente_delegati_gestore_progetto(cf_utente, id_progetto, id_ente, codice_ruolo, data_ora_aggiornamento, data_ora_creazione, stato_utente)
	values('MZADDD89E21E123S', 256, 1004, 'REGP', null, CURRENT_TIME(), 'ATTIVO');

--CITTADINI
INSERT INTO cittadino ("ID","ANNO_DI_NASCITA","CODICE_FISCALE","COGNOME","EMAIL","NOME","NUMERO_DI_CELLULARE")VALUES(1,1986,'SMNCLL86P12H501A','COGNOME_PROVA','eeee@ee.com','NOME_PROVA',45353);


--QUESTIONARIO_TEMPLATE
insert into questionario_template(id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, DEFAULT_RFD, DEFAULT_SCD, DESCRIZIONE, NOME, STATO) 
	values('aeseur2hf', current_timestamp, current_timestamp, true, true, 'descrizione', 'prova_templtate','ATTIVO');
insert into questionario_template(id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, DEFAULT_RFD, DEFAULT_SCD, DESCRIZIONE, NOME, STATO) 
	values('hgirwekg', current_timestamp, current_timestamp, false, false, 'descrizione2', 'prova_templtate2','ATTIVO');
insert into questionario_template(id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, DEFAULT_RFD, DEFAULT_SCD, DESCRIZIONE, NOME, STATO) 
	values('jfkbfadlda', current_timestamp, current_timestamp, true, false, 'descrizione3', 'prova_templtate3','ATTIVO');

	
-- PROGRAMMA_X_QUESTIONARIO_TEMPLATE
insert into programma_x_questionario_template(programma_id, questionario_template_id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, STATO)
	values(100, 'aeseur2hf', current_timestamp, current_timestamp, 'ATTIVO');	
insert into programma_x_questionario_template(programma_id, questionario_template_id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, STATO)
	values(101, 'hgirwekg', current_timestamp, current_timestamp, 'ATTIVO');	
insert into programma_x_questionario_template(programma_id, questionario_template_id, DATA_ORA_CREAZIONE, DATA_ORA_AGGIORNAMENTO, STATO)
	values(104, 'jfkbfadlda', current_timestamp, current_timestamp, 'ATTIVO');	
	
	
--SERVIZIO
-- insert into servizio values(1,current_timestamp,current_timestamp,current_date, 1005,'UTENTE2', 256,1,1,'','nome_servizio','ATTIVO','');

--QUESTIONARIO_COMPILATO
insert into QUESTIONARIO_COMPILATO values(1,current_timestamp,current_timestamp, 1005,'UTENTE2',256,1,1,1,'ATTIVO',1);

--SERVIZIO_X_CITTADINO
insert into servizio_x_cittadino values(1,1,current_timestamp,current_timestamp);
