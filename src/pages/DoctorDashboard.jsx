import React, { useState, useRef } from 'react';
import { Users, FileText, Activity, Search, Bell, Eye, LogOut, ChevronRight, UploadCloud, CheckCircle2, AlertTriangle, ArrowLeft, Loader2, Info, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  // Clinical Form State
  const [clinicalData, setClinicalData] = useState({
    sphericalEq: '',
    axialLength: '',
    iop: ''
  });
  const [uploadedScan, setUploadedScan] = useState(null);
  const fileInputRef = useRef(null);

  const patients = [
    {
      id: 'P-1042', name: 'Sarah Jenkins', age: 34, riskLevel: 'High', status: 'Needs Review',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', severity: 'Severe Myopia', prediction: 'Positive', riskScore: 85,
      factors: { screen: 8, outdoor: 0.5, family: 'Yes' }
    },
    {
      id: 'P-1043', name: 'Michael Chen', age: 28, riskLevel: 'Low', status: 'Cleared',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80', severity: 'Normal', prediction: 'Negative', riskScore: 12,
      factors: { screen: 4, outdoor: 2.5, family: 'No' }
    },
    {
      id: 'P-1044', name: 'Emma Davis', age: 42, riskLevel: 'Moderate', status: 'Monitoring',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80', severity: 'Mild Myopia', prediction: 'Positive', riskScore: 45,
      factors: { screen: 6, outdoor: 1, family: 'Yes' }
    },
  ];

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedScan(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRunAssessment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAssessmentComplete(true);
    }, 2000);
  };

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Average Risk Score', data: [35, 38, 42, 40, 45, 48], borderColor: '#3B82F6', tension: 0.4 }]
  };
  const distributionData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [{ data: [45, 30, 25], backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], borderWidth: 0 }]
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Doctor Profile</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-3xl border border-blue-200">
                Dr.
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Dr. Sarah Jenkins</h3>
                <p className="text-blue-600 font-semibold mb-1">Senior Ophthalmologist</p>
                <p className="text-slate-500 text-sm">Vision Care Central Hospital</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">License Number</span>
                <span className="text-slate-800 font-semibold">MD-8492011</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</span>
                <span className="text-slate-800 font-semibold">dr.jenkins@visioncare.auth</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Phone Number</span>
                <span className="text-slate-800 font-semibold">+1 (555) 019-2831</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Specialization</span>
                <span className="text-slate-800 font-semibold">Retinal Diagnostics & Myopia Mgmt</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Edit Details</button>
            </div>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'reports') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Generated Clinical Reports</h2>
          <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Reports Generated Yet</h3>
            <p className="text-slate-500">Run diagnostic evaluations on patients to automatically generate downloadable PDF reports.</p>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'analytics') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Clinic Analytics Overview</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-lg font-semibold mb-4">Risk Trends</h3><div className="h-[250px]"><Line data={trendData} options={{ maintainAspectRatio: false }} /></div></div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="text-lg font-semibold mb-4">Risk Distribution</h3><div className="h-[250px]"><Doughnut data={distributionData} options={{ maintainAspectRatio: false }} /></div></div>
          </div>
        </motion.div>
      );
    }

    if (activeTab === 'patients' && selectedPatient) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <button onClick={() => { setSelectedPatient(null); setAssessmentComplete(false); setUploadedScan(null); }} className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
          </button>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left Column: Patient Profile & Reported Factors */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-center p-6">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 tracking-widest">{selectedPatient.name.charAt(0)}</div>
                <h2 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{selectedPatient.id} • {selectedPatient.age} yrs</p>
                <div className="mt-4 flex justify-center">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${selectedPatient.riskLevel === 'High' ? 'bg-red-50 text-red-600' : selectedPatient.riskLevel === 'Low' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}>
                    Prior Risk: {selectedPatient.riskLevel}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 line-clamp-2">
                <h3 className="font-bold text-slate-800 flex items-center mb-4"><FileText className="w-4 h-4 mr-2 text-blue-500" /> Patient Reported Factors</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center"><span className="text-slate-500">Screen Time:</span> <span className="font-semibold text-slate-800">{selectedPatient.factors.screen} hrs/day</span></li>
                  <li className="flex justify-between items-center"><span className="text-slate-500">Outdoor Time:</span> <span className="font-semibold text-slate-800">{selectedPatient.factors.outdoor} hrs/day</span></li>
                  <li className="flex justify-between items-center"><span className="text-slate-500">Family History:</span> <span className="font-semibold text-slate-800">{selectedPatient.factors.family}</span></li>
                </ul>
              </div>
            </div>

            {/* Right Column: Clinical Inputs & Assessment */}
            <div className="lg:col-span-2 space-y-6">

              {!assessmentComplete ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-48 h-48 text-blue-600" /></div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center relative z-10"><Eye className="w-5 h-5 mr-2 text-blue-600" /> Clinical Diagnostic Support Form</h3>

                  <form onSubmit={handleRunAssessment} className="relative z-10 flex-1 flex flex-col">
                    <div className="grid md:grid-cols-3 gap-5 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                          Refractive Error <Info className="w-3 h-3 ml-1 text-slate-400" />
                        </label>
                        <input type="number" step="0.25" placeholder="-2.50 D" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={clinicalData.sphericalEq} onChange={e => setClinicalData({ ...clinicalData, sphericalEq: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                          Axial Length <Info className="w-3 h-3 ml-1 text-slate-400" />
                        </label>
                        <input type="number" step="0.01" placeholder="24.5 mm" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={clinicalData.axialLength} onChange={e => setClinicalData({ ...clinicalData, axialLength: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                          IOP <Info className="w-3 h-3 ml-1 text-slate-400" />
                        </label>
                        <input type="number" step="0.1" placeholder="15 mmHg" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={clinicalData.iop} onChange={e => setClinicalData({ ...clinicalData, iop: e.target.value })} />
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fundus Scan Upload</label>
                      <div className={`border-2 border-dashed rounded-xl p-8 h-full min-h-[160px] flex flex-col justify-center text-center transition-colors cursor-pointer ${uploadedScan ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 bg-slate-50'}`} onClick={() => fileInputRef.current.click()}>
                        {uploadedScan ? (
                          <div className="flex items-center justify-between mx-4">
                            <span className="text-sm font-semibold text-blue-700 flex items-center"><CheckCircle2 className="w-5 h-5 mr-3" /> Image Successfully Imported</span>
                            <span className="text-xs text-blue-500 font-bold uppercase tracking-widest hover:underline">Replace</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                            <p className="text-sm font-semibold text-slate-600">Click to upload or drag current Fundus image</p>
                          </div>
                        )}
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-auto pt-4 border-t border-slate-100">
                      <button type="submit" disabled={isProcessing || !uploadedScan} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-md hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center">
                        {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Diagnostic Analysis...</> : 'Synthesize Factors & Evaluate'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold flex items-center"><CheckCircle2 className="w-6 h-6 mr-2 text-green-400" /> Diagnostic Evaluation Complete</h3>
                        <p className="text-blue-100 text-sm mt-1">Integrated synthesis: Lifestyle Factors + Clinical Parameters + Fundus Topography.</p>
                      </div>
                      <div className="flex space-x-3">
                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-center flex flex-col justify-center">
                          <span className="text-xs uppercase tracking-widest block opacity-80 mb-1">Confidence</span>
                          <span className="text-xl font-black text-green-300">94.2%</span>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 text-center">
                          <span className="text-xs uppercase tracking-widest block opacity-80 mb-1">New Risk Score</span>
                          <span className="text-3xl font-black">{Math.min(100, selectedPatient.riskScore + 8)}<span className="text-lg opacity-80">/100</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-center">
                        <div className="flex-1">
                          <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Progression Trend</p>
                          <p className="font-bold flex items-center text-amber-300"><AlertTriangle className="w-4 h-4 mr-2" /> Escalated Risk</p>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-center">
                        <div className="flex-1">
                          <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Morphological Alert</p>
                          <p className="font-bold text-red-300 text-sm">Myopic Maculopathy Likely</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                      <h3 className="font-bold text-slate-800 mb-4 flex justify-between">
                        Adjusted Risk Trajectory
                        <span className="text-blue-600 text-sm font-semibold">Post-Evaluation</span>
                      </h3>
                      <div className="h-[200px]"><Line data={{ labels: ['S1', 'S2', 'S3', 'Current'], datasets: [{ label: 'Risk Timeline', data: [selectedPatient.riskScore - 15, selectedPatient.riskScore - 5, selectedPatient.riskScore, Math.min(100, selectedPatient.riskScore + 8)], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.3 }] }} options={{ maintainAspectRatio: false }} /></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                      <h3 className="font-bold text-slate-800 mb-4 flex justify-between">
                        Grad-CAM Heatmap
                        <span className="text-amber-500 text-sm font-semibold flex items-center"><Eye className="w-4 h-4 mr-1" /> Overlay</span>
                      </h3>
                      <div className="h-[200px] relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                        <img src={uploadedScan} alt="Base Fundus Scan" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/50 via-yellow-500/30 to-blue-500/10 mix-blend-overlay"></div>
                        <div className="relative z-10 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                          <span className="text-white text-xs font-bold tracking-wider uppercase flex items-center"><Activity className="w-3 h-3 mr-2 text-red-500" /> Macula Highlighting Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button onClick={() => { setAssessmentComplete(false); setUploadedScan(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Discard Draft</button>
                    <button className="px-5 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/20 transition-colors">Confirm & Save to Registry</button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search ID or Patient Name" className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium" />
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 font-bold tracking-wider">Patient Details</th>
              <th className="px-6 py-5 font-bold tracking-wider">Historical Risk</th>
              <th className="px-6 py-5 font-bold tracking-wider">Action Needed</th>
              <th className="px-6 py-5 font-bold tracking-wider text-right">Perform Eval</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-base">{p.name}</div>
                  <div className="text-slate-400 text-xs font-semibold">{p.id}</div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">{p.riskScore}/100</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${p.status === 'Needs Review' ? 'bg-red-50 text-red-600' : p.status === 'Monitoring' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-white bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 inline-flex items-center">
                    Evaluate <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20 sticky top-0 md:h-screen transition-all">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
          <Eye className="w-8 h-8 text-blue-600" />
          <span className="font-black text-xl tracking-tight text-slate-800">VisionAssistant</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => { setActiveTab('patients'); setSelectedPatient(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            <Users className="w-5 h-5" /> <span>Patient Registry</span>
          </button>
          <button onClick={() => { setActiveTab('reports'); setSelectedPatient(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            <FileText className="w-5 h-5" /> <span>Reports</span>
          </button>
          <button onClick={() => { setActiveTab('analytics'); setSelectedPatient(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            <Activity className="w-5 h-5" /> <span>Analytics</span>
          </button>
          <button onClick={() => { setActiveTab('profile'); setSelectedPatient(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            <UserCog className="w-5 h-5" /> <span>Profile Settings</span>
          </button>
        </div>
        <div className="p-4 border-t border-slate-100">
          <button onClick={() => navigate('/login')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" /> <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="font-extrabold text-slate-800 capitalize tracking-tight text-lg">{activeTab === 'patients' ? 'Patient Management' : activeTab === 'analytics' ? 'Clinic Analytics' : activeTab === 'reports' ? 'Reports' : 'Profile Settings'}</h1>
          <div className="flex items-center space-x-5">
            <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => { setActiveTab('profile'); setSelectedPatient(null); }} className={`w-10 h-10 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700 font-bold border cursor-pointer transition-all ${activeTab === 'profile' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100 shadow-sm hover:shadow-md'}`}>
              Dr.
            </button>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
