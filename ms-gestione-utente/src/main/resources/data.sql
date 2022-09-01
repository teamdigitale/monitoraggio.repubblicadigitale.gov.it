-- CREAZIONE PERMESSI
insert into permesso (CODICE, DESCRIZIONE) values('AAA', 'prova permesso 1');
insert into permesso (CODICE, DESCRIZIONE) values('BBB', 'prova permesso 2');



 -- CREAZIONE ANAGRAFICA UTENTI
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('UTENTE1','U1', 'U1', 'a@a.com', 'ATTIVO', false);
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('UTENTE2','U2', 'U1', 'b@a.com', 'ATTIVO', true);
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('UTENTE3','U3', 'U1', 'c@a.com', 'ATTIVO', false);
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('UTENTE4','U4', 'U1', 'd@a.com', 'ATTIVO', false);
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('FACILITATORE1','F1', 'F1', 'f1@a.com', 'ATTIVO', false);
insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione) values('FACILITATORE2','F2', 'F2', 'f2@a.com', 'ATTIVO', false);
insert into utente (id, codice_fiscale, nome, cognome, email, stato, integrazione) values(99, 'UTENTE99','U99', 'U99', 'u99@a.com', 'ATTIVO', false);


insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione)
    values('UIHPLW87R49F205X', 'Polly', 'Smith', 'polly.smith@email.it', 'ATTIVO', true);
 insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione)
    values('SMTPAL67R31F111X', 'Gina',  'Foo', 'gina.foo@email.it', 'ATTIVO', false);
 insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione)
    values('ASDPDS17R65F313X', 'Alice', 'Bar', 'alice.smith@bar.it', 'ATTIVO', true);
    insert into utente (codice_fiscale, nome, cognome, email, stato, integrazione)
    values('HJKPLW87R49F321I', 'Pippo', 'Kelly', 'pippo.kelly@email.it', 'ATTIVO', true);
    

