-- In produzione "vw_primo_servizio_cittadino" e' una VISTA; in locale/dockerizzato
-- la ricreiamo come semplice tabella con le stesse colonne (Hibernate ha ddl-auto=none
-- e non tocca lo schema). Lo script gira nel database indicato da MYSQL_DATABASE.

CREATE TABLE IF NOT EXISTS vw_primo_servizio_cittadino (
    id_cittadino                  BIGINT       NOT NULL PRIMARY KEY,
    codice_fiscale                VARCHAR(64),
    genere                        VARCHAR(50),
    fascia                        VARCHAR(50),
    titolo_di_studio              VARCHAR(255),
    occupazione                   VARCHAR(255),
    cittadinanza                  VARCHAR(100),
    id_servizio                   BIGINT,
    regione_provincia             VARCHAR(255),
    nome_gestore                  VARCHAR(255),
    cup                           VARCHAR(50),
    nome_servizio                 VARCHAR(255),
    nome_punto_facilitazione      VARCHAR(255),
    indirizzo_punto_facilitazione VARCHAR(255),
    nome_facilitatore             VARCHAR(255),
    data_servizio                 DATE,
    tipologia_servizio            VARCHAR(255),
    id_questionario               VARCHAR(64),
    policy                        VARCHAR(50)
);

-- codice_fiscale e' memorizzato come SHA-256 (hex minuscolo) del CF in MAIUSCOLO.
-- CF di prova -> hash:
--   RSSMRA80A01H501U -> 82e98709e2f96efd33bed69e81ab7e25e2f363dd804e4014c46f36b9805bff6e
--   VRDLGI75B42F205X -> 33ed15f8a110f144d99651e20a6521108d8973f2cb2a8a8e5c4b71a85a7ec9cc
--   BNCNNA90C50L219K -> 1d79645e6bcf90fcc351706b62e17e3680d00ed121fa5b8182a43eadf38b7bad
INSERT INTO vw_primo_servizio_cittadino
    (id_cittadino, codice_fiscale, genere, fascia, titolo_di_studio, occupazione, cittadinanza,
     id_servizio, regione_provincia, nome_gestore, cup, nome_servizio, nome_punto_facilitazione,
     indirizzo_punto_facilitazione, nome_facilitatore, data_servizio, tipologia_servizio,
     id_questionario, policy)
VALUES
    (1, '82e98709e2f96efd33bed69e81ab7e25e2f363dd804e4014c46f36b9805bff6e',
     'M', '25-34', 'Laurea', 'Occupato', 'Italiana',
     101, 'Campania / Napoli', 'Comune di Napoli', 'CUP001', 'Facilitazione digitale',
     'Punto Facilitazione Centro', 'Via Toledo 1, Napoli', 'Anna Facilitatrice',
     '2025-03-10', 'Assistito', 'Q-1001', 'RFD'),
    (2, '33ed15f8a110f144d99651e20a6521108d8973f2cb2a8a8e5c4b71a85a7ec9cc',
     'F', '35-44', 'Diploma', 'In cerca di occupazione', 'Italiana',
     102, 'Lazio / Roma', 'Comune di Roma', 'CUP002', 'Facilitazione digitale',
     'Punto Facilitazione Eur', 'Viale Europa 10, Roma', 'Marco Facilitatore',
     '2025-04-02', 'Autonomo', 'Q-1002', 'RFD'),
    (3, '1d79645e6bcf90fcc351706b62e17e3680d00ed121fa5b8182a43eadf38b7bad',
     'F', '45-54', 'Licenza media', 'Occupato', 'Italiana',
     103, 'Lombardia / Milano', 'Comune di Milano', 'CUP003', 'Facilitazione digitale',
     'Punto Facilitazione Navigli', 'Corso di Porta Ticinese 5, Milano', 'Anna Facilitatrice',
     '2025-05-20', 'Assistito', 'Q-1003', 'RFD');
