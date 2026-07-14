# KT – Estrazione schede cittadino

Autore: Salvatore Gravina
Ultimo aggiornamento: 14/07/2026

Questo documento definisce il contenuto del progetto `estrazione-schede-cittadino`.
Rappresenta l'estrazione dalla piattaforma Facilita dell'omonima funzionalità
per renderlo un applicativo a sé: 
due componenti (un backend e un frontend) che insieme permettono di cercare i cittadini
e di scaricarne le schede in PDF. In particolare il progetto è indipendente dalla piattaforma originale
e tutto ciò che serviva è stato copiato dentro i microservizi.

Login, ruoli e permessi sono stati volutamente lasciati fuori.

## Business logic in breve

Il cuore è la ricerca dei cittadini a partire da un criterio, in due modalità.

**Ricerca singola** – si passa un solo criterio, che può essere:
- l'ID numerico del cittadino;
- l'hash SHA-256 (64 caratteri esadecimali) del codice fiscale;
- il codice fiscale in chiaro (in questo caso il backend ne ricalcola l'hash prima
  di interrogare la base dati).

**Ricerca multipla** – si incolla un elenco (una riga per codice, fino a 100). Qui
si accettano **solo** hash a 64 caratteri: le righe che non rispettano il formato o
che non trovano riscontro finiscono tra gli "scarti", con il numero di riga, così
da poterle recuperare.

Il motivo di questa distinzione è che nella base dati il codice fiscale non è in
chiaro ma salvato come hash SHA-256. Nella ricerca singola accettiamo
anche il CF in chiaro; nella multipla, che è pensata per elaborazioni massive, si
lavora direttamente con gli hash.

I dati anagrafici e del servizio arrivano da **MySQL** (una vista). A questi si
aggiunge la **competenza digitale**, che invece è recuperata su **MongoDB** nel questionario
compilato: il backend la recupera dalla sezione "servizio" del questionario collegato
al cittadino. Se il questionario non c'è, la scheda torna comunque, semplicemente
senza quel campo.

L'output è la scheda cittadino. Dal frontend si può scaricare il PDF: nella ricerca
singola uno per riga, nella multipla un unico PDF cumulativo con tutte le schede
trovate (più il CSV degli scarti). La generazione del PDF è lato client e riusa la
struttura consolidata già in uso sulla piattaforma.

## Struttura del progetto

```
estrazione-schede-cittadino/
├── backend/     microservizio Spring Boot 2.7 (Java 8) – logica di estrazione
├── frontend/    applicazione React (Vite + TypeScript) – ricerca + PDF
├── db/          script di seed per il DB mock locale (solo per i test)
├── docker-compose.yml       avvio LOCALE con DB mock (MySQL + Mongo containerizzati)
├── docker-compose.prod.yml  avvio con DB ESTERNI (nessun DB containerizzato)
├── .env.example / .env.prod.example   modelli di configurazione
└── README.md
```

Lato backend, il package è `it.pa.repdgt.estrazione`. I punti che di solito servono
per orientarsi:
- `restapi/CittadinoRestApi` – i due endpoint REST.
- `service/RicercaCittadinoService` – la logica delle due ricerche.
- `service/QuestionarioCompetenzaService` – il recupero della competenza da Mongo.
- `entity/VPrimoServizioCittadinoEntity` – il mapping sulla vista MySQL.
- `util/EncodeUtils` – l'hash SHA-256 del codice fiscale.

Lato frontend, le due pagine sono in `src/pages` (`RicercaSingola`, `RicercaMultipla`)
e il motore PDF è in `src/pdf`.

### Endpoint esposti

- `POST /cittadino/ricerca` – body `{ "criterioRicerca": "<id | hash | CF>" }`
- `POST /cittadino/ricerca-multipla` – body `{ "criterioRicercaMultipla": ["<hash>", ...] }`

## Le due basi dati esterne

In esercizio i database **non** sono quelli mock del compose locale: sono istanze
esterne (copie di quelle usate dalla piattaforma). Servono due cose:

1. **MySQL** con la vista `vw_primo_servizio_cittadino`, la vista deve già esistere sull'istanza.
2. **MongoDB** con la collection `questionarioTemplateIstanza`, da cui si legge la
   competenza digitale.

Se una delle due non è raggiungibile all'avvio, il backend fallisce la partenza
(la connessione MySQL viene aperta subito): è il comportamento voluto.

