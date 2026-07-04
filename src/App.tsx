import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import CategoryCards from './components/CategoryCards';
import JobFeed from './components/JobFeed';
import SecondarySections from './components/SecondarySections';
import JobDetailPage from './components/JobDetailPage';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import { Job } from './types';

function Home() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const fetchAllData = React.useCallback(async () => {
    setLoading(true);
    
    const tables = [
      { name: 'jobs', category: 'Latest Job' },
      { name: 'admit_cards', category: 'Admit Card' },
      { name: 'results', category: 'Result' },
      { name: 'admissions', category: 'Admission' },
      { name: 'answer_keys', category: 'Answer Key' }
    ];

    try {
      const promises = tables.map(async (t) => {
        // Try fetching with ordering first
        let result = await supabase.from(t.name).select('*').order('postDate', { ascending: false }).limit(20);
        
        if (result.error) {
          // Fallback 1: Try post_date (snake_case)
          result = await supabase.from(t.name).select('*').order('post_date', { ascending: false }).limit(20);
          
          if (result.error) {
            // Fallback 2: Try without ordering
            result = await supabase.from(t.name).select('*').limit(20);
          }
        }
        
        if (result.data) {
          // Normalize column names if needed
          result.data = result.data.map(item => ({
            ...item,
            title: item.title || item.post_name || '',
            organization: item.organization || item.department || '',
            postDate: item.postDate || item.created_at || item.post_date || '',
            deadline: item.deadline || item.important_dates || '',
            officialLink: item.officialLink || item.apply_link || item.official_link || '',
            imageUrl: item.imageUrl || item.image_url || ''
          }));
        }
        
        return result;
      });

      const results = await Promise.all(promises);
      
      const allJobs: Job[] = [];
      results.forEach((res, index) => {
        if (res.data && res.data.length > 0) {
          const jobsWithCategory = res.data.map(item => ({
            ...item,
            category: tables[index].category as any
          }));
          allJobs.push(...jobsWithCategory);
        }
      });

      // Sort combined list by postDate
      allJobs.sort((a, b) => {
        const dateA = a.postDate ? new Date(a.postDate).getTime() : 0;
        const dateB = b.postDate ? new Date(b.postDate).getTime() : 0;
        return dateB - dateA;
      });
      
      setJobs(allJobs);
    } catch (err) {
      console.error('Error in fetchAllData:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAllData();

    // Setup real-time listeners for all tables
    const tableNames = ['jobs', 'admit_cards', 'results', 'admissions', 'answer_keys'];
    const channels = tableNames.map(name => 
      supabase
        .channel(`${name}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table: name }, () => {
          fetchAllData();
        })
        .subscribe()
    );

    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchAllData]);

  const filteredJobs = jobs.filter(job => {
    const title = job.title || '';
    const organization = job.organization || '';
    const query = searchQuery.toLowerCase();
    
    return title.toLowerCase().includes(query) || 
           organization.toLowerCase().includes(query);
  });

  const setSearchQuery = (q: string) => {
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 pb-20">
        {/* Quick Access Grid */}
        <div className="bg-white border-b border-gray-100 mb-8">
          <CategoryCards />
        </div>

        {/* Triple Columns Section */}
        <JobFeed jobs={filteredJobs} loading={loading} onJobClick={(job) => {}} />

        {/* Secondary Resources & Bottom Strip */}
        <SecondarySections jobs={jobs} onJobClick={(job) => {}} />

        {/* Trending Exams Visual Grid */}
        <section className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending Exams 2026</h2>
            <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">View Calendar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'UPSC Civil Services 2024', color: 'blue' },
              { name: 'SSC CGL Tier II', color: 'orange' },
              { name: 'IBPS PO Main Exam', color: 'green' },
              { name: 'RRB NTPC Phase 2', color: 'purple' },
              { name: 'CTET July 2024', color: 'red' },
              { name: 'NDA/NA (I) 2024', color: 'emerald' },
            ].map((exam, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -3 }}
                className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-100" />
                  <span className="font-bold text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{exam.name}</span>
                </div>
                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Active</div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-[90] bg-white text-gray-900 p-4 rounded-xl shadow-2xl border border-gray-100 hover:bg-blue-600 hover:text-white transition-all group"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/post/:category/:id" element={<JobDetailPage />} />
      </Routes>
    </Router>
  );
}
