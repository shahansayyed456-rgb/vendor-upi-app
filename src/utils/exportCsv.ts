import type { Vendor } from '../types';

export function exportVendorsToCSV(vendors: Vendor[]): void {
  if (!vendors || vendors.length === 0) {
    alert('No vendor records available to export.');
    return;
  }

  const headers = [
    'ID',
    'Vendor Name',
    'Business Type',
    'UPI VPA',
    'Fixed Amount (INR)',
    'Prior Payment Method',
    'QR Generated',
    'Printed Cards Count',
    'Feedback Rating',
    'Feedback Notes',
    'Date Added',
    'Is Demo Data',
  ];

  const rows = vendors.map((v) => {
    const ratingStr = v.feedback?.rating ? v.feedback.rating.replace('_', ' ') : 'N/A';
    const notesStr = v.feedback?.notes ? `"${v.feedback.notes.replace(/"/g, '""')}"` : 'N/A';
    const amountStr = v.amount ? v.amount.toString() : 'Dynamic';

    return [
      v.id,
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.businessType}"`,
      v.vpa,
      amountStr,
      v.priorPaymentMethod,
      v.qrGenerated ? 'Yes' : 'No',
      v.printedCardCount || 0,
      ratingStr,
      notesStr,
      new Date(v.createdAt).toLocaleDateString() + ' ' + new Date(v.createdAt).toLocaleTimeString(),
      v.isDemo ? 'Yes' : 'No',
    ];
  });

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `VendorUPI_CEP_Fieldwork_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
