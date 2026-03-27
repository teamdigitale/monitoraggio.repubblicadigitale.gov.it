import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { FieldEntry } from './fieldsConfig';

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'Helvetica' },
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: { width: 90, height: 28, objectFit: 'contain' },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
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
    bottom: 28,
    left: 36,
    right: 36,
    fontSize: 8,
    color: '#777',
    textAlign: 'right',
  },
});

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
          <View style={styles.header}>
            <Image src={logoSrc} style={styles.logo} />
            <Text style={styles.title}>{title}</Text>
          </View>
          {elements}
          <Text style={styles.footer}>
            {pageIdx + 1} / {records.length}
          </Text>
        </Page>
      );
    })}
  </Document>
);
