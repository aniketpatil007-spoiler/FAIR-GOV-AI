import React, { useEffect, useState } from 'react';
import {
  FileCheck, Upload, AlertTriangle, CheckCircle2, XCircle,
  Clock, ShieldAlert, Hash, FileText, ChevronRight, X, Info
} from 'lucide-react';
import { fetchDocuments, verifyDocument, fetchEmployees } from '../../api/client';
import { DocumentRecord, Employee, UserPersona } from '../../types';

interface DemoDocumentsProps {
  currentPersona: UserPersona;
}

export const DemoDocuments: React.FC<DemoDocumentsProps> = ({ currentPersona }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Verification Action Form State
  const [verifyAction, setVerifyAction] = useState<'VERIFY' | 'DISPUTE' | 'REJECT'>('VERIFY');
  const [verifyReason, setVerifyReason] = useState('');
  const [submittingVerify, setSubmittingVerify] = useState(false);

  // Upload Form State
  const [uploadData, setUploadData] = useState({
    employee_id: 1,
    doc_type: 'SERVICE_BOOK',
    document_name: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadDocs();
    loadEmps();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmps = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      if (data.length > 0) {
        setUploadData(prev => ({ ...prev, employee_id: data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenVerify = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setVerifyAction('VERIFY');
    setVerifyReason(
      doc.verification_status === 'VERIFIED'
        ? (doc.verifier_notes || 'Service records cross-verified against physical register volume.')
        : ''
    );
    setShowVerifyModal(true);
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !verifyReason.trim()) return;

    setSubmittingVerify(true);
    try {
      await verifyDocument(
        selectedDoc.id,
        verifyAction,
        currentPersona.name,
        currentPersona.role,
        verifyReason
      );
      setShowVerifyModal(false);
      loadDocs();
    } catch (err: any) {
      alert(err.message || 'Error updating document verification status');
    } finally {
      setSubmittingVerify(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('employee_id', uploadData.employee_id.toString());
    formData.append('doc_type', uploadData.doc_type);
    formData.append('document_name', uploadData.document_name || selectedFile.name);
    formData.append('file', selectedFile);
    formData.append('actor_name', currentPersona.name);
    formData.append('actor_role', currentPersona.role);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }
      setShowUploadModal(false);
      setSelectedFile(null);
      loadDocs();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            VERIFIED
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            DISPUTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            REJECTED
          </span>
        );
      case 'UNDER_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 text-blue-600" />
            IN SCRUTINY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            SUBMITTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] tracking-tight">
            Document Verification Vault
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographic SHA-256 integrity validation, duplicate file reuse alerts, and timestamped verifier rationale.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 bg-[#0f2942] hover:bg-[#153a5c] text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors"
        >
          <Upload className="w-4 h-4 text-teal-400" />
          <span>Upload Dossier Document</span>
        </button>
      </div>

      {/* Prominent Verification Disclaimer Note */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Cryptographic Safeguard Notice:</strong> Calculating a SHA-256 checksum verifies that a file has not been altered or substituted after submission; it does not, by itself, constitute institutional authentication of the issuing authority. Physical or DigiLocker institutional verification remains required by establishment verifiers.
        </p>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Document Details</th>
              <th className="py-3 px-4">Associated Candidate</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">SHA-256 Checksum</th>
              <th className="py-3 px-4">Integrity Flags</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Verifier Rationale</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  {loading ? 'Loading document repository...' : 'No documents found.'}
                </td>
              </tr>
            ) : (
              documents.map((doc) => {
                const emp = employees.find(e => e.id === doc.employee_id);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{doc.document_name}</div>
                      <div className="text-[10px] text-slate-400">
                        {(doc.file_size / 1024).toFixed(1)} KB • {doc.mime_type}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{emp ? emp.full_name : `Emp #${doc.employee_id}`}</div>
                      <div className="text-[10px] font-mono text-teal-700">{emp ? emp.employee_ref : '—'}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-medium border border-slate-200">
                        {doc.doc_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <span title={doc.file_sha256} className="cursor-help">
                        {doc.file_sha256.substring(0, 10)}...{doc.file_sha256.substring(54)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {doc.is_duplicate_flag ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          DUPLICATE HASH ALERT
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unique File</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(doc.verification_status)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600" title={doc.verifier_notes || 'Pending verifier scrutiny'}>
                      {doc.verifier_notes || <span className="text-slate-400 italic">No notes recorded yet</span>}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenVerify(doc)}
                        className="text-teal-700 hover:text-teal-900 font-semibold"
                      >
                        {['Document Verifier', 'HR Officer', 'Promotion Committee'].includes(currentPersona.role) ? 'Verify / Dispute' : 'View Verification'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Verify / Dispute Modal */}
      {showVerifyModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Document Integrity & Status Verification
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDoc.document_name} ({selectedDoc.doc_type})
                </p>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs font-mono">
              <span className="text-slate-500 font-sans font-semibold block">Cryptographic SHA-256 Digest:</span>
              <p className="text-teal-800 break-all select-all">{selectedDoc.file_sha256}</p>
            </div>

            <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Determination <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifyAction('VERIFY')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border text-center transition-all ${
                      verifyAction === 'VERIFY'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    VERIFY (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifyAction('DISPUTE')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border text-center transition-all ${
                      verifyAction === 'DISPUTE'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    DISPUTE (Inquiry)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifyAction('REJECT')}
                    className={`py-2 px-3 rounded-lg font-bold text-xs border text-center transition-all ${
                      verifyAction === 'REJECT'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    REJECT (Defective)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mandatory Verifier Justification & File Register Reference <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={verifyReason}
                  onChange={(e) => setVerifyReason(e.target.value)}
                  placeholder="Record physical service book volume, issuing authority verification log, or reason for dispute..."
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 rounded bg-slate-50 text-[11px] text-slate-500 space-y-1">
                <div>Acting Official: <strong className="text-slate-800">{currentPersona.name}</strong> ({currentPersona.role})</div>
                <div>Action Timestamp: <span className="font-mono">{new Date().toISOString()}</span></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerify}
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold disabled:opacity-50"
                >
                  {submittingVerify ? 'Recording in Audit Log...' : 'Commit Verification Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload Dossier File to Secure Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Computes SHA-256 checksum and scans for identical duplicate hashes.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Associate with Candidate</label>
                <select
                  value={uploadData.employee_id}
                  onChange={(e) => setUploadData({ ...uploadData, employee_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_ref} - {emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dossier Document Category</label>
                <select
                  value={uploadData.doc_type}
                  onChange={(e) => setUploadData({ ...uploadData, doc_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                >
                  <option value="SERVICE_BOOK">Service Book (Certified Copy)</option>
                  <option value="APAR_DOSSIER">APAR Dossier (5-Year Cycle)</option>
                  <option value="INTEGRITY_CERTIFICATE">Integrity Certificate / Vigilance Clearance</option>
                  <option value="CASTE_CERTIFICATE">Caste / Category Certificate</option>
                  <option value="EXPERIENCE_CERTIFICATE">Experience / Postings Record</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Certified_Service_Book_Entry_2024.pdf"
                  value={uploadData.document_name}
                  onChange={(e) => setUploadData({ ...uploadData, document_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File (PDF / Images up to 15MB)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-1.5 rounded-lg bg-[#0f2942] hover:bg-[#153a5c] text-white font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Hashing & Uploading...' : 'Upload & Compute Hash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
