import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PROVINCES, DISTRICTS, getSectorsForDistrict, getCellsForSector } from '../data/locations';
import { SKILL_CATEGORIES } from '../data/mockData';
import { Search, MapPin, Grid, Star, Sparkles, Filter, SlidersHorizontal, Eye } from 'lucide-react';

export const SearchFilters: React.FC = () => {
  const { 
    workers, 
    blockedUserIds, 
    setSelectedWorkerId, 
    setCurrentTab, 
    language 
  } = useApp();

  // Search/Filters term states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [onlyPremium, setOnlyPremium] = useState(false);

  // Cascading Location selections
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');

  // Dropdown options lists
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [sectorList, setSectorList] = useState<string[]>([]);
  const [cellList, setCellList] = useState<string[]>([]);

  // Toggle filter drawer state on mobile
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Sync Cascades
  useEffect(() => {
    if (selectedProvince) {
      setDistrictList(DISTRICTS[selectedProvince] || []);
      setSelectedDistrict('');
      setSelectedSector('');
      setSelectedCell('');
    } else {
      setDistrictList([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setSectorList(getSectorsForDistrict(selectedDistrict));
      setSelectedSector('');
      setSelectedCell('');
    } else {
      setSectorList([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      setCellList(getCellsForSector(selectedSector));
      setSelectedCell('');
    } else {
      setCellList([]);
    }
  }, [selectedSector]);

  // Clears location fields
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkill('');
    setSelectedExperience('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setOnlyPremium(false);
  };

  // Main querying pipeline
  const filteredWorkers = workers
    .filter(worker => {
      // 1. Hide suspended accounts
      if (worker.isSuspended) return false;

      // 2. Hide blocked accounts
      if (blockedUserIds.includes(worker.id)) return false;

      // 3. Search text term matching (Name or Specific Trade description)
      const matchesSearch = searchTerm === '' ||
        worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.location.sector.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 4. Match skill
      const matchesSkill = selectedSkill === '' || worker.category === selectedSkill;

      // 5. Match experience
      const matchesExp = selectedExperience === '' || worker.experience === selectedExperience;

      // 6. Match locations
      const matchesProvince = selectedProvince === '' || worker.location.province === selectedProvince;
      const matchesDistrict = selectedDistrict === '' || worker.location.district === selectedDistrict;
      const matchesSector = selectedSector === '' || worker.location.sector === selectedSector;
      const matchesCell = selectedCell === '' || worker.location.cell === selectedCell;

      // 7. Match premium
      const matchesPremium = !onlyPremium || worker.isPremium;

      return matchesSearch && matchesSkill && matchesExp && matchesProvince && matchesDistrict && matchesSector && matchesCell && matchesPremium;
    })
    // Crucial rule: PREMIUM/BOOSTED WORKERS CARDS APPEAR AND RANK AT THE ABSOLUTE TOP OF RESULTS
    .sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      // Secondary sort by highest rating
      return b.rating - a.rating;
    });

  const handleOpenWorkerProfile = (id: string) => {
    setSelectedWorkerId(id);
    // Profile rendering handles detail loading
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto items-stretch" id="search-section">
      
      {/* 1. FILTER SIDEBAR CONTROLS */}
      <aside className={`lg:w-80 w-full bg-[#111111] border border-white/10 rounded-2xl p-5 shadow-2xl text-left flex-shrink-0 ${
        showFiltersDrawer ? 'block' : 'hidden lg:block'
      }`} id="filter-sidebar">
        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
          <span className="text-sm font-black uppercase text-white flex items-center gap-1.5">
            <SlidersHorizontal size={16} className="text-[#00A550]" />
            {language === 'rw' ? 'KAYUNGURURA IMYREGO' : 'Search Controls'}
          </span>
          <button 
            onClick={clearFilters}
            className="text-[10px] text-red-400 hover:underline hover:text-red-500 uppercase font-black cursor-pointer"
            id="btn-clear-filters"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Skill category Filter */}
          <div className="flex flex-col gap-1" id="filter-group-skill">
            <label className="text-[10px] text-gray-300 uppercase font-black">Trade Specialty</label>
            <select 
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer focus:border-[#00A550] outline-none"
              id="filter-skill"
            >
              <option value="">-- All Trades --</option>
              {SKILL_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Experience level filter */}
          <div className="flex flex-col gap-1" id="filter-group-exp">
            <label className="text-[10px] text-gray-300 uppercase font-black">Grade / Rank</label>
            <select 
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer focus:border-[#00A550] outline-none"
              id="filter-experience"
            >
              <option value="">-- All Levels --</option>
              <option value="Beginner">Beginner (Ugitangira)</option>
              <option value="Intermediate">Intermediate (Ugereranyije)</option>
              <option value="Expert">Expert (Inararibonye)</option>
            </select>
          </div>

          {/* LOCATION CASCADE DROPDOWNS ONLY - NO FREE TEXT */}
          <div className="border border-white/10 bg-black rounded-xl p-3 flex flex-col gap-3" id="filter-locations-bento">
            <span className="text-[9px] uppercase tracking-wider text-[#00A550] font-black flex items-center gap-1">
              <MapPin size={11} /> Regional Boundary
            </span>

            {/* Province drop */}
            <div className="flex flex-col gap-0.5" id="f-province-drop">
              <label className="text-[9px] text-gray-400 uppercase font-black">Province</label>
              <select 
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase cursor-pointer focus:border-[#00A550] outline-none"
                id="filter-province"
              >
                <option value="">-- All Provinces --</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* District drop */}
            <div className="flex flex-col gap-0.5" id="f-district-drop">
              <label className="text-[9px] text-gray-400 uppercase font-black">District</label>
              <select 
                value={selectedDistrict}
                disabled={!selectedProvince}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-[#151515] disabled:text-gray-600 cursor-pointer focus:border-[#00A550] outline-none"
                id="filter-district"
              >
                <option value="">-- All Districts --</option>
                {districtList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Sector drop */}
            <div className="flex flex-col gap-0.5" id="f-sector-drop">
              <label className="text-[9px] text-gray-400 uppercase font-black">Sector</label>
              <select 
                value={selectedSector}
                disabled={!selectedDistrict}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-[#151515] disabled:text-gray-600 cursor-pointer focus:border-[#00A550] outline-none"
                id="filter-sector"
              >
                <option value="">-- All Sectors --</option>
                {sectorList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Cell drop */}
            <div className="flex flex-col gap-0.5" id="f-cell-drop">
              <label className="text-[9px] text-gray-400 uppercase font-black">Cell</label>
              <select 
                value={selectedCell}
                disabled={!selectedSector}
                onChange={(e) => setSelectedCell(e.target.value)}
                className="w-full border border-white/15 p-2 rounded-xl text-xs bg-black text-white font-bold uppercase disabled:bg-[#151515] disabled:text-gray-600 cursor-pointer focus:border-[#00A550] outline-none"
                id="filter-cell"
              >
                <option value="">-- All Cells --</option>
                {cellList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Boosted workers toggle check */}
          <label className="flex items-center gap-3 bg-[#00A550]/5 border border-[#00A550]/20 p-3 rounded-xl cursor-pointer hover:bg-[#002D15] transition-colors" id="filter-cb-premium">
            <input 
              type="checkbox" 
              checked={onlyPremium}
              onChange={(e) => setOnlyPremium(e.target.checked)}
              className="accent-[#00A550] w-4.5 h-4.5 rounded text-[#00A550]"
              id="cb-premium"
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles size={11} className="text-[#00A550]" /> Boosted Only
              </span>
              <span className="text-[8px] text-gray-400 uppercase">Featured workers of the month</span>
            </div>
          </label>
        </div>
      </aside>

      {/* 2. RESULTS CONTAINER */}
      <main className="flex-1 flex flex-col gap-4 text-left" id="search-results-section">
        
        {/* Search header & Mobile filter trigger */}
        <div className="flex flex-col sm:flex-row gap-3" id="results-search-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={language === 'rw' ? 'Shaka umukozi mu mazina...' : 'Query worker by full name or keyword...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-white/15 pl-11 pr-4 py-3 bg-[#111111] text-white font-bold rounded-xl text-xs uppercase outline-none focus:border-[#00D256]"
              id="results-search-input"
            />
          </div>

          <button 
            type="button"
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className="lg:hidden bg-[#111111] text-white border border-white/15 p-3 rounded-xl text-xs uppercase font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
            id="btn-toggle-filters-mobile"
          >
            <Filter size={16} />
            Filters ({showFiltersDrawer ? 'Close' : 'Open'})
          </button>
        </div>

        {/* Counter label */}
        <div className="flex justify-between items-center" id="results-counter-row">
          <span className="text-[11px] uppercase tracking-wide text-gray-400">
            Registered matches: <span className="text-white font-black underline">{filteredWorkers.length} found</span>
          </span>
          <span className="text-[10px] text-emerald-400 bg-[#00A550]/10 border border-[#00A550]/20 rounded px-2.5 py-0.5 uppercase">
            💡 Premium Listings Appear First
          </span>
        </div>

        {/* Dynamic Card Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="py-20 bg-[#111111] border border-dashed border-white/15 rounded-2xl text-center px-6" id="no-results-alert">
            <SlidersHorizontal className="text-[#00A550] w-12 h-12 mx-auto mb-4 animate-pulse" />
            <h3 className="text-sm font-black uppercase text-white">No matching candidates</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto uppercase leading-relaxed font-sans">
              Try clarifying your location coordinates, clearing active filters, or typing an alternative skill search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="workers-grid-items">
            {filteredWorkers.map((worker) => (
              <div 
                key={worker.id}
                onClick={() => handleOpenWorkerProfile(worker.id)}
                className={`group border hover:translate-y-[-2px] transition-all bg-[#111111] p-4.5 rounded-2xl text-left relative cursor-pointer flex flex-col justify-between ${
                  worker.isPremium 
                    ? 'border-[#00A550] shadow-[4px_4px_0px_0px_rgba(0,165,80,0.15)] bg-gradient-to-br from-[#111111] to-[#011B0E]/20' 
                    : 'border-white/10 hover:border-[#00A550]'
                }`}
                id={`worker-card-${worker.id}`}
              >
                {/* Premium tag overlay */}
                {worker.isPremium && (
                  <span className="absolute top-3.5 right-3.5 bg-black text-[#00A550] text-[8px] tracking-widest font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#00A550] shadow-sm z-10 animate-pulse">
                    <Sparkles size={8} /> Boosted
                  </span>
                )}

                {/* Profile top: photo, name, skill, verified badge */}
                <div className="flex gap-4 items-start" id={`worker-card-header-${worker.id}`}>
                  <img 
                    src={worker.photoUrl} 
                    alt={worker.fullName} 
                    className="w-14 h-14 rounded-full bg-black border border-white/15 object-cover"
                    referrerPolicy="no-referrer"
                    id={`worker-card-photo-${worker.id}`}
                  />
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-black uppercase text-white line-clamp-1 group-hover:text-[#00a550] transition-colors">
                        {worker.fullName}
                      </h3>
                      {worker.isVerified && (
                        <span className="bg-[#00A550]/15 text-emerald-400 text-[7px] font-black uppercase px-1.5 py-0.2 rounded border border-[#00A550]/20">
                          ID Verified
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-450 uppercase mt-0.5 font-bold">
                      {worker.category}
                    </span>

                    {/* Ratings row */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex text-[#FFCC00]">
                        <Star size={11} fill="currentColor" />
                      </div>
                      <span className="text-[10px] text-white font-extrabold">{worker.rating}</span>
                      <span className="text-[9px] text-gray-400 capitalize">
                        ({worker.reviews.length} feedback)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card middle: Location description and details */}
                <div className="mt-4 border-t border-dashed border-white/5 pt-3.5 flex flex-col gap-1.5 text-[10px] text-gray-300" id={`worker-card-body-${worker.id}`}>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#00A550] shrink-0" />
                    <span>
                      {worker.location.district} › {worker.location.sector} › <span className="text-[#00A550] font-black">{worker.location.cell}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-gray-400 mt-2">
                    <span className="bg-black border border-white/10 text-gray-300 px-2 py-0.5 rounded uppercase font-black">
                      Grade: {worker.experience}
                    </span>
                    <span className="text-white group-hover:underline flex items-center gap-1 font-black uppercase tracking-wider">
                      View Profile <Eye size={12} className="text-[#00A550]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
