
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import ScoreMeter from './components/ScoreMeter';
import { NOIDA_SECTORS, USE_CASES } from './data/mockData';
import { SectorData, InfrastructureItem } from './types';

const App: React.FC = () => {
  const [cityInput, setCityInput] = useState('Noida');
  const [sectorInput, setSectorInput] = useState('');
  const [activeSector, setActiveSector] = useState<SectorData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(event.target as Node)) {
        setIsSuggesting(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (sectorInput.length < 1) return [];
    return NOIDA_SECTORS.filter(s => 
      s.name.toLowerCase().includes(sectorInput.toLowerCase())
    );
  }, [sectorInput]);

  const generateMockSector = (name: string): SectorData => ({
    id: `custom-${Date.now()}`,
    name: name,
    overallScore: 65,
    label: 'Developing',
    summary: `${name} is an emerging neighborhood currently witnessing infrastructure upgrades and residential expansion.`,
    breakdown: {
      connectivity: 60,
      healthcare: 55,
      education: 70,
      retail: 50,
      employment: 65,
    },
    infrastructure: [
      { name: 'Local Public Transit', category: 'Metro & Transport', importance: 'Regional bus and auto-rickshaw network', icon: '🚌' },
      { name: 'Neighborhood Clinic', category: 'Healthcare', importance: 'Local primary care facilities', icon: '🏥' },
      { name: 'Community Park', category: 'Lifestyle & Daily Needs', importance: 'Essential green space for recreation', icon: '🌳' },
      { name: 'Jewar Airport Access', category: 'Airport Access', importance: 'Future connectivity via upcoming link roads', icon: '✈️' },
    ]
  });

  const handleGenerate = (sector?: SectorData) => {
    setError(null);
    if (!cityInput.trim()) {
      setError("Please enter city name");
      return;
    }
    if (!sectorInput.trim() && !sector) {
      setError("Please enter sector or locality");
      return;
    }

    let target: SectorData;
    if (sector) {
      target = sector;
    } else {
      const exactMatch = NOIDA_SECTORS.find(s => s.name.toLowerCase() === sectorInput.toLowerCase());
      if (exactMatch) {
        target = exactMatch;
      } else if (filteredSuggestions.length > 0) {
        target = filteredSuggestions[0];
      } else {
        target = generateMockSector(sectorInput);
        setError("Demo data not available, using nearest locality estimates");
        setTimeout(() => setError(null), 4000);
      }
    }

    setActiveSector(target);
    setShowResults(true);
    setSectorInput(target.name);
    setIsSuggesting(false);
    
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const groupedInfra = useMemo(() => {
    if (!activeSector) return {};
    return activeSector.infrastructure.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, InfrastructureItem[]>);
  }, [activeSector]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Smart Location Intelligence for <span className="text-emerald-600">My Property Fact</span>
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              Analyze infrastructure, transit, and growth potential with a professional data-driven report.
            </p>

            {/* Input Section */}
            <div className="relative max-w-3xl mx-auto">
              {error && (
                <div className="absolute -top-14 left-0 right-0 animate-bounce text-center">
                  <span className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-rose-200">
                    ⚠️ {error}
                  </span>
                </div>
              )}
              
              <div id="analyze" className="bg-white p-3 md:p-4 rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-stretch">
                <div className="relative flex-1 group">
                  <input 
                    type="text" id="city" placeholder=" "
                    className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 pt-6 pb-2 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    value={cityInput} onChange={(e) => setCityInput(e.target.value)}
                  />
                  <label htmlFor="city" className="absolute left-5 top-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px]">City</label>
                </div>

                <div className="relative flex-[1.5] group" ref={suggestRef}>
                  <input 
                    type="text" id="sector" placeholder=" "
                    className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 pt-6 pb-2 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    value={sectorInput} onFocus={() => setIsSuggesting(true)}
                    onChange={(e) => { setSectorInput(e.target.value); setIsSuggesting(true); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <label htmlFor="sector" className="absolute left-5 top-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px]">Sector / Locality</label>

                  {isSuggesting && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</span>
                      </div>
                      {filteredSuggestions.map(s => (
                        <button key={s.id} className="w-full text-left px-5 py-3.5 hover:bg-emerald-50 transition flex items-center justify-between group" onClick={() => handleGenerate(s)}>
                          <span className="text-slate-700 font-medium group-hover:text-emerald-700">{s.name}</span>
                          <span className="text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded group-hover:bg-emerald-100 group-hover:text-emerald-600 transition">Score: {s.overallScore}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group min-w-[200px]" onClick={() => handleGenerate()}>
                  Generate Report
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && activeSector && (
        <section id="results" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Location Intelligence: {cityInput}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">{activeSector.name}</h2>
              </div>
              <button className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export PDF Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8">
                <ScoreMeter score={activeSector.overallScore} label={activeSector.label} />
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                     <span className="text-emerald-500">📊</span> Metrics Weightage
                   </h3>
                   <div className="space-y-5">
                      {[
                        { label: 'Connectivity', val: '30%', color: 'bg-blue-500' },
                        { label: 'Healthcare', val: '20%', color: 'bg-emerald-500' },
                        { label: 'Education', val: '20%', color: 'bg-indigo-500' },
                        { label: 'Retail & Lifestyle', val: '15%', color: 'bg-rose-500' },
                        { label: 'Employment', val: '15%', color: 'bg-amber-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>{item.label}</span>
                            <span>{item.val}</span>
                          </div>
                          <div className="w-full bg-slate-50 h-1.5 rounded-full"><div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }}></div></div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                {/* Summary Section */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm border-l-8 border-l-emerald-600">
                   <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="text-3xl">📝</span> Analysis Summary
                   </h3>
                   <p className="text-slate-600 text-lg leading-relaxed">{activeSector.summary}</p>
                   <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-sm font-semibold text-emerald-700 italic">"Why this location? This locality stands out for its {activeSector.breakdown.connectivity > 90 ? 'superior transit networks' : 'balanced residential environment'}, making it a {activeSector.overallScore > 85 ? 'top-tier' : 'stable'} choice for living and investment."</p>
                   </div>
                </div>

                {/* Qualitative Infrastructure Section */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">🏢</span>
                    Detailed Infrastructure & Landmarks
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedInfra).map(([category, items]: [string, InfrastructureItem[]]) => (
                      <div key={category} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                          <span className="text-xl">{items[0].icon}</span> {category}
                        </h4>
                        <ul className="space-y-6">
                          {items.map((item, idx) => (
                            <li key={idx} className="group">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.name}</span>
                                {item.importance && (
                                  <span className="text-sm text-slate-500 mt-1 leading-snug">{item.importance}</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Preview */}
                <div className="aspect-[21/9] w-full bg-slate-100 rounded-[40px] relative flex items-center justify-center overflow-hidden border border-slate-200 shadow-xl group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
                  <div className="relative z-10 text-center px-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">📍</div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">POI Visual Explorer</h4>
                    <p className="text-slate-500 text-sm">Interactive map view showing landmarks mentioned above.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Technology</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-20">How we analyze locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Locality Input', desc: 'Specify city and sector for targeted regional data extraction.', icon: '🏢' },
              { title: 'Metadata Sync', desc: 'Cross-referencing transit, health, and education infrastructure layers.', icon: '📡' },
              { title: 'Score Computation', desc: 'Algorithmic weighting based on proximity and quality parameters.', icon: '🧠' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">{item.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-20">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Ecosystem</span>
            <h2 className="text-4xl font-bold mt-4">Industry Applications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {USE_CASES.map((useCase, idx) => (
              <div key={idx} className="bg-slate-800/40 backdrop-blur border border-slate-700/50 p-8 rounded-[32px] hover:bg-slate-800 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{useCase.icon}</div>
                <h4 className="font-bold text-lg mb-3 text-slate-100">{useCase.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
              <span className="text-2xl font-bold text-slate-900">RealEstate <span className="text-emerald-600">MPF</span></span>
              <p className="text-slate-500 text-sm mt-2">Professional Location Intelligence for Urban Markets.</p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-emerald-600 transition">About</a>
              <a href="#" className="hover:text-emerald-600 transition">Methodology</a>
              <a href="#" className="hover:text-emerald-600 transition">Contact</a>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs">© 2024 RealEstate MPF. Demo Version.</p>
            <span className="px-5 py-1.5 bg-slate-200 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">MVP Preview 1.0.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
