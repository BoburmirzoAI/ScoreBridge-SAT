/**
 * Tiny client-side PDF generator — enough to produce a real, openable one-page
 * PDF for the lesson materials (no library). Builds valid objects + xref.
 */

const esc = (s: string) =>
  s
    .replace(/[^\x20-\x7E]/g, '-') // keep it ASCII for correct byte offsets
    .replace(/([\\()])/g, '\\$1');

export function makeLessonPdf(title: string, subtitle: string): Blob {
  const content =
    `BT /F1 24 Tf 72 720 Td (${esc(title)}) Tj ET\n` +
    `BT /F1 14 Tf 72 690 Td (${esc(subtitle)}) Tj ET\n` +
    `BT /F1 12 Tf 72 654 Td (Scorebridge - Build your way to college) Tj ET`;

  const objs = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>',
    `<</Length ${content.length}>>\nstream\n${content}\nendstream`,
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => {
    pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