-- CREAZIONE ANAGRAFICA RUOLI
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DTD', 'DTD AMMINISTRATORE', FALSE, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DSCU', 'DSCU .....', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('REG', 'REFERENTE ENTE GESTORE PROGRAMMA', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('REGP', 'REFERENTE ENTE GESTORE PROGETTO', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DEG', 'DELEGATO ENTE GESTORE PROGRAMMA', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DEGP', 'DELEGATO ENTE GESTORE PROGETTO', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('REP', 'REFERENTE ENTE PARTNER GESTORE PROGRAMMA', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('REPP', 'REFERENTE ENTE PARTNER GESTORE PROGETTO', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DEP', 'DELEGATO ENTE PARTNER GESTORE PROGRAMMA', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('DEPP', 'DELEGATO ENTE PARTNER GESTORE PROGETTO', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('FAC', 'FACILITATORE', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('VOL', 'VOLONTARIO', true, false);
  insert into ruolo(codice, nome, predefinito, modificabile)
    values('CUSTOM ROLE', 'CUSTOM FANTASTIC ROLE', FALSE, false);
    
  -- CREAZIONE ANAGRAFICA GRUPPI
  insert into gruppo(codice, descrizione)
	values('programma.view', 'Visualizzazione programmi');
  insert into gruppo(codice, descrizione)
	values('programma.write', 'Creazione/Modifica programma');
  insert into gruppo(codice, descrizione)
	values('progetto.view', 'Visualizzazione progetti');
  insert into gruppo(codice, descrizione)
	values('progetto.write', 'Creazione/Modifica progetto');
  insert into gruppo(codice, descrizione)
	values('ente.view', 'Visualizzazione enti');
  insert into gruppo(codice, descrizione)
	values('ente.write', 'Creazione/Modifica ente');
  insert into gruppo(codice, descrizione)
	values('questionario.view', 'Visualizzazione questionari ');
  insert into gruppo(codice, descrizione)
	values('questionario.write', 'Creazione/Modifica questionario');
    
  -- ASSEGNAMENTO RUOLO A UTENTE
  insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE)
  	values('UIHPLW87R49F205X', 'DTD');
  insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE)
  	values('SMTPAL67R31F111X', 'DTD');
  insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE)
  	values('ASDPDS17R65F313X', 'DSCU');
  INSERT INTO UTENTE_X_RUOLO(UTENTE_ID, RUOLO_CODICE) VALUES('UIHPLW87R49F205X', 'REPP');
  INSERT INTO UTENTE_X_RUOLO(UTENTE_ID, RUOLO_CODICE) VALUES('SMTPAL67R31F111X', 'REPP');
  INSERT INTO UTENTE_X_RUOLO(UTENTE_ID, RUOLO_CODICE) VALUES('ASDPDS17R65F313X', 'REPP');

insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE1', 'DTD');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE1', 'DEGP');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE2', 'DEG');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE2', 'DEPP');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE2', 'REG');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE2', 'FAC');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE2', 'VOL');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE3', 'DEG');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE3', 'REPP');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('UTENTE4', 'REGP');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('FACILITATORE1', 'FAC');
insert into utente_x_ruolo(UTENTE_ID, RUOLO_CODICE) values ('FACILITATORE2', 'FAC');

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
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1000, 'Regione Lombardia', 'Regione Lombardia', 'pubblico', '11345578800', 'Piazza Della Scala,2 20121 Milano');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1001, 'Regione Lazio', 'Regione Lazio', 'pubblico', '99345668001', 'Piazza Fontana,1 00123 Roma');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1002, 'Regione Siclia', 'Regione Sicilia', 'pubblico', '88345778801', 'Piazza Elena,22 92027 Licata');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1003, 'Regione Piemonte', 'Regione Piemonte', 'pubblico', '77355688901', 'Via Po,79 10124 Torino');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1004, 'Ospedale Humanitas Milano', 'Ospedale Humanitas Milano', 'privato', '55335678999', 'Via Paolo Sarpi,15 20121 Milano');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1005, 'Regione Molise', 'Regione Molise', 'pubblico', '44456789119', 'Via Volta,6 75100 Matera');
 insert into ente(id, nome, nome_breve, tipologia, partita_iva, sede_legale) 
     values(1006, 'Regione Campania', 'Regione Campania', 'pubblico', '22344672811', 'Via Battisti,15 80124 Napoli');
	 
 -- ASSEGNAMENTO DEGLI ENTI GESTORI DI PROGRAMMA AI PROGRAMMI
 update programma
    set id_ente_gestore_programma = 1000
 where id = 100;
 update programma
    set id_ente_gestore_programma = 1001
 where id = 101;
 update programma
    set id_ente_gestore_programma = 1001
 where id = 102;
 update programma
    set id_ente_gestore_programma = 1002
 where id = 103;
 update programma
    set id_ente_gestore_programma = 1003
 where id = 104;

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
 insert into programma(id, nome, cup, codice, nome_breve, policy, stato)
 	values(2, 'Programma 2','P02', 'codice7', 'Programma 2', 'RDF', 'ATTIVO') ;

