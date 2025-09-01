import { Product } from '../types';
import dayjs from 'dayjs';

export interface CSVExportOptions {
  filename?: string;
  visibleColumns?: string[];
}

export const exportToCSV = (data: Product[], options: CSVExportOptions = {}) => {
  const { filename = 'products', visibleColumns } = options;
  
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Define all possible columns with their headers
  const allColumns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: '產品標題' },
    { key: 'brand', header: '品牌' },
    { key: 'type', header: '類型' },
    { key: 'price', header: '價格' },
    { key: 'specification', header: '規格' },
    { key: 'date', header: '日期' },
    { key: 'remark', header: '備註' },
    { key: 'created_at', header: '創建時間' },
    { key: 'url', header: '網址' }
  ];

  // Filter columns based on visibility (exclude action column)
  const columnsToExport = visibleColumns 
    ? allColumns.filter(col => visibleColumns.includes(col.key))
    : allColumns.filter(col => col.key !== 'action');

  // Create CSV headers
  const headers = columnsToExport.map(col => col.header);
  
  // Create CSV rows
  const rows = data.map(product => {
    return columnsToExport.map(col => {
      let value = product[col.key as keyof Product];
      
      // Format specific fields
      switch (col.key) {
        case 'price':
          value = typeof value === 'number' ? value.toFixed(2) : '0.00';
          break;
        case 'date':
          value = value ? dayjs(value as string).format('YYYY-MM-DD') : '';
          break;
        case 'created_at':
          value = value ? dayjs(value as string).format('YYYY-MM-DD HH:mm:ss') : '';
          break;
        case 'specification':
        case 'remark':
          value = value || '';
          break;
        default:
          value = value || '';
      }
      
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Create and download the file
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const getVisibleColumnKeys = (visibleColumns?: Array<{ key: string; visible: boolean }>) => {
  if (!visibleColumns) return undefined;
  return visibleColumns
    .filter(col => col.visible && col.key !== 'action')
    .map(col => col.key);
};
