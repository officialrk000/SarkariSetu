import React from 'react';
import { supabase } from '../lib/supabase';
import { ImagePlus, Send, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    title: '',
    organization: '',
    deadline: '',
    officialLink: '',
    category: 'Latest Job',
    description: '',
    table: 'jobs',
    // New fields
    application_fees: '',
    age_limit: '',
    notification_link: '',
    official_website: '',
    how_to_fill: ''
  });

  const categoryMap: Record<string, string> = {
    'Latest Job': 'jobs',
    'Admit Card': 'admit_cards',
    'Result': 'results',
    'Admission': 'admissions',
    'Answer Key': 'answer_keys',
    'Syllabus': 'jobs', // Fallback
    'Scholarship': 'jobs', // Fallback
    'Important Update': 'jobs' // Fallback
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `jobs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('job-images')
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('job-images')
          .getPublicUrl(filePath);
        
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from(formData.table)
        .insert([
          {
            // Map UI fields to SQL snake_case columns
            post_name: formData.title,
            department: formData.organization,
            important_dates: formData.deadline,
            apply_link: formData.officialLink,
            application_fees: formData.application_fees,
            age_limit: formData.age_limit,
            notification_link: formData.notification_link,
            official_website: formData.official_website,
            how_to_fill: formData.how_to_fill,
            image_url: imageUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      alert('Item posted successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error posting item:', error.message || error);
      alert(`Failed to post item: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Post New Job Notification</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Official Notification Picture / Poster</label>
            <div className="relative h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                  <button 
                    type="button"
                    onClick={() => { setImage(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500">Click to upload image</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Post Title</label>
              <input 
                required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. SSC CGL 2024"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Department / Organization</label>
              <input 
                required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Staff Selection Commission"
                value={formData.organization}
                onChange={e => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Last Date to Apply</label>
              <input 
                required
                type="date"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.category}
                onChange={e => setFormData({
                  ...formData, 
                  category: e.target.value,
                  table: categoryMap[e.target.value] || 'jobs'
                })}
              >
                <option>Latest Job</option>
                <option>Admit Card</option>
                <option>Result</option>
                <option>Syllabus</option>
                <option>Answer Key</option>
                <option>Admission</option>
                <option>Scholarship</option>
                <option>Important Update</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Application Fees</label>
              <input 
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Gen/OBC: 100, SC/ST: 0"
                value={formData.application_fees}
                onChange={e => setFormData({...formData, application_fees: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Age Limit</label>
              <input 
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. 18-27 years"
                value={formData.age_limit}
                onChange={e => setFormData({...formData, age_limit: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Notification Link</label>
              <input 
                type="url"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="https://..."
                value={formData.notification_link}
                onChange={e => setFormData({...formData, notification_link: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Official Website</label>
              <input 
                type="url"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="https://..."
                value={formData.official_website}
                onChange={e => setFormData({...formData, official_website: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">How to Fill (Short Instructions)</label>
            <textarea 
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter brief instructions..."
              rows={3}
              value={formData.how_to_fill}
              onChange={e => setFormData({...formData, how_to_fill: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Apply Link (Direct)</label>
            <input 
              required
              type="url"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://..."
              value={formData.officialLink}
              onChange={e => setFormData({...formData, officialLink: e.target.value})}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Publish Notification
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
