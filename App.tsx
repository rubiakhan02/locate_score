
import React, { useState, useMemo, useEffect, useRef } from 'https://esm.sh/react@19.2.3';
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
  const [isLoading, setIsLoading] = useState(false);
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

  // Utility to fetch landmarks from OpenStreetMap Nominatim
  const fetchLocalLandmarks = async (sectorName: string): Promise<InfrastructureItem[]> => {
    try {
      // Query specific categories in Noida Sector context
      const query = `landmarks and metro stations near ${sectorName}, Noida, Uttar Pradesh`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=30`;
      
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await response.json();

      const famousKeywords = [
        { key: 'hospital', category: 'Hospital', icon: '🏥' },
        { key: 'medical', category: 'Hospital', icon: '🏥' },
        { key: 'mall', category: 'Mall', icon: '🛍️' },
        { key: 'shopping', category: 'Mall', icon: '🛍️' },
        { key: 'school', category: 'Education', icon: '🏫' },
        { key: 'college', category: 'Education', icon: '🏫' },
        { key: 'university', category: 'Education', icon: '🏫' },
        { key: 'institute', category: 'Education', icon: '🏫' },
        { key: 'metro', category: 'Metro & Connectivity', icon: '🚇' },
        { key: 'subway', category: 'Metro & Connectivity', icon: '🚇' },
        { key: 'station', category: 'Metro & Connectivity', icon: '🚇' },
      ];

      const landmarks: InfrastructureItem[] = data
        .map((item: any) => {
          const displayName = item.display_name.toLowerCase();
          const match = famousKeywords.find(f => displayName.includes(f.key));
          
          if (match) {
            // Check if it's a metro and if we can extract "Blue Line" or "Aqua Line" from address
            let extraInfo = `${sectorName} Region`;
            if (match.category === 'Metro & Connectivity') {
                if (displayName.includes('blue line')) extraInfo = 'Delhi Metro Blue Line';
                else if (displayName.includes('aqua line')) extraInfo = 'Noida Metro Aqua Line';
                else if (item.address?.suburb) extraInfo = `${item.address.suburb} Connectivity`;
            }

            return {
              name: item.display_name.split(',')[0],
              category: match.category,
              importance: extraInfo,
              icon: match.icon
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 10); 

      return landmarks;
    } catch (err) {
      console.error("Failed to fetch landmarks:", err);
      return [];
    }
  };

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
    infrastructure: [] 
  });

  const handleGenerate = async (sector?: SectorData) => {
    setError(null);
    if (!cityInput.trim()) {
      setError("Please enter city name");
      return;
    }
    if (!sectorInput.trim() && !sector) {
      setError("Please enter sector or locality");
      return;
    }

    setIsLoading(true);
    let target: SectorData;

    if (sector) {
      target = { ...sector };
    } else {
      const exactMatch = NOIDA_SECTORS.find(s => s.name.toLowerCase() === sectorInput.toLowerCase());
      if (exactMatch) {
        target = { ...exactMatch };
      } else {
        target = generateMockSector(sectorInput);
      }
    }

    const apiLandmarks = await fetchLocalLandmarks(target.name);
    
    if (apiLandmarks.length > 0) {
      target.infrastructure = apiLandmarks;
    } else if (target.infrastructure.length === 0) {
      target.infrastructure = [
        { name: 'Local Public Transit', category: 'Connectivity', importance: `${target.name} Hub`, icon: '🚇' },
        { name: 'Regional Healthcare Centre', category: 'Hospital', importance: `${target.name} Area`, icon: '🏥' },
        { name: 'Primary Educational Institute', category: 'Education', icon: '🏫' }
      ];
    }

    setActiveSector(target);
    setShowResults(true);
    setSectorInput(target.name);
    setIsSuggesting(false);
    setIsLoading(false);
    
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
              Analyze real-time landmarks and infrastructure for Noida sectors using Nominatim Intelligence.
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
                  <label htmlFor="sector" className="absolute left-5 top-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-[10px]">Sector / Locality (e.g. Sector 62)</label>

                  {isSuggesting && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Noida Sectors</span>
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

                <button 
                  disabled={isLoading}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group min-w-[200px] disabled:opacity-70" 
                  onClick={() => handleGenerate()}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Analyzing...
                    </span>
                  ) : (
                    <>
                      Generate Report
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </>
                  )}
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
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Locality Analysis: {cityInput}</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">{activeSector.name}</h2>
              </div>
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
                   <p className="mt-4 text-xs text-slate-400">Connectivity and landmark data fetched from Nominatim Intelligence Engine.</p>
                </div>

                {/* Qualitative Infrastructure Section */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">🏢</span>
                    Famous & Important Landmarks
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(groupedInfra).length > 0 ? (
                      Object.entries(groupedInfra).map(([category, items]: [string, InfrastructureItem[]]) => (
                        <div key={category} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                            <span className="text-xl">{items[0].icon}</span> {category}
                          </h4>
                          <ul className="space-y-6">
                            {items.map((item, idx) => (
                              <li key={idx} className="group">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.name}</span>
                                  {/* Transit / Line Information Display */}
                                  <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{category}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">Near {activeSector.name}</span>
                                    </div>
                                    {item.importance && (
                                      <span className="text-[10px] text-emerald-600 font-bold tracking-tight italic">
                                        {item.importance}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 italic">No specific famous landmarks found via API for this exact locality. Try Sector 18 or Sector 62.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Preview */}
                <div className="aspect-[21/9] w-full bg-slate-100 rounded-[40px] relative flex items-center justify-center overflow-hidden border border-slate-200 shadow-xl group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
                  <div className="relative z-10 text-center px-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">📍</div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">POI Visual Explorer</h4>
                    <p className="text-slate-500 text-sm">Map visualization of {activeSector.name} landmarks.</p>
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
              { title: 'Locality Search', desc: 'Real-time search using Nominatim OpenStreetMap API for specific Noida sectors.', icon: '🏢' },
              { title: 'Landmark Filtering', desc: 'Filtering system for prominent Hospitals, Malls, and Educational Institutes.', icon: '📡' },
              { title: 'Score Computation', desc: 'Weighted scoring logic across connectivity, healthcare, and employment hub proximity.', icon: '🧠' },
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
            <p className="text-slate-400 text-xs">© 2024 RealEstate MPF. Demo Version with OpenStreetMap API Integration.</p>
            <span className="px-5 py-1.5 bg-slate-200 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">Live Landmarks Beta</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
