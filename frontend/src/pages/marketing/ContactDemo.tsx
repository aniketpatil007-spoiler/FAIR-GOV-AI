import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Building2, Mail, User, Briefcase, FileText } from 'lucide-react';
import { submitInquiry } from '../../api/client';
import { InquiryResponse } from '../../types';

export const ContactDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    official_designation: '',
    department: '',
    official_email: '',
    area_of_interest: 'Controlled Cadre Promotion Pilot',
    message: '',
    consent_given: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<InquiryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim() || !formData.official_designation.trim() || !formData.department.trim() || !formData.official_email.trim()) {
      setError('Please fill in all mandatory official fields.');
      return;
    }

    if (!formData.official_email.includes('@') || !formData.official_email.includes('.')) {
      setError('Please provide a valid official email address.');
      return;
    }

    if (!formData.consent_given) {
      setError('You must acknowledge the data privacy notice and consent to proceed.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitInquiry(formData);
      setSuccessResponse(res);
      setFormData({
        name: '',
        official_designation: '',
        department: '',
        official_email: '',
        area_of_interest: 'Controlled Cadre Promotion Pilot',
        message: '',
        consent_given: false
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please ensure backend service is operational.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <span>Official Engagement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight">
            Request a Demonstration & Pilot Discussion
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Submit your official details to schedule a live demonstration or evaluate a controlled pilot for your department's establishment section.
          </p>
        </div>

        {/* Success Confirmation Modal / Card */}
        {successResponse ? (
          <div className="p-8 rounded-2xl bg-white border border-emerald-300 shadow-md text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Demonstration Request Recorded
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{successResponse.name}</strong> ({successResponse.official_designation}, {successResponse.department}). Your inquiry has been securely registered in the FairGov AI evaluation registry.
            </p>
            <div className="inline-block p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              Tracking Reference ID: <strong className="text-teal-700">{successResponse.inquiry_ref}</strong>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setSuccessResponse(null)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            {error && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sh. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>

              {/* Official Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Designation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.official_designation}
                    onChange={(e) => setFormData({ ...formData, official_designation: e.target.value })}
                    placeholder="e.g. Under Secretary / Deputy Secretary"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>

              {/* Department / Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Department / Organization <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Department of Personnel & Training"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.official_email}
                    onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                    placeholder="name.dept@gov.in or official org email"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Area of Interest */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Area of Interest <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.area_of_interest}
                onChange={(e) => setFormData({ ...formData, area_of_interest: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              >
                <option value="Controlled Cadre Promotion Pilot">Controlled Cadre Promotion Pilot</option>
                <option value="Employee Records & Document Verification Vault">Employee Records & Document Verification Vault</option>
                <option value="Annual Vacancy Reconciliation Engine">Annual Vacancy Reconciliation Engine</option>
                <option value="Explainable Rules Engine Walkthrough">Explainable Rules Engine Walkthrough</option>
                <option value="Audit Trails & Tamper Detection Security Review">Audit Trails & Tamper Detection Security Review</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Cadre or Workflow Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention feeder designations, target promotion posts, estimated cadre size, or specific recruitment rules of interest..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              />
            </div>

            {/* Consent & Privacy Notice */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consent_given}
                  onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  I confirm that I am an authorized official/representative inquiring on behalf of my department or public sector organization. I acknowledge that FairGov AI is currently evaluated as a proposed GovTech solution and consent to being contacted regarding a demonstration or pilot proposal.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0f2942] hover:bg-[#153a5c] text-white py-3 rounded-lg text-xs font-semibold tracking-wide shadow-sm disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span>Registering Inquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-teal-400" />
                  <span>Submit Demonstration Request</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
