
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, fontFamily: 'Helvetica' },
  header: {
    position: 'absolute', top: 36, left: 36, right: 36,
    height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  logo: { width: 100, height: 32, objectFit: 'contain' },
  title: { fontSize: 16 },
  section: { position: 'absolute', top: 120, left: 36, right: 36 },
  row: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  label: { width: 120, color: '#555' },
  value: { flexGrow: 1, borderBottom: '1pt solid #aaa', paddingBottom: 3 },
  footer: { position: 'absolute', bottom: 36, left: 36, right: 36, fontSize: 9, color: '#777', textAlign: 'right' },
});

export type Utente = {
  id: string;
  nome: string;
  cognome: string;
  dataNascita?: string;
  codiceFiscale?: string;
  email?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  provincia?: string;
  note?: string;
};

export function SchedaUtentePage(props: {
  u: Utente;
  logoSrc: string;
  pageIndex: number;
  pagesTotal: number;
}) {
  const { u, logoSrc, pageIndex, pagesTotal } = props;

  return (
    <Page size="A4" style={styles.page}>
      {/* Header fisso */}
      <View style={styles.header}>
        <Image src={logoSrc} style={styles.logo} />
        <Text style={styles.title}>Scheda Utente</Text>
      </View>

      {/* Sezione campi a posizionamento costante */}
      <View style={styles.section}>
        <View style={styles.row}><Text style={styles.label}>Nome</Text><Text style={styles.value}>{u.nome}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Cognome</Text><Text style={styles.value}>{u.cognome}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Data di nascita</Text><Text style={styles.value}>{u.dataNascita || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Codice Fiscale</Text><Text style={styles.value}>{u.codiceFiscale || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{u.email || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Telefono</Text><Text style={styles.value}>{u.telefono || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Indirizzo</Text><Text style={styles.value}>{u.indirizzo || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Città</Text><Text style={styles.value}>{u.citta || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>CAP</Text><Text style={styles.value}>{u.cap || '-'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Provincia</Text><Text style={styles.value}>{u.provincia || '-'}</Text></View>
        <View style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.value}>{u.note || '-'}</Text>
        </View>
      </View>

      {/* Footer con numerazione pagina */}
      <Text style={styles.footer}>{pageIndex + 1} / {pagesTotal}</Text>
    </Page>
  );
}
