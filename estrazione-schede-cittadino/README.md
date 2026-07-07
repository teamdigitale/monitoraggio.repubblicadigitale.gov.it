# Estrazione schede cittadino

Estrazione ed elaborazione dati delle schede cittadino (ricerca singola e multipla)
con export PDF. Deliverable autonomo composto da due progetti:

```
estrazione-schede-cittadino/
├── backend/            microservizio Spring Boot (Java 8) — estrazione dati MySQL + Mongo
├── frontend/           applicazione React (Vite + TS) — ricerca singola/multipla + PDF
├── db/                     seed dei database (MySQL + MongoDB) usati in locale
├── docker-compose.yml      LOCALE: 4 servizi (frontend, backend, mysql, mongo) + seed
├── docker-compose.prod.yml PRODUZIONE: solo frontend + backend, DB gestiti esterni
├── .env.example            variabili per il compose locale
└── .env.prod.example       variabili per il compose di produzione (Azure)
```

Non richiede `lib-repdgt-shared`: tutto il necessario è stato copiato nel backend.
La gestione di login/ruoli/permessi è volutamente esclusa (non richiesta).

## Architettura

```
Browser ─▶ Frontend (nginx)
             ├─ /            SPA React
             └─ /api/*  ──▶  Backend (Spring Boot)
                               ├─ MySQL: vista vw_primo_servizio_cittadino
                               └─ MongoDB: questionarioTemplateIstanza (competenza digitale)
```

In Docker il frontend (nginx) serve la SPA e fa da **reverse-proxy** verso il
backend su `/api` (single origin, nessun problema di CORS). In sviluppo locale il
frontend chiama direttamente il backend (`VITE_API_BASE_URL`, default
`http://localhost:8081`, dove il backend ha comunque il CORS aperto).

Le due basi dati sono **copie** delle istanze in uso. Il criterio di ricerca
viaggia in chiaro (nessuna cifratura di trasporto).

## Avvio con Docker (consigliato)

Richiede solo Docker + Docker Compose. Costruisce e avvia tutto (frontend, backend,
MySQL e MongoDB già popolati con dati di prova):

```bash
cd estrazione-schede-cittadino
docker compose up --build
```

- Frontend: <http://localhost:8080>
- Backend (API dirette, opzionale): <http://localhost:8081>

I database vengono popolati automaticamente al primo avvio dagli script in `db/`
(vedi *Dati di prova* sotto). Per ripartire da zero: `docker compose down -v`.

Le porte e le credenziali sono personalizzabili via `.env` (vedi `.env.example`).

### Dati di prova

Tre cittadini nella vista MySQL. Il codice fiscale è memorizzato come **SHA-256**
(hex minuscolo) del CF in **maiuscolo**; nella ricerca singola si può usare il CF
in chiaro, l'hash o l'ID numerico.

| ID | Codice fiscale     | Hash SHA-256 (per ricerca multipla)                                | Competenza digitale |
|----|--------------------|--------------------------------------------------------------------|---------------------|
| 1  | `RSSMRA80A01H501U` | `82e98709e2f96efd33bed69e81ab7e25e2f363dd804e4014c46f36b9805bff6e` | sì (da MongoDB)     |
| 2  | `VRDLGI75B42F205X` | `33ed15f8a110f144d99651e20a6521108d8973f2cb2a8a8e5c4b71a85a7ec9cc` | no                  |
| 3  | `BNCNNA90C50L219K` | `1d79645e6bcf90fcc351706b62e17e3680d00ed121fa5b8182a43eadf38b7bad` | no                  |

L'hash di un qualsiasi CF si ricalcola con: `printf "%s" "CFMAIUSCOLO" | sha256sum`.

## Deploy in produzione (Azure, DB gestiti)

In produzione MySQL e MongoDB sono **istanze gestite esterne** (copie di quelle in
uso): non si avviano container DB e non si eseguono i seed (vista e collection
esistono già). Si usa `docker-compose.prod.yml`, che contiene solo frontend + backend:

```bash
cp .env.prod.example .env.prod          # compilare con i valori reali (NON committare)
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```

Da tenere presente:

- **TLS MySQL**: Azure Database for MySQL impone TLS → in `MYSQL_URL` usare
  `sslMode=REQUIRED` (non `useSSL=false`). Username: su *Flexible Server* è semplice
  (`utente`), su *Single Server* è `utente@nomeserver`.
- **MongoDB**: la `MONGODB_URI` è la stringa completa fornita da Azure (con TLS e
  credenziali). Per Cosmos DB API for Mongo (RU) aggiungere `retrywrites=false`.
- **Segreti**: password/URI non vanno nell'immagine né nel repo. Iniettarli a runtime
  (Key Vault, App Settings di App Service, secret di Container Apps). `.env.prod` è in
  `.gitignore`.
- **Rete**: il container deve poter raggiungere i DB (VNet integration / Private
  Endpoint, oppure regole firewall del DB che ammettono l'IP/subnet dell'app).
- **HTTPS**: di norma è terminato dalla piattaforma (ingress Container Apps / App
  Service / Application Gateway); nginx resta su 80 interno. Con il reverse-proxy
  single-origin il CORS non è un problema.
- **Reverse-proxy configurabile**: nginx inoltra `/api` a `BACKEND_URL` (default
  `http://backend:8081`, valido quando FE e BE sono sulla stessa rete compose). Se il
  backend è ospitato come servizio separato, impostare `BACKEND_URL` al suo URL interno.
- **Hosting separato (Container Apps/App Service/AKS)**: costruire e pubblicare le due
  immagini su un registry (es. ACR) e deployarle singolarmente; il `docker-compose.prod.yml`
  resta il riferimento di configurazione (env, porte, routing).

## Backend

Requisiti: JDK 8, Maven.

Configurazione (`backend/src/main/resources/application.properties`, sovrascrivibile
da variabili d'ambiente):

| Variabile        | Default                                            |
|------------------|----------------------------------------------------|
| `SERVER_PORT`    | `8081`                                             |
| `MYSQL_URL`      | `jdbc:mysql://localhost:3306/facilita?...`         |
| `MYSQL_USERNAME` | `root`                                             |
| `MYSQL_PASSWORD` | `root`                                             |
| `MONGODB_URI`    | `mongodb://localhost:27017/facilita`               |

Avvio:

```bash
cd backend
mvn spring-boot:run
```

Endpoint esposti (CORS aperto):

- `POST /cittadino/ricerca` — body `{ "criterioRicerca": "<id | hash64 | CF>" }` → `PrimoServizioCittadinoDTO[]`
- `POST /cittadino/ricerca-multipla` — body `{ "criterioRicercaMultipla": ["<hash64>", ...] }` → `{ trovati[], nonTrovati[] }`

La ricerca singola accetta: ID numerico, hash SHA-256 (64 esadecimali) o codice
fiscale in chiaro (di cui viene ricalcolato l'hash). La ricerca multipla accetta
solo hash a 64 caratteri; gli altri finiscono negli scarti con il numero di riga.

## Frontend

Requisiti: Node 18+ (in questo ambiente il `node` di default è v10: selezionare
una versione recente, es. `nvm use 20`, prima di build/dev).

```bash
cd frontend
cp .env.example .env      # imposta VITE_API_BASE_URL sul backend
npm install
npm run dev               # http://localhost:3000
```

Due schede: **Ricerca singola** (un criterio, tabella risultati, PDF per riga) e
**Ricerca multipla** (fino a 100 codici, PDF cumulativo delle schede trovate +
CSV degli scarti). Il PDF è generato lato client con `@react-pdf/renderer` e
riusa la struttura consolidata (`src/pdf/`).
