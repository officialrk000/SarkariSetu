import React from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminFormData {
  formType: string;
  postName: string;
  departmentName: string;
  importantDates: string;
  applicationFees: string;
  age: string;
  eligibility: string;
  postWiseDetails: string;
  howToFill: string;
  applyLink: string;
  notificationLink: string;
  officialWebsiteLink: string;
  remark: string;
}

const initialData: AdminFormData = {
  formType: 'Latest Job',
  postName: '',
  departmentName: '',
  importantDates: '',
  applicationFees: '',
  age: '',
  eligibility: '',
  postWiseDetails: '',
  howToFill: '',
  applyLink: '',
  notificationLink: '',
  officialWebsiteLink: '',
  remark: ''
};

export default function AdminForm() {
  const [formData, setFormData] = React.useState<AdminFormData>(initialData);
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      const adminSession = JSON.parse(localStorage.getItem('admin_session') || '{}');
      const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
      
      if (!scriptUrl || scriptUrl.includes('YOUR_APPS_SCRIPT')) {
        throw new Error('Apps Script URL not configured');
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submitData',
          data: { 
            ...formData, 
            submittedBy: adminSession.name || 'Unknown',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData(initialData);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Type / Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Form Type</label>
          <select 
            value={formData.formType}
            onChange={e => setFormData({...formData, formType: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {['Latest Job', 'Admit Card', 'Result', 'Admission', 'Answer Key', 'Syllabus', 'Scholarship', 'Important Update'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Post Name */}
        <InputField 
          label="Post Name" 
          value={formData.postName} 
          onChange={v => setFormData({...formData, postName: v})} 
          placeholder="e.g. SSC CGL 2024" 
        />

        {/* Department Name */}
        <InputField 
          label="Department Name" 
          value={formData.departmentName} 
          onChange={v => setFormData({...formData, departmentName: v})} 
          placeholder="e.g. Staff Selection Commission" 
        />

        {/* Important Dates */}
        <TextAreaField 
          label="Important Dates" 
          value={formData.importantDates} 
          onChange={v => setFormData({...formData, importantDates: v})} 
          placeholder="e.g. Start Date: 01/01/2024&#10;Last Date: 30/01/2024" 
        />

        {/* Application Fees */}
        <TextAreaField 
          label="Application Fees" 
          value={formData.applicationFees} 
          onChange={v => setFormData({...formData, applicationFees: v})} 
          placeholder="General/OBC: 100&#10;SC/ST: 0" 
        />

        {/* Age */}
        <InputField 
          label="Age Limit" 
          value={formData.age} 
          onChange={v => setFormData({...formData, age: v})} 
          placeholder="e.g. 18-27 Years" 
        />

        {/* Eligibility */}
        <TextAreaField 
          label="Eligibility / Education" 
          value={formData.eligibility} 
          onChange={v => setFormData({...formData, eligibility: v})} 
          placeholder="e.g. Bachelor Degree in any stream" 
        />

        {/* Post Wise Details */}
        <TextAreaField 
          label="Post Wise Details" 
          value={formData.postWiseDetails} 
          onChange={v => setFormData({...formData, postWiseDetails: v})} 
          placeholder="e.g. Inspector: 50 Posts" 
        />

        {/* How To Fill */}
        <TextAreaField 
          label="How To Fill" 
          value={formData.howToFill} 
          onChange={v => setFormData({...formData, howToFill: v})} 
        />

        {/* Links */}
        <InputField label="Apply Link" value={formData.applyLink} onChange={v => setFormData({...formData, applyLink: v})} />
        <InputField label="Notification Link" value={formData.notificationLink} onChange={v => setFormData({...formData, notificationLink: v})} />
        <InputField label="Official Website" value={formData.officialWebsiteLink} onChange={v => setFormData({...formData, officialWebsiteLink: v})} />
        
        {/* Remark */}
        <div className="md:col-span-2">
          <InputField label="Remark" value={formData.remark} onChange={v => setFormData({...formData, remark: v})} />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3">
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
            <CheckCircle2 className="w-4 h-4" />
            Saved!
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-600 font-bold text-[10px]">
            <AlertCircle className="w-4 h-4" />
            Error!
          </motion.div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 text-xs"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {submitting ? 'Saving...' : 'Export to Sheet'}
        </button>
      </div>
    </form>
  );
}

const InputField = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
    <textarea 
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 resize-none"
    />
  </div>
);
