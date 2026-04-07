import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Loader2, ArrowLeft, MessageSquare, Send, User, ChevronDown, Download, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [formData, setFormData] = useState({ age: '', screenTime: '', outdoorActivity: '', familyHistory: 'no' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI prediction network request
    setTimeout(() => {
      setIsSubmitting(false);
      setResult({
        date: new Date().toLocaleDateString(),
        detection: 'At Risk for Myopia',
        severity: 'Moderate',
        riskScore: 68,
        trendData: [40, 45, 50, 60, 68, 68],
        recommendations: [
          "Increase outdoor activities to 2+ hours daily.",
          "Apply the 20-20-20 rule during screen time.",
          "Schedule an in-person clinical fundus scan in 3 months."
        ]
      });
    }, 2000);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Current'],
    datasets: [{
      label: 'Risk Score History',
      data: result?.trendData || [],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      fill: true,
      tension: 0.4,
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-slate-100 flex flex-col relative pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            Patient Portal
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveTab(activeTab === 'profile' ? 'assessment' : 'profile')} className={`w-9 h-9 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all ${activeTab === 'profile' ? 'ring-2 ring-blue-600 ring-offset-2' : 'shadow-md hover:shadow-lg'}`}>
            P
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mt-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Patient Profile</h2>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-teal-100 flex items-center justify-center text-blue-700 font-bold text-3xl border border-blue-200">
                  P
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Patient User</h3>
                  <p className="text-teal-600 font-semibold mb-1">Standard Patient</p>
                  <p className="text-slate-500 text-sm">Last Assessment: {result ? "Today" : "None"}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Patient ID</span>
                  <span className="text-slate-800 font-semibold">P-803291</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Doctor</span>
                  <span className="text-slate-800 font-semibold flex items-center">Dr. Sarah Jenkins <CheckCircle2 className="w-4 h-4 ml-1 text-teal-500"/></span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</span>
                  <span className="text-slate-800 font-semibold">patient@example.com</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date of Birth</span>
                  <span className="text-slate-800 font-semibold">May 14, 1995</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Edit Profile</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Diagnostic Help Tool</h2>
                <p className="text-slate-500 mt-2">Enter your lifestyle factors for a localized diagnostic evaluation.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 opacity-80" /> Lifestyle Risk Factors
                  </h3>
                </div>
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                        <input 
                          type="number" required min="1" max="120"
                          className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                          value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                          placeholder="e.g. 24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Screen Time (hrs)</label>
                        <input 
                          type="number" required min="0" max="24"
                          className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                          value={formData.screenTime} onChange={e => setFormData({...formData, screenTime: e.target.value})}
                          placeholder="Daily hours"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Outdoor Time (hrs)</label>
                        <input 
                          type="number" required min="0" max="24"
                          className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                          value={formData.outdoorActivity} onChange={e => setFormData({...formData, outdoorActivity: e.target.value})}
                          placeholder="Daily hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Family History</label>
                        <select 
                          className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                          value={formData.familyHistory} onChange={e => setFormData({...formData, familyHistory: e.target.value})}
                        >
                          <option value="no">No History</option>
                          <option value="yes">Yes (Myopic Parents)</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden group inline-flex items-center justify-center rounded-xl text-md font-bold text-white bg-blue-600 hover:bg-blue-700 h-12 mt-6 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Generating Report...</>
                      ) : (
                        'Generate Diagnostic Report'
                      )}
                      <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl pointer-events-none data-[state=open]:animate-in"></div>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800">Your Diagnostic Health Report</h2>
                  <p className="text-slate-500 mt-1 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-teal-500" /> Generated on {result.date}</p>
                </div>
                <button className="flex items-center text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="relative mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" className="text-slate-100 fill-none" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * result.riskScore) / 100} className={`fill-none ${result.riskScore > 70 ? 'text-red-500' : result.riskScore > 40 ? 'text-amber-500' : 'text-teal-500'} transition-all duration-1000 ease-out`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-800">{result.riskScore}</span>
                      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Score</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{result.severity} Risk</h3>
                  <p className="text-sm text-slate-500">{result.detection}</p>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" /> Progression Trend
                  </h3>
                  <div className="h-[200px] w-full">
                    <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 mt-6 shadow-sm">
                <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Clinical Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <div className="bg-amber-500/20 p-1 rounded mt-0.5 mr-3">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="text-amber-900 font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>

      {/* Chatbot Floating UI */}
      {result && (
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 right-0 w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[450px]"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6" />
                    <span className="font-bold">Vision AI Assistant</span>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700 max-w-[85%]">
                    Hello! I'm your Vision AI Assistant. I can help explain your risk report, provide lifestyle tips, or answer questions about Myopia. How can I help today?
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm max-w-[85%] self-end ml-auto">
                    What does a risk score of 68 mean?
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-sm text-slate-700 max-w-[85%]">
                    A score of 68 indicates a **Moderate Risk**. Your lifestyle factors (like screen time) are contributing to progression, but following the "20-20-20" rule and increasing outdoor time can significantly lower future risks!
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-100">
                  <div className="relative">
                    <input type="text" placeholder="Ask about your report..." className="w-full bg-slate-100 border-transparent rounded-full pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner" />
                    <button className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-colors">
                      <Send className="w-4 h-4 ml-px" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-900/20 border-2 border-white"
          >
            {isChatOpen ? <ChevronDown className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </motion.button>
        </div>
      )}
    </div>
  );
}