## Configurazione

Tutta la configurazione passa da **variabili d'ambiente**, niente valori sensibili
nel codice o nell'immagine. Il backend legge queste variabili (i default valgono solo
per lo sviluppo in locale):

| Variabile        | A cosa serve                                   | Esempio (DB esterno) |
|------------------|------------------------------------------------|----------------------|
| `SERVER_PORT`    | porta HTTP del backend                         | `8081` |
| `MYSQL_URL`      | JDBC URL della vista                            | vedi sotto |
| `MYSQL_USERNAME` | utente MySQL                                    | `utente_ro` |
| `MYSQL_PASSWORD` | password MySQL                                  | `********` |
| `MONGODB_URI`    | connection string Mongo (completa, con credenziali) | vedi sotto |

Il frontend, essendo servito da nginx che fa da reverse-proxy, ha una sola variabile
rilevante a runtime:

| Variabile     | A cosa serve                                         | Default |
|---------------|------------------------------------------------------|---------|
| `BACKEND_URL` | URL interno del backend verso cui nginx inoltra `/api` | `http://backend:8081` |

Il browser chiama sempre `/api/...` sullo stesso host del frontend; è nginx a girare
la chiamata al backend. Così non ci sono problemi di CORS e non serve esporre il
backend pubblicamente. Se backend e frontend girano sulla stessa rete (compose) il
default va bene; se il backend è altrove, si imposta `BACKEND_URL` col suo indirizzo
interno (**senza** slash finale).

### MongoDB – nota sulla connection string

La `MONGODB_URI` è la stringa completa fornita dal provider, credenziali incluse.
Se il Mongo è Cosmos DB (API for MongoDB, RU) ricordarsi di aggiungere
`retrywrites=false`, altrimenti alcune operazioni falliscono. Esempi:

```
# Cosmos DB (RU)
mongodb://<acc>:<key>@<acc>.mongo.cosmos.azure.com:10255/<db>?ssl=true&retrywrites=false&replicaSet=globaldb&appName=@<acc>@

# MongoDB "classico" / Atlas
mongodb+srv://<utente>:<password>@<host>/<db>?tls=true&authSource=admin
```

## Come si avvia

Il modo che consiglio, dato che i DB sono esterni, è il compose di produzione. Non
avvia nessun database: costruisce solo backend e frontend e li punta alle istanze
esterne.

```bash
cp .env.prod.example .env.prod        # compilare con i valori reali dei DB
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```

A quel punto il frontend risponde sulla porta `8080` (configurabile con
`FRONTEND_PORT`). Le connection string dei DB e le credenziali stanno nel `.env.prod`,
che **non** va committato (è già in `.gitignore`).

Se serve provare velocemente senza avere un DB a disposizione, c'è il compose
"normale" (`docker-compose.yml`) che tira su anche MySQL e Mongo mock già popolati
con qualche dato di esempio. È solo per i test in locale, in esercizio si usa la
variante di produzione con i DB veri.

### Senza Docker

Se si vuole far girare il backend direttamente:

```bash
cd backend
MYSQL_URL="jdbc:mysql://..." MYSQL_USERNAME="..." MYSQL_PASSWORD="..." \
MONGODB_URI="mongodb://..." \
mvn spring-boot:run
```

oppure, dal jar già buildato (`mvn clean package -DskipTests`), un normale
`java -jar target/estrazione-schede-cittadino-*.jar` passando le stesse variabili.
Serve **Java 8**. Per il frontend, `npm install` e `npm run build`: il contenuto di
`dist/` è statico e va servito da un web server, ricordando di far arrivare `/api` al
backend (in locale, in alternativa, si imposta `VITE_API_BASE_URL` sull'URL del
backend in fase di build).

## Cose da tenere a mente

- La vista MySQL e la collection Mongo **devono già esistere** sulle istanze esterne:
  il progetto legge e basta, non crea niente.
- Il codice fiscale è cercato tramite hash SHA-256. Se una ricerca per CF in chiaro
  non trova nulla ma sei sicuro del cittadino, quasi sempre il problema è
  l'allineamento del dato hashato sulla vista.
- I secret (password, URI Mongo) vanno iniettati a runtime dall'ambiente
  (Key Vault, variabili del servizio, secret del container), mai messi nel repo.
