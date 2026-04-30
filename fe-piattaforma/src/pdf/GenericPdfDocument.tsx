import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { FieldEntry } from './fieldsConfig';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'Helvetica' },
  // A4 portrait = 595pt; con padding 36pt per lato la larghezza utile e' 523pt.
  // Altezza calcolata sull'aspect ratio nativo dell'immagine 1190x119 (~10:1) -> 52pt.
  headerImage: {
    width: 523,
    height: 52,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginTop: 36,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 24,
  },
  row: { flexDirection: 'row', marginBottom: 6 },
  fieldHalf: { width: '50%', paddingRight: 8 },
  fieldFull: { width: '100%' },
  label: { fontSize: 8, color: '#555', marginBottom: 2 },
  value: {
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    borderBottomStyle: 'solid',
    paddingBottom: 3,
    minHeight: 16,
  },
  valueSmall: {
    fontSize: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 9,
    color: '#555',
  },
});

const FOOTER_TEXT =
  'I dati contenuti in questa scheda di dettaglio sono stati estratti in maniera automatica dalla piattaforma Facilita';

interface GenericPdfDocumentProps {
  records: Record<string, unknown>[];
  fields: FieldEntry[];
  title: string;
  logoSrc: string;
}

export const GenericPdfDocument: React.FC<GenericPdfDocumentProps> = ({
  records,
  fields,
  title,
  logoSrc,
}) => (
  <Document>
    {records.map((record, pageIdx) => {
      const elements: React.ReactNode[] = [];
      let pairBuffer: FieldEntry[] = [];

      const flushPair = () => {
        if (pairBuffer.length === 0) return;
        const items = [...pairBuffer];
        pairBuffer = [];
        elements.push(
          <View style={styles.row} key={`row-${elements.length}`}>
            {items.map((f) =>
              f.type === 'field' ? (
                <View style={f.half ? styles.fieldHalf : styles.fieldFull} key={f.key}>
                  <Text style={styles.label}>{f.label}</Text>
                  <Text style={[styles.value, f.small ? styles.valueSmall : {}]}>
                    {String(record[f.key] ?? '-')}
                  </Text>
                </View>
              ) : null
            )}
          </View>
        );
      };

      fields.forEach((entry, i) => {
        if (entry.type === 'section') {
          flushPair();
          elements.push(
            <Text style={styles.sectionTitle} key={`section-${i}`}>
              {entry.title}
            </Text>
          );
          return;
        }

        if (entry.half) {
          pairBuffer.push(entry);
          if (pairBuffer.length === 2) {
            flushPair();
          }
        } else {
          flushPair();
          pairBuffer.push(entry);
          flushPair();
        }
      });

      flushPair();

      return (
        <Page size='A4' style={styles.page} key={`page-${pageIdx}`}>
          <Image src={logoSrc} style={styles.headerImage} />
          <Text style={styles.pageTitle}>{title}</Text>
          {elements}
          <Text style={styles.footer} fixed>
            {FOOTER_TEXT}
          </Text>
        </Page>
      );
    })}
  </Document>
);
