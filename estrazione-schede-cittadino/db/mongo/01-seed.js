// Seed della collection questionarioTemplateIstanza (database = MONGO_INITDB_DATABASE).
// Il backend cerca per campo "id" (== id_questionario della vista) e legge la sezione
// di indice 2 ("servizio"): property "24" = tipo servizio, "25" = competenza digitale.
// Il campo "question-answer" e' una STRINGA JSON (formato tollerato dal parser).

db.questionarioTemplateIstanza.insertOne({
    id: 'Q-1001',
    sections: [
        { 'question-answer': JSON.stringify({ id: 'sez-anagrafica', title: 'Anagrafica', properties: [] }) },
        { 'question-answer': JSON.stringify({ id: 'sez-contatti', title: 'Contatti', properties: [] }) },
        {
            'question-answer': JSON.stringify({
                id: 'sez-servizio',
                title: 'Servizio',
                properties: [
                    { '24': ['Servizio di facilitazione'] },
                    { '25': ['Navigare e cercare informazioni sul web', 'Comunicare e collaborare'] }
                ]
            })
        }
    ],
    dataOraCreazione: new Date(),
    dataOraAggiornamento: new Date()
});
