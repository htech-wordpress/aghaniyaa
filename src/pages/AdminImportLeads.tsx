import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { importLeadsFromCSV } from '@/lib/storage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminImportLeads() {
  const [fileText, setFileText] = useState<string>('');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const navigate = useNavigate();

  const parseCSV = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return { header: [], rows: [] };

    const parseCSVLine = (line: string) => {
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
          if (ch === '"') {
            if (line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            cur += ch;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
          } else if (ch === ',') {
            result.push(cur);
            cur = '';
          } else {
            cur += ch;
          }
        }
      }
      result.push(cur);
      return result;
    };

    const header = parseCSVLine(lines[0]).map(h => h.trim());
    const rows = lines.slice(1).map(parseCSVLine);
    return { header, rows };
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setFileText(text);
      const parsed = parseCSV(text);
      setHeaders(parsed.header);
      setPreviewRows(parsed.rows.slice(0, 10));
    };
    reader.readAsText(f);
  };

  const handleImport = () => {
    if (!fileText) {
      alert('Please select a CSV file first.');
      return;
    }

    const count = importLeadsFromCSV(fileText);
    alert(`${count} leads imported successfully.`);
    navigate('/admin/leads');
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Import Leads (CSV)</h2>

        <div className="space-y-4">
          <div>
            <input type="file" accept=".csv,text/csv" onChange={onFileChange} />
            {fileName && <div className="text-sm text-gray-600 mt-2">Selected: {fileName}</div>}
          </div>

          {headers.length > 0 && (
            <div>
              <div className="mb-2 font-medium">Preview (first {previewRows.length} rows)</div>
              <div className="overflow-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {headers.map(h => (
                        <th key={h} className="px-2 py-1 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r, idx) => (
                      <tr key={idx} className="border-t">
                        {headers.map((_, i) => (
                          <td key={i} className="px-2 py-1">{r[i] ?? ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleImport} variant="default">Import</Button>
            <Button variant="outline" onClick={() => navigate('/admin/leads')}>Cancel</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
