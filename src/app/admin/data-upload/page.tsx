'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  DATASET_CONFIG,
  DatasetFieldSpec,
  parseFileContent,
  validateDatasetRows,
  exportErrorsToCsv,
  ValidationSummary,
} from '@/lib/datasetValidator';
import { DatasetType, RowValidationError } from '@/types/student';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Trash2,
  RefreshCw,
  Database,
  Users,
  ShieldAlert,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';

export default function AdminDataUploadPage() {
  const { role, students, uploadHistory, importDatasetRecords } = useApp();

  const [selectedType, setSelectedType] = useState<DatasetType>('ACADEMIC');
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<ValidationSummary | null>(null);
  const [errorSearch, setErrorSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [importResult, setImportResult] = useState<{
    batchId: string;
    importedCount: number;
    timestamp: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConfig = DATASET_CONFIG[selectedType];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    await processFile(selected);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    await processFile(dropped);
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setValidationSummary(null);
    setImportResult(null);
    setIsParsing(true);

    try {
      const { rows } = await parseFileContent(selectedFile, selectedType);
      if (rows.length === 0) {
        throw new Error('The file contains no data rows.');
      }
      const summary = validateDatasetRows(rows, selectedType, students);
      setValidationSummary(summary);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse file.');
    } finally {
      setIsParsing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setValidationSummary(null);
    setParseError(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const executeImport = () => {
    if (!validationSummary || validationSummary.validRows === 0) return;

    const { importedCount, batchId } = importDatasetRecords(
      selectedType,
      validationSummary.validData,
      file?.name || 'uploaded_dataset',
      validationSummary.duplicateRows,
      validationSummary.unmatchedRows
    );

    setImportResult({
      batchId,
      importedCount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    });

    setShowConfirmModal(false);
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([activeConfig.sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sample_${selectedType}_Template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredErrors = validationSummary?.errors.filter(
    (err) =>
      err.studentId.toLowerCase().includes(errorSearch.toLowerCase()) ||
      err.field.toLowerCase().includes(errorSearch.toLowerCase()) ||
      err.errorDescription.toLowerCase().includes(errorSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-300 bg-gradient-to-br from-white/95 via-rose-50/30 to-pink-50/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-[11px] font-bold font-mono tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-rose-600" />
              PHASE 2 DATA INTEGRATION
            </span>
            <span className="text-xs text-slate-500 font-semibold">• Master Key: Student ID / USN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Centralized Student Dataset Ingestion &amp; Validation
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Consolidate institutional records across academic records, attendance trackers, LMS activity,
            coding benchmarks, and faculty ratings with strict schema validation and duplicate checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/students"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition"
          >
            <Users className="w-4 h-4 text-rose-600" />
            <span>Open Student Repository</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Role permission check warning for faculty/students */}
      {role !== 'ADMIN' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="font-bold">Administrator Access Required:</strong> You are currently viewing in Student mode.
            Dataset ingestion and mutation are restricted to Dean/Faculty Affairs Administrators.
          </div>
        </div>
      )}

      {/* Step 1: Dataset Category Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              Select Target Dataset Type
            </h2>
            <p className="text-xs text-slate-500 ml-8">
              Choose the institutional source category to validate columns against official schema.
            </p>
          </div>
          <button
            onClick={downloadSampleTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            Download Sample {selectedType} CSV
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {(Object.keys(DATASET_CONFIG) as DatasetType[]).map((type) => {
            const conf = DATASET_CONFIG[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  resetUpload();
                }}
                className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-500/20'
                    : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {type}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-snug mt-1">
                    {conf.title}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                  {conf.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: File Upload Dropzone */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
            2
          </span>
          Upload CSV or Excel File
        </h2>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition ${
            file
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-rose-400 bg-white hover:bg-rose-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileSelect}
            className="hidden"
            id="dataset-file-input"
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Drag and drop your dataset file here, or{' '}
                  <label
                    htmlFor="dataset-file-input"
                    className="text-rose-600 hover:text-rose-700 underline cursor-pointer font-extrabold"
                  >
                    browse files
                  </label>
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: <strong>.csv</strong> (UTF-8 preferred) and <strong>.xlsx</strong>. Max size: 10 MB.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Required Columns for {selectedType}: {Object.values(activeConfig.fields).filter(f => f.required).map(f => f.name).join(', ')}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {file.name}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Target schema: <span className="font-semibold text-rose-600">{selectedType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetUpload}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-300 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
                <label
                  htmlFor="dataset-file-input"
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace File
                </label>
              </div>
            </div>
          )}
        </div>

        {isParsing && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            Validating rows against canonical headers, range constraints, and student ID repository...
          </div>
        )}

        {parseError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <strong>Parsing Error:</strong> {parseError}
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Preview & Validation Summary */}
      {validationSummary && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                3
              </span>
              Validation Summary &amp; Row Previews
            </h2>
            <p className="text-xs text-slate-500 ml-8">
              Verify row metrics before committing changes to the unified student repository.
            </p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Rows</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{validationSummary.totalRows}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Rows detected in file</div>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-300 shadow-2xs">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Valid Rows</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{validationSummary.validRows}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Ready for import</div>
            </div>

            <div className={`p-4 rounded-xl border shadow-2xs ${
              validationSummary.invalidRows > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Invalid Rows</div>
              <div className="text-2xl font-black text-rose-700 mt-1">{validationSummary.invalidRows}</div>
              <div className="text-[10px] text-rose-700 mt-0.5">Failed schema checks</div>
            </div>

            <div className={`p-4 rounded-xl border shadow-2xs ${
              validationSummary.duplicateRows > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Duplicate IDs</div>
              <div className="text-2xl font-black text-amber-700 mt-1">{validationSummary.duplicateRows}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Conflicting keys</div>
            </div>

            <div className={`p-4 rounded-xl border shadow-2xs ${
              validationSummary.unmatchedRows > 0 ? 'bg-purple-50/70 border-purple-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Unmatched IDs</div>
              <div className="text-2xl font-black text-purple-700 mt-1">{validationSummary.unmatchedRows}</div>
              <div className="text-[10px] text-purple-700 mt-0.5">Not in master repo</div>
            </div>
          </div>

          {/* Action Callout & Confirmation Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                {validationSummary.validRows > 0
                  ? `Ready to integrate ${validationSummary.validRows} record(s) into repository`
                  : 'No valid records available to import'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {validationSummary.invalidRows > 0
                  ? `Only ${validationSummary.validRows} valid rows will be committed. ${validationSummary.invalidRows} invalid rows will be skipped.`
                  : 'All rows passed schema validation and integration constraints.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={validationSummary.validRows === 0}
                onClick={() => setShowConfirmModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>Confirm &amp; Import Dataset</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step 4: Errors table if any */}
          {validationSummary.errors.length > 0 && (
            <div className="glass-panel rounded-2xl border border-rose-300 overflow-hidden bg-white shadow-sm space-y-3 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Row-Level Validation Error Log ({validationSummary.errors.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspect error reasons, supplied values, and suggested fixes before committing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by student ID or field..."
                    value={errorSearch}
                    onChange={(e) => setErrorSearch(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 w-56"
                  />
                  <button
                    onClick={() => exportErrorsToCsv(validationSummary.errors, selectedType)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-600" />
                    Export CSV Report
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-72 border border-rose-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-rose-50/80 text-rose-900 font-bold border-b border-rose-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Row #</th>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Supplied Value</th>
                      <th className="py-2.5 px-3">Error Reason</th>
                      <th className="py-2.5 px-3">Suggested Fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100 text-slate-700">
                    {filteredErrors.map((err, i) => (
                      <tr key={i} className="hover:bg-rose-50/40">
                        <td className="py-2 px-3 font-mono font-bold text-slate-500">{err.rowNumber}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{err.studentId}</td>
                        <td className="py-2 px-3 font-semibold text-rose-700">{err.field}</td>
                        <td className="py-2 px-3 font-mono text-slate-600 bg-slate-50 rounded">
                          {err.suppliedValue || '—'}
                        </td>
                        <td className="py-2 px-3 text-rose-800">{err.errorDescription}</td>
                        <td className="py-2 px-3 text-slate-500 italic">{err.suggestedFix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Staged Data Preview Table */}
          <div className="glass-panel rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-rose-600" />
                  Staged Data Row Preview (First {Math.min(10, validationSummary.parsedData.length)} rows)
                </h3>
                <p className="text-xs text-slate-500">
                  Normalized tabular view with header transformation applied.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Showing {Math.min(10, validationSummary.parsedData.length)} of {validationSummary.totalRows}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    {Object.keys(activeConfig.fields).map((f) => (
                      <th key={f} className="py-2.5 px-3 uppercase tracking-wider text-[10px]">
                        {activeConfig.fields[f].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {validationSummary.parsedData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                      {Object.keys(activeConfig.fields).map((f) => (
                        <td key={f} className="py-2 px-3 font-mono">
                          {row[f] !== undefined && row[f] !== '' ? String(row[f]) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import Result Notification */}
      {importResult && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-emerald-950">
                Dataset Import Completed Successfully!
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Integrated <strong>{importResult.importedCount} student record(s)</strong> under batch ID{' '}
                <span className="font-mono font-bold">{importResult.batchId}</span> at {importResult.timestamp}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/students"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
            >
              View Updated Repository →
            </Link>
          </div>
        </div>
      )}

      {/* Step 5: Upload History Audit Trail */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-600" />
              Upload Batch History &amp; Audit Trail
            </h2>
            <p className="text-xs text-slate-500">
              Traceable logs of past datasets integrated into the platform.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {uploadHistory.length} Batches Logged
          </span>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Dataset Type</th>
                  <th className="py-3 px-4">Source Filename</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Valid</th>
                  <th className="py-3 px-4">Imported</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {uploadHistory.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{batch.batchId}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                        {batch.datasetType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700">{batch.fileName}</td>
                    <td className="py-2.5 px-4 text-slate-500">{batch.uploadedAt}</td>
                    <td className="py-2.5 px-4 font-mono">{batch.totalRows}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-700 font-bold">{batch.validRows}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-700 font-bold">{batch.importedRows}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-300 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Confirm Dataset Import
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to commit these records?
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Dataset Type:</span>
                <strong className="text-slate-900 font-mono">{selectedType}</strong>
              </div>
              <div className="flex justify-between">
                <span>File Name:</span>
                <strong className="text-slate-900">{file?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Valid Rows to Import:</span>
                <strong className="text-emerald-700 font-bold font-mono">{validationSummary?.validRows}</strong>
              </div>
              <div className="flex justify-between">
                <span>Invalid Rows Skipped:</span>
                <strong className="text-rose-700 font-mono">{validationSummary?.invalidRows}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Student profiles matching existing Student IDs will be automatically updated with these new values.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={executeImport}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition"
              >
                Yes, Commit &amp; Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
