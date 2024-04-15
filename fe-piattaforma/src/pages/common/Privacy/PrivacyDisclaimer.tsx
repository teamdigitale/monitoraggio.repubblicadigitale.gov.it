import React from 'react';
import PageTitle from '../../../components/PageTitle/pageTitle';
import './PrivacyDisclaimer.scss';

export const PrivacyDisclaimer = () => {
    return (
        <div className='container'>
            <div className='d-flx flex-column align-items-start'>
                <PageTitle title='Informativa privacy e cookie'/>
                <a href={'#referenti'}>Informativa Referenti/Delegati</a>
                <span style={{margin: '0 15px'}}>|</span>
                <a href={'#facilitatori'}>Informativa Facilitatori</a>
                <section id={'referenti'}>
                    <h4 className='mt-4 mb-3 primary-color-a9'>
                        Informativa sul trattamento dei dati personali dei Referenti e dei
                        Delegati dei Soggetti attuatori/Sub-attuatori nell’ambito della
                        Missione 1 - Componente 1 - Asse 1 - Misura 1.7.2
                        “Rete di servizi di facilitazione digitale” del Piano Nazionale di Ripresa e Resilienza
                    </h4>
                    <p>
                        La presente informativa descrive le modalità di trattamento dei dati
                        personali dei Referenti e dei Delegati dei Soggetti
                        attuatori/Sub-attuatori (gli <strong>“Interessati”</strong>)
                        all’interno della piattaforma di monitoraggio “Facilita” messa a
                        disposizione dal Dipartimento per la trasformazione digitale della
                        Presidenza del Consiglio dei ministri (la{' '}
                        <strong>“Piattaforma”</strong>) per lo svolgimento degli
                        interventi di facilitazione digitale condotti nell’ambito della
                        Missione 1 - Componente 1 - Asse 1 - Misura 1.7.2 “Rete di servizi di facilitazione digitale”
                        del Piano Nazionale di Ripresa e Resilienza.
                    </p>

                    <p>
                        L’informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE)
                        2016/679 (il <strong>“Regolamento”</strong>).
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Titolare del trattamento e Responsabile per la protezione dei dati
                    </h5>
                    <p>
                        Il Titolare del trattamento è la Presidenza del Consiglio dei ministri
                        - Dipartimento per la trasformazione digitale, con sede in Largo
                        Pietro di Brazzà 86, 00187 Roma (il <strong>“Dipartimento”</strong>),
                        contattabile ai seguenti recapiti:
                    </p>
                    <ul className='mt-2 mb-2 ml-5'>
                        <li>
                            <strong>E-mail: </strong>
                            <a href='mailto:segreteria.trasformazionedigitale@governo.it'>
                                segreteria.trasformazionedigitale@governo.it
                            </a>
                        </li>
                        <li>
                            <strong>PEC: </strong>
                            <a href='mailto:diptrasformazionedigitale@pec.governo.it'>
                                diptrasformazionedigitale@pec.governo.it
                            </a>
                        </li>
                    </ul>

                    <p>
                        Il Responsabile per la protezione dei dati - Data Protection Officer è
                        contattabile ai seguenti recapiti:
                    </p>
                    <ul className='mt-2 mb-2 ml-5'>
                        <li>
                            <strong>E-mail: </strong>
                            <a href='mailto:responsabileprotezionedatipcm@governo.it'>
                                responsabileprotezionedatipcm@governo.it
                            </a>
                        </li>
                        <li>
                            <strong>PEC:</strong>{' '}
                            <a href='mailto:rpd@pec.governo.it'>rpd@pec.governo.it</a>
                        </li>
                    </ul>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Quali dati trattiamo e per quanto tempo
                    </h5>
                    <p>
                        Il Dipartimento tratterà dati di natura comune, anagrafici e di contatto, quali nome,
                        cognome, codice fiscale, indirizzo e-mail e numero di telefono (facoltativo)
                        degli Interessati, associati alle attività svolte, come di seguito precisato.
                        I dati anagrafici e di contatto potranno essere verificati e rettificati
                        dall’Interessato al primo accesso in Piattaforma.
                    </p>
                    <br/>
                    <p>
                        Il mancato conferimento dei dati personali richiesti non
                        consente agli Interessati di svolgere le attività di gestione dei propri programmi/progetti.
                    </p>
                    <br/>
                    <p>
                        I dati sopra indicati saranno trattati e conservati
                        per il periodo necessario allo svolgimento delle attività di facilitazione e
                        monitoraggio e, comunque, fino al termine delle verifiche UE della misura –
                        scadenza per raggiungimento target giugno 2026.
                    </p>
                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Dati relativi all’accesso in Piattaforma
                    </h5>
                    <p>
                        Per accedere a Facilita sarà necessario autenticarsi mediante SPID o CIE.
                        L’ID univoco di sessione del sistema di autenticazione scelto associato
                        all’utente verrà registrato insieme ai dati relativi alle operazioni
                        effettuate (es. data accesso/uscita, operazione richiesta, etc.).
                        Tali dati saranno trattati per un anno dalla loro raccolta, fatte
                        salve esigenze di conservazione ulteriore in caso di eventuali contenziosi.
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Perchè vengono trattati i dati e a chi sono comunicati
                    </h5>
                    <p>
                        I dati degli Interessati sono trattati dal Dipartimento esclusivamente
                        per finalità <strong>connesse e strumentali</strong> allo svolgimento
                        delle attività di facilitazione poste in essere dai Soggetti attuatori/Sub-attuatori
                        nell’ambito dell’attuazione della Missione 1 - Componente 1 - Asse 1 -
                        Misura 1.7.2 “Rete di servizi di facilitazione digitale” del Piano Nazionale
                        di Ripresa e Resilienza, anche con l’uso di procedure informatizzate,
                        nei modi e limiti necessari per perseguire tali finalità.
                    </p>
                    <br/>
                    <p>
                        In particolare, il Dipartimento tratta i dati degli Interessati al fine di
                        consentire ai Soggetti attuatori/Sub-attuatori lo svolgimento degli interventi
                        di facilitazione digitale, nonché al fine di monitoraggio e verifica della Misura
                        1.7.2 e del collegato target M1C1-28, nell’esecuzione dei propri compiti di interesse
                        pubblico o comunque connessi all’esercizio dei propri pubblici poteri
                        (art. 6, par. 1, lett. e del Regolamento), con riferimento al Regolamento (UE)
                        2021/241 del Parlamento europeo e del Consiglio del 12 febbraio 2021 che
                        istituisce il dispositivo per la ripresa e la resilienza, nonché per obbligo di
                        legge (art. 6, par. 1, lett. c del Regolamento) ai sensi dell’art. 5 DL 13/2023
                        (Disposizioni in materia di controllo e monitoraggio dell’attuazione degli
                        interventi realizzati con risorse nazionali ed europee) e relativo decreto attuativo
                        (in corso di emanazione).
                    </p>
                    <br/>
                    <p>
                        Sono destinatari dei dati i seguenti soggetti designati dal Dipartimento, ai sensi
                        dell’articolo 28 del Regolamento, quali responsabili del trattamento: Enterprise
                        Services Italia S.r.l., DS Tech S.r.l. e Amazon Web Service EMEA SARL, fornitori
                        dei servizi di sviluppo, erogazione e gestione operativa della Piattaforma.
                    </p>
                    <br/>
                    <p>
                        I dati personali raccolti sono altresì trattati dal personale del
                        Dipartimento, che agisce sulla base di specifiche istruzioni fornite
                        in ordine a finalità e modalità del trattamento medesimo.
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Quali sono i diritti dell’Interessato
                    </h5>
                    <p>L’Interessato potrà esercitare i seguenti diritti:</p>
                    <div className="table-responsive mt-2 mb-2">
                        <table className='table'>
                            <tr>
                                <td className='td'><strong>Diritto di accedere ai dati</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Si ha diritto ad
                                    ottenere conferma e informazioni sul trattamento.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di rettifica</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Si ha diritto a
                                    rettificare dati inesatti o integrarli. I dati
                                    anagrafici e di contatto potranno essere
                                    verificati e rettificati dall’interessato al primo accesso in
                                    Piattaforma.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di cancellazione</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Nei casi di legge,
                                    si ha diritto a chiedere l’oblio. Si fa presente che la cancellazione dei dati
                                    potrà avvenire solo a seguito della conclusione dell’attività di facilitazione,
                                    monitoraggio e verifica, nel rispetto di quanto disciplinato nel paragrafo
                                    denominato “Quali dati trattiamo e per quanto tempo” che precede.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di limitazione al trattamento</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'> Nei casi di legge, si ha diritto a chiedere di limitare il
                                    trattamento.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto alla portabilità dei dati</strong></td>
                                <td className='td'>❌</td>
                                <td className='td'>Non si ha diritto
                                    alla portabilità dei dati quando il trattamento è necessario
                                    per eseguire un compito di interesse pubblico o nell’esercizio
                                    di funzioni pubbliche o adempiere a obblighi legali.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di opporsi al trattamento</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Per
                                    particolari motivi, si ha diritto di opporsi al trattamento per
                                    l’esecuzione di un compito di interesse pubblico o connesso
                                    all’esercizio di pubblici poteri.
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p>
                        Tali diritti potranno essere esercitati contattando il Dipartimento ai
                        recapiti suindicati.
                    </p>
                    <p>
                        Per ulteriori informazioni sulle funzionalità della Piattaforma è
                        possibile rivolgersi al Dipartimento scrivendo a{' '}
                        <a href='mailto:supporto-facilita@repubblicadigitale.gov.it'>
                            supporto-facilita@repubblicadigitale.gov.it
                        </a>
                        .
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>Diritto di reclamo</h5>
                    <p>
                        Per i trattamenti di cui alla presente informativa, gli Interessati
                        che ritengono che il trattamento che li riguardi avvenga in violazione
                        di quanto previsto dal Regolamento, hanno il diritto di presentare un
                        reclamo al Garante per la protezione dei dati personali, Piazza
                        Venezia 11, 00187 ROMA (
                        <a href='https://www.garanteprivacy.it'>www.garanteprivacy.it</a>), ai
                        sensi dell’art. 77 del Regolamento.
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>Cookie Policy</h5>
                    <p>
                        Questa sezione fornisce informazioni dettagliate sull’uso dei cookie,
                        su come sono utilizzati dalla Piattaforma e su come gestirli, in
                        attuazione dell’art. 122 del decreto legislativo 30 giugno 2003, n.
                        196, nonché nel rispetto delle{' '}
                        <a
                            href='https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876'
                            target='_blank'
                            rel='noreferrer'
                        >
                            ”Linee guida cookie e altri strumenti di tracciamento”
                        </a>{' '}
                        emanate dal Garante per la protezione dei dati personali con
                        provvedimento del 10 giugno 2021.
                    </p>
                    <p>
                        La Piattaforma utilizza esclusivamente cookie tecnici necessari per il
                        suo funzionamento e per migliorare l’esperienza d’uso dei propri
                        visitatori.
                    </p>

                    <h6 className='mt-4 mb-3 primary-color-a9'>
                        Come disabilitare i cookie (opt-out) sul proprio dispositivo
                    </h6>
                    <p>
                        La maggior parte dei browser accetta i cookie automaticamente, ma è
                        possibile rifiutarli. Se non si desidera ricevere o memorizzare i
                        cookie, si possono modificare le impostazioni di sicurezza del browser
                        utilizzato, secondo le istruzioni rese disponibili dai relativi
                        fornitori ai link di seguito indicati. Nel caso in cui si disabilitino
                        tutti i cookie, la Piattaforma potrebbe non funzionare correttamente.
                    </p>
                    <ul className='mt-2 mb-5 ml-2'>
                        <li>
                            <a
                                href='https://support.google.com/chrome/answer/95647'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Chrome
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Firefox
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.apple.com/it-it/guide/safari/sfri11471/mac'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Safari
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Edge
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://help.opera.com/en/latest/web-preferences/#cookies'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Opera
                            </a>
                        </li>
                    </ul>
                </section>
                <section id={'facilitatori'}>
                    <h4 className='mt-4 mb-3 primary-color-a9'>
                        Informativa sul trattamento dei dati personali dei Facilitatori
                        digitali nell’ambito della Missione 1 - Componente 1 - Asse 1 -
                        Misura 1.7.2 “Rete di servizi di facilitazione digitale” del Piano
                        Nazionale di Ripresa e Resilienza

                    </h4>
                    <p>
                        La presente informativa descrive le modalità di trattamento dei dati
                        personali dei Facilitatori digitali (di seguito, anche i {' '}
                        <strong>“Facilitatori”</strong>) all’interno della piattaforma di monitoraggio “Facilita” messa
                        a
                        disposizione dal Dipartimento per la trasformazione digitale della
                        Presidenza del Consiglio dei ministri (la{' '}
                        <strong>“Piattaforma”</strong>), per lo svolgimento degli interventi
                        di facilitazione digitale condotti nell’ambito della Missione 1 -
                        Componente 1 - Asse 1 - Misura 1.7.2 “Rete di servizi di facilitazione
                        digitale” del Piano Nazionale di Ripresa e Resilienza.
                    </p>

                    <p>
                        L’informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE)
                        2016/679 (il <strong>“Regolamento”</strong>).
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Titolare del trattamento e Responsabile per la protezione dei dati
                    </h5>
                    <p>
                        Il Titolare del trattamento è la Presidenza del Consiglio dei ministri
                        - Dipartimento per la trasformazione digitale, con sede in Largo
                        Pietro di Brazzà 86, 00187 Roma (il <strong>“Dipartimento”</strong>),
                        contattabile ai seguenti recapiti:
                    </p>
                    <ul className='mt-2 mb-2 ml-5'>
                        <li>
                            <strong>E-mail: </strong>
                            <a href='mailto:segreteria.trasformazionedigitale@governo.it'>
                                segreteria.trasformazionedigitale@governo.it
                            </a>
                        </li>
                        <li>
                            <strong>PEC: </strong>
                            <a href='mailto:diptrasformazionedigitale@pec.governo.it'>
                                diptrasformazionedigitale@pec.governo.it
                            </a>
                        </li>
                    </ul>

                    <p>
                        Il Responsabile per la protezione dei dati - Data Protection Officer è
                        contattabile ai seguenti recapiti:
                    </p>
                    <ul className='mt-2 mb-2 ml-5'>
                        <li>
                            <strong>E-mail: </strong>
                            <a href='mailto:responsabileprotezionedatipcm@governo.it'>
                                responsabileprotezionedatipcm@governo.it
                            </a>
                        </li>
                        <li>
                            <strong>PEC:</strong>{' '}
                            <a href='mailto:rpd@pec.governo.it'>rpd@pec.governo.it</a>
                        </li>
                    </ul>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Quali dati trattiamo e per quanto tempo
                    </h5>
                    <p>
                        Il Dipartimento tratterà dati di natura comune, anagrafici e di
                        contatto, quali nome, cognome, codice fiscale, indirizzo e-mail e
                        numero di telefono (facoltativo) dei Facilitatori, associati alle attività svolte come di
                        seguito precisato.
                        I dati anagrafici e di contatto potranno essere verificati e rettificati dall’interessato al
                        primo accesso in Piattaforma.
                    </p>
                    <br/>
                    <p>
                        Il mancato conferimento dei dati personali richiesti non consente ai Facilitatori di svolgere
                        gli interventi di facilitazione.
                    </p>
                    <br/>
                    <p>
                        I dati sopra indicati saranno trattati e conservati per il periodo necessario allo svolgimento
                        delle attività
                        di facilitazione e monitoraggio e, comunque, fino al termine delle verifiche UE della misura –
                        scadenza
                        per raggiungimento target giugno 2026.

                    </p>
                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Dati relativi all’ accesso in Piattaforma
                    </h5>
                    <p>
                        Per accedere a Facilita sarà necessario autenticarsi mediante SPID o CIE.
                        L’ID univoco di sessione del sistema di autenticazione scelto associato all’utente verrà
                        registrato
                        insieme ai dati relativi alle operazioni effettuate (es. data accesso/uscita, operazione
                        richiesta, etc.).
                        Tali dati saranno trattati per un anno dalla loro raccolta,
                        fatte salve esigenze di conservazione ulteriore in caso di eventuali contenziosi
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Perchè vengono trattati i dati e a chi sono comunicati
                    </h5>
                    <p>
                        I dati dei Facilitatori sono trattati dal Dipartimento esclusivamente
                        per finalità <strong>connesse e strumentali</strong> allo svolgimento
                        delle attività di facilitazione nell’ambito dell’attuazione della Missione 1 - Componente 1 -
                        Asse 1 - Misura 1.7.2 “Rete di
                        servizi di facilitazione digitale” del Piano Nazionale di Ripresa e Resilienza, anche
                        con l’uso di procedure informatizzate, nei modi e limiti necessari per perseguire tali finalità.

                    </p>
                    <br/>
                    <p>
                        In particolare, il Dipartimento tratta i dati dei Facilitatori al fine di:
                        (i) consentire ai Facilitatori la registrazione in Piattaforma degli interventi di facilitazione
                        digitale;
                        (ii) consentire ai Facilitatori l’utilizzo di un ambiente all’interno del quale gli stessi
                        possano interagire e condividere
                        le proprie conoscenze (l’ambiente di <strong>“Knowledge Management”</strong>);
                        (iii) effettuare il monitoraggio e la verifica della Misura 1.7.2 e del collegato target
                        M1C1-28, nell’esecuzione
                        dei propri compiti di interesse pubblico o comunque connessi all’esercizio
                        dei propri pubblici poteri (art. 6, par. 1, lett. e del Regolamento), con riferimento
                        al Regolamento (UE) 2021/241 del Parlamento europeo e del Consiglio del 12 febbraio 2021 che
                        istituisce il dispositivo per la ripresa e la resilienza,
                        nonché per obbligo di legge (art. 6, par. 1, lett. c del Regolamento) ai sensi
                        dell’art. 5 DL 13/2023 (Disposizioni in materia di controllo e monitoraggio
                        dell’attuazione degli interventi realizzati con risorse nazionali ed europee) e relativo decreto
                        attuativo (in corso di emanazione).
                    </p>
                    <br/>
                    <p>
                        Sono destinatari dei dati i seguenti soggetti designati dal
                        Dipartimento, ai sensi dell’articolo 28 del Regolamento, quali
                        responsabili del trattamento: Enterprise Services Italia S.r.l., DS Tech S.r.l. e Amazon Web
                        Service EMEA SARL,
                        fornitori dei servizi di sviluppo, erogazione e gestione operativa della Piattaforma.
                    </p>
                    <br/>
                    <p>
                        I dati personali raccolti sono altresì trattati dal personale del
                        Dipartimento, che agisce sulla base di specifiche istruzioni fornite
                        in ordine a finalità e modalità del trattamento medesimo.
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>
                        Quali sono i diritti dell’Interessato
                    </h5>
                    <p>L’Interessato potrà esercitare i seguenti diritti</p>
                    <div className="table-responsive mt-2 mb-2">
                        <table className='table'>
                            <tr>
                                <td className='td'><strong>Diritto di accedere ai dati</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Si ha diritto ad
                                    ottenere conferma e informazioni sul trattamento.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di rettifica</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Si ha diritto a
                                    rettificare dati inesatti o integrarli. I dati
                                    anagrafici e di contatto potranno essere
                                    verificati e rettificati dall’interessato al primo accesso in
                                    Piattaforma.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di cancellazione</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Nei casi di legge,
                                    si ha diritto a chiedere l’oblio. Si fa presente che la cancellazione dei dati
                                    potrà avvenire solo a seguito della conclusione dell’attività di facilitazione,
                                    monitoraggio e verifica, nel rispetto di quanto disciplinato nel paragrafo
                                    denominato “Quali dati trattiamo e per quanto tempo” che precede.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di limitazione al trattamento</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'> Nei casi di legge, si ha diritto a chiedere di limitare il
                                    trattamento.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto alla portabilità dei dati</strong></td>
                                <td className='td'>❌</td>
                                <td className='td'>Non si ha diritto
                                    alla portabilità dei dati quando il trattamento è necessario
                                    per eseguire un compito di interesse pubblico o nell’esercizio
                                    di funzioni pubbliche o adempiere a obblighi legali.
                                </td>
                            </tr>
                            <tr>
                                <td className='td'><strong>Diritto di opporsi al trattamento</strong></td>
                                <td className='td'>✔️</td>
                                <td className='td'>Per
                                    particolari motivi, si ha diritto di opporsi al trattamento per
                                    l’esecuzione di un compito di interesse pubblico o connesso
                                    all’esercizio di pubblici poteri.
                                </td>
                            </tr>
                        </table>
                    </div>
                    <p>
                        Tali diritti potranno essere esercitati contattando il Dipartimento ai
                        recapiti suindicati.
                    </p>
                    <p>
                        Per ulteriori informazioni sulle funzionalità della Piattaforma è
                        possibile rivolgersi al Dipartimento scrivendo a{' '}
                        <a href='mailto:supporto-facilita@repubblicadigitale.gov.it'>
                            supporto-facilita@repubblicadigitale.gov.it
                        </a>
                        .
                    </p>

                    <h4 className='mt-4 mb-3 primary-color-a9'>Diritto di reclamo</h4>
                    <p>
                        Per i trattamenti di cui alla presente informativa, gli interessati
                        che ritengono che il trattamento che li riguardi avvenga in violazione
                        di quanto previsto dal Regolamento, hanno il diritto di presentare un
                        reclamo al Garante per la protezione dei dati personali, Piazza
                        Venezia 11, 00187 ROMA (
                        <a href='https://www.garanteprivacy.it'>www.garanteprivacy.it</a>), ai
                        sensi dell’art. 77 del Regolamento.
                    </p>

                    <h5 className='mt-4 mb-3 primary-color-a9'>Cookie Policy</h5>
                    <p>
                        Questa sezione fornisce informazioni dettagliate sull’uso dei cookie,
                        su come sono utilizzati dalla Piattaforma e su come gestirli, in
                        attuazione dell’art. 122 del decreto legislativo 30 giugno 2003, n.
                        196, nonché nel rispetto delle{' '}
                        <a
                            href='https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876'
                            target='_blank'
                            rel='noreferrer'
                        >
                            ”Linee guida cookie e altri strumenti di tracciamento”
                        </a>{' '}
                        emanate dal Garante per la protezione dei dati personali con
                        provvedimento del 10 giugno 2021.
                    </p>
                    <p>
                        La Piattaforma utilizza esclusivamente cookie tecnici necessari per il
                        suo funzionamento e per migliorare l’esperienza d’uso dei propri
                        visitatori.
                    </p>

                    <h6 className='mt-4 mb-3 primary-color-a9'>
                        Come disabilitare i cookie (opt-out) sul proprio dispositivo
                    </h6>
                    <p>
                        La maggior parte dei browser accetta i cookie automaticamente, ma è
                        possibile rifiutarli. Se non si desidera ricevere o memorizzare i
                        cookie, si possono modificare le impostazioni di sicurezza del browser
                        utilizzato, secondo le istruzioni rese disponibili dai relativi
                        fornitori ai link di seguito indicati. Nel caso in cui si disabilitino
                        tutti i cookie, la Piattaforma potrebbe non funzionare correttamente.
                    </p>
                    <ul className='mt-2 mb-5 ml-2'>
                        <li>
                            <a
                                href='https://support.google.com/chrome/answer/95647'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Chrome
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Firefox
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.apple.com/it-it/guide/safari/sfri11471/mac'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Safari
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Edge
                            </a>
                        </li>
                        <li>
                            <a
                                href='https://help.opera.com/en/latest/web-preferences/#cookies'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Opera
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};