-- CREAZIONE ANAGRAFICA PROGETTI
 insert into progetto(id, nome, nome_breve, stato, data_ora_creazione, cup)
	values(250, 'Progetto Sviluppo Web', 'Programma Sviluppo Web', 'ATTIVO', CURRENT_TIME( ), 'AA001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(251, 'Progetto Sicurezza Lavoro', 'Progetto Sicurezza Lavoro', 'ATTIVO', CURRENT_TIME( ), 'VV001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(252, 'Progetto Sicurezza Informatica', 'Programma Sicurezza Informatica',  'ATTIVO', CURRENT_TIME( ), 'HH001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(253, 'Progetto Alfabetizzazione Informatica', 'Programma Alfabetizzazione Informatica', 'ATTIVO', CURRENT_TIME( ), 'SS001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(254, 'Progetto Social Network', 'Programma Social Network', 'ATTIVO', CURRENT_TIME( ), 'JJ001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(255, 'Progetto SEO Specialist', 'Programma SEO Specialist', 'ATTIVO', CURRENT_TIME( ), 'KK001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(256, 'Progetto Data Science', 'Progetto Data Science', 'ATTIVO', CURRENT_TIME( ), 'XX001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(257, 'Progetto Block Chain', 'Progetto Block Chain', 'ATTIVO', CURRENT_TIME( ), 'YY001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(258, 'Progetto Sviluppo Mobile', 'Progetto Sviluppo Mobile', 'ATTIVO', CURRENT_TIME( ), 'TT001');
 insert into progetto(id, nome, nome_breve,  stato, data_ora_creazione, cup)
	values(259, 'Progetto Sviluppo Videogame', 'Progetto Sviluppo Videogame', 'ATTIVO', CURRENT_TIME( ), 'ZZ001');
	
-- ASSOCIAZIONE ENTE GESTORE PROGETTO AL PROGETTO	
 update progetto 
	set ID_ENTE_GESTORE_PROGETTO = '1005', STATO_GESTORE_PROGETTO = 'NON ATTIVO' 
 where id=253;
 update progetto 
 	set ID_ENTE_GESTORE_PROGETTO = '1006', STATO_GESTORE_PROGETTO = 'TERMINATO'  
 where id=254;
 update progetto 
 	set ID_ENTE_GESTORE_PROGETTO = '1005', STATO_GESTORE_PROGETTO = 'NON ATTIVO' 
 where id=256;

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

 -- ASSEGNAMENTO DEGLI ENTI GESTORI DI PROGRAMMA AI PROGRAMMI
 update programma
    set id_ente_gestore_programma = 1000
 where id = 100;
 update programma
    set id_ente_gestore_programma = 1001
 where id = 101;
 update programma
    set id_ente_gestore_programma = 1001
 where id = 102;
 update programma
    set id_ente_gestore_programma = 1002
 where id = 103;
 update programma
    set id_ente_gestore_programma = 1003
 where id = 104;
 
 --INSERT REFERENTE_DELEGATI_GESTORE_PROGRAMMA
insert into referente_delegati_gestore_programma (CF_UTENTE, ID_ENTE, ID_PROGRAMMA, CODICE_RUOLO)
	values('UTENTE2', 1001, 102, 'REG');
insert into referente_delegati_gestore_programma(CF_UTENTE, ID_ENTE, ID_PROGRAMMA, CODICE_RUOLO)
	values('UTENTE2', 1002, 103, 'REG');
insert into referente_delegati_gestore_programma(CF_UTENTE, ID_ENTE, ID_PROGRAMMA, CODICE_RUOLO)
	values('UTENTE3', 1000, 100, 'DEG');
INSERT INTO referente_delegati_gestore_programma(CF_UTENTE, ID_ENTE, ID_PROGRAMMA,CODICE_RUOLO)
	VALUES('UTENTE2', 1000, 100,'REG');

 --INSERT REFERENTE_DELEGATI_GESTORE_PROGETTO
insert into referente_delegati_gestore_progetto (CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO)
	values('UTENTE4', 1005, 253, 'REGP');
insert into referente_delegati_gestore_progetto(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO)
	values('UTENTE1', 1005, 256, 'DEGP');
insert into referente_delegati_gestore_progetto(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO)
	values('UTENTE4', 1006, 254, 'REGP');
insert into referente_delegati_gestore_progetto(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO)
	values('UTENTE4', 1005, 256, 'REGP');

-- ASSOCIAMO ENTI PARTNER A PROGETTO
INSERT INTO ENTE_PARTNER(ID_ENTE, ID_PROGETTO, STATO_ENTE_PARTNER) 
	VALUES(1005, 256, 'ATTIVO');
INSERT INTO ENTE_PARTNER(ID_ENTE, ID_PROGETTO, STATO_ENTE_PARTNER)
	VALUES(1006, 256, 'ATTIVO');

INSERT INTO ENTE_PARTNER(ID_ENTE, ID_PROGETTO, STATO_ENTE_PARTNER)
	VALUES(1005, 251, 'ATTIVO');
INSERT INTO ENTE_PARTNER(ID_ENTE, ID_PROGETTO, STATO_ENTE_PARTNER) 
	VALUES(1006, 259, 'ATTIVO');
update ENTE_PARTNER set STATO_ENTE_PARTNER = 'NON ATTIVO' where id_progetto = 259 and id_ente = 1006;

-- ASSOCIAMO REFERENTE E DELEGATO PARTNER AI 2 ENTI
INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('UIHPLW87R49F205X', 1005, 256, 'REPP');
INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('SMTPAL67R31F111X', 1005, 256, 'REPP');
INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('ASDPDS17R65F313X', 1005, 256, 'REPP');
INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('ASDPDS17R65F313X', 1006, 256, 'REPP');

INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('UTENTE2', 1005, 251, 'DEPP');
INSERT INTO REFERENTE_DELEGATI_PARTNER(CF_UTENTE, ID_ENTE, ID_PROGETTO, CODICE_RUOLO) 
	VALUES('UTENTE3', 1006, 259, 'REPP');

-- CREAZIONE SEDE
insert into SEDE(NOME, ITINERE) 
	values('SEDE200', FALSE);

-- ASSOCIAZIONE ENTE-SEDE-PROGETTO
insert into ENTE_SEDE_PROGETTO(ID_ENTE, ID_PROGETTO, ID_SEDE, RUOLO_ENTE, STATO_SEDE)
	values(1005, 257, 1, 'EGP', 'NON ATTIVO');
insert into ENTE_SEDE_PROGETTO(ID_ENTE, ID_PROGETTO, ID_SEDE, RUOLO_ENTE, STATO_SEDE)
	values(1005, 254, 1, 'EGP', 'NON ATTIVO');
insert into ente_sede_progetto (id_ente, ID_progetto, ID_SEDE) 
	values (1000, 250, 1); 
insert into ente_sede_progetto (id_ente, ID_progetto, ID_SEDE) 
	values (1000, 251, 1); 



-- ASSOCIAZIONE ENTE-SEDE-PROGETTO-FACILITATORE

insert into ENTE_SEDE_PROGETTO_FACILITATORE(ID_ENTE, ID_FACILITATORE, ID_PROGETTO, ID_SEDE, RUOLO_UTENTE)
	values(1005, 'UTENTE2',  257, 1, 'FAC');
insert into ENTE_SEDE_PROGETTO_FACILITATORE(ID_ENTE, ID_FACILITATORE, ID_PROGETTO, ID_SEDE, RUOLO_UTENTE) 
	values(1005, 'UTENTE2',  254, 1, 'VOL');
insert into ente_sede_progetto_facilitatore (id_ente, ID_progetto, ID_SEDE, ID_FACILITATORE, ruolo_utente) values (1000, 251, 1, 'FACILITATORE1', 'FAC'); 
insert into ente_sede_progetto_facilitatore (id_ente, ID_progetto, ID_SEDE, ID_FACILITATORE, ruolo_utente) values (1000, 251, 1, 'FACILITATORE2', 'VOL'); 

--ASSOCIAZIONE RUOLO - GRUPPI
insert into RUOLO_X_GRUPPO(RUOLO_CODICE, GRUPPO_CODICE) values('DTD', 'programma.write');
insert into RUOLO_X_GRUPPO(RUOLO_CODICE, GRUPPO_CODICE) values('DTD', 'progetto.write');

--ASSOCIAZIONE GRUPPI - PERMESSI
insert into GRUPPO_X_PERMESSO(GRUPPO_CODICE, PERMESSO_ID) values ('programma.write', 1);
insert into GRUPPO_X_PERMESSO(GRUPPO_CODICE, PERMESSO_ID) values ('programma.write', 2);
insert into GRUPPO_X_PERMESSO(GRUPPO_CODICE, PERMESSO_ID) values ('progetto.write', 2);

update programma set Stato = 'NON ATTIVO' where id= 100;
update progetto set stato = 'NON ATTIVO' where id in (251,252, 253);