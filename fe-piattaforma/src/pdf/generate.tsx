import { pdf } from '@react-pdf/renderer';
import { GenericPdfDocument } from './GenericPdfDocument';
import type { FieldEntry } from './fieldsConfig';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function generaSchedaSingola(
  record: Record<string, unknown>,
  fields: FieldEntry[],
  title: string,
  logoSrc: string,
  filename: string
) {
  const blob = await pdf(
    <GenericPdfDocument records={[record]} fields={fields} title={title} logoSrc={logoSrc} />
  ).toBlob();
  downloadBlob(blob, filename);
}

export async function generaSchedeMultiple(
  records: Record<string, unknown>[],
  fields: FieldEntry[],
  title: string,
  logoSrc: string,
  filename: string
) {
  const blob = await pdf(
    <GenericPdfDocument records={records} fields={fields} title={title} logoSrc={logoSrc} />
  ).toBlob();
  downloadBlob(blob, filename);
}
