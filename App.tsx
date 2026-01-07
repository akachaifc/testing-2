
import React, { useState, useEffect } from 'react';
import { TopicContent } from './types';
import { generateTopicContent, generateTopicImage } from './services/gemini';
import HostingDashboard from './components/HostingDashboard';
import Visuals from './components/Visuals';

const App: React.FC = () => {
  const [topic, setTopic] = useState('Modern Web Hosting');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<TopicContent | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const [newContent, newImage] = await Promise.all([
        generateTopicContent(topic),
        generateTopicImage(topic)
      ]);
      setContent(newContent);
      setImageUrl(newImage);
    } catch (error) {
      console.error("Failed to fetch topic data", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 pb-20">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200 pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Hosting Status: Operational
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            OmniDive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tester</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            A real-time stress test for your web hosting environment. 
            Generate deep-dive content on any topic using Gemini AI.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter any topic (e.g. Quantum Computing)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Explore"}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-8">
        <HostingDashboard />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Consulting the AI core...</p>
          </div>
        ) : content && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              {imageUrl && (
                <div className="h-64 md:h-96 w-full overflow-hidden">
                  <img src={imageUrl} alt={topic} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
              )}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">{content.title}</h2>
                <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {content.summary}
                </div>
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Facts list */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </span>
                  Fascinating Facts
                </h3>
                <ul className="space-y-4">
                  {content.facts.map((fact, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 border-b border-slate-50 pb-3 last:border-0">
                      <span className="font-bold text-blue-600">{idx + 1}.</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats Visualization */}
              <Visuals data={content.stats} />
            </div>

            {/* Q&A Section */}
            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
              <div className="space-y-8">
                {content.qAndA.map((item, idx) => (
                  <div key={idx} className="group">
                    <h4 className="text-xl font-semibold mb-3 text-blue-400 flex gap-3">
                      <span className="opacity-50">Q:</span> {item.question}
                    </h4>
                    <p className="text-slate-300 pl-8 border-l-2 border-slate-800 group-hover:border-blue-600 transition-colors">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} OmniDive Labs • Dynamic Hosting Validation Suite</p>
      </footer>
    </div>
  );
};

export default App;
