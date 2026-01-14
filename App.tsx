
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Download, Heart, Menu, X, 
  Globe, Move, ExternalLink,
  Facebook, Linkedin, Table as TableIcon, MessageCircle
} from 'lucide-react';
import { MAP_DATA, INDEX_IMAGE_URL } from './constants.ts';
import { MapArea } from './types.ts';

const CUSTOM_ICON_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBQH6f47cVdJ1fU-DZmPPG5PnKrbZhyaVNBe-TL2S2l-_Y9aUEvH9lbu8zyDc0kVDStDYa-_Prj_MWv1EVRIEBfEPYK0KJ954k01sFojNVOHcG6KTLDnX0ahYVSA5H2R-MOqdVp0F1EZbHq-yyc0_qnFGHFsktcrq7mlsPxCny8oXcVQAPZyP2OJKv1g/w165-h165/134ef7f1-ea1d-4243-9cd2-6473f1337f19.png";
const SOURCE_FAVICON_URL = "https://jemecasseausoleil.blogspot.com/favicon.ico";
const SOURCE_ARTICLE_URL = "https://jemecasseausoleil.blogspot.com/2013/04/cartes-de-la-tunisie.html";
const LINKEDIN_URL = "https://www.linkedin.com/in/Jilitelmostafa";
const APP_TITLE = "Cartes topographiques de la Tunisie";

const TUNISIA_RED = '#E70013';
const SELECTION_GREEN = '#22c55e';

const MapCard: React.FC<{
  map: MapArea;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownload: (id: string) => void;
  onViewOnMap: (id: string) => void;
  isSelected?: boolean;
}> = ({ map, isFavorite, onToggleFavorite, onDownload, onViewOnMap, isSelected }) => (
  <div className={`group bg-white rounded-xl border-2 ${isSelected ? 'border-black ring-4 ring-black/5' : 'border-slate-100'} hover:border-[${SELECTION_GREEN}] hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden`}>
    <div className="p-6 flex-1">
      <div className="flex justify-between items-start mb-4">
        <span className={`bg-[${TUNISIA_RED}] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight`}>
          FEUILLE {map.id}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(map.id); }} 
          className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-rose-50 text-rose-500' : 'text-slate-200 hover:bg-slate-50 hover:text-rose-400'}`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <h3 className="text-black font-black text-2xl leading-tight mb-2 group-hover:text-[${SELECTION_GREEN}] transition-colors">
        {map.nameAr} <span className="block text-sm opacity-50 font-normal">{map.name}</span>
      </h3>
      <p className="text-black/50 text-xs font-bold uppercase tracking-widest">Tunisie • 1/50 000</p>
    </div>
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
      <button 
        onClick={() => onViewOnMap(map.id)}
        className="flex-1 bg-white border-2 border-black text-black hover:bg-black hover:text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <MapIcon className="w-4 h-4" /> Voir sur la carte
      </button>
      <a 
        href={map.href} 
        target="_blank" 
        rel="noreferrer" 
        onClick={() => onDownload(map.id)}
        className={`bg-[${SELECTION_GREEN}] hover:brightness-110 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center`}
        title="Télécharger"
      >
        <Download className="w-5 h-5" />
      </a>
    </div>
  </div>
);

const Sidebar: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredMaps: MapArea[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onDownload: (id: string) => void;
}> = ({ searchQuery, setSearchQuery, filteredMaps, selectedId, onSelect, onClose, onDownload }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xl overflow-hidden z-[110] relative" dir="ltr">
      <button 
        onClick={onClose}
        className="lg:hidden absolute right-4 top-4 p-2 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors z-[120]"
      >
        <X className="w-6 h-6 text-black" />
      </button>

      <div className={`p-6 border-b-4 border-[${TUNISIA_RED}] bg-white pt-16 lg:pt-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`bg-white p-0.5 rounded-full shadow-sm overflow-hidden border border-slate-100`}>
            <img src={CUSTOM_ICON_URL} alt="Logo" className="w-8 h-8 object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black text-black leading-none">{APP_TITLE}</h1>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Digital Index 1/50 000</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 w-4 h-4" />
          <input
            type="text"
            placeholder="Recherche par nom ou n°..."
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-[${TUNISIA_RED}] transition-all text-sm font-bold text-black`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white">
        {filteredMaps.map((map) => (
          <div key={map.id} className="flex gap-2">
            <button
              onClick={() => onSelect(map.id)}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 group ${selectedId === map.id ? `bg-[${SELECTION_GREEN}] border-[${SELECTION_GREEN}] text-white` : 'bg-white border-slate-100 hover:border-slate-300 text-black'}`}
            >
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedId === map.id ? 'bg-white text-black' : `bg-[${SELECTION_GREEN}]/10 text-[${SELECTION_GREEN}]`}`}>
                {map.id}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-black truncate">{map.name}</span>
                <span className={`text-[10px] ${selectedId === map.id ? 'text-white/70' : 'text-black/40'}`} dir="rtl">{map.nameAr}</span>
              </div>
            </button>
            <a
              href={map.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => onDownload(map.id)}
              className="hidden lg:flex p-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl items-center justify-center transition-all active:scale-95"
              title="Télécharger"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        ))}
        {filteredMaps.length === 0 && (
          <p className="text-center text-black/30 text-xs py-10 font-black">Aucun résultat</p>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-center gap-4 mb-3">
          <a href="https://www.facebook.com/jilitsig/" target="_blank" rel="noreferrer" className="social-icon bg-blue-600 text-white" title="Facebook"><Facebook className="w-4 h-4" /></a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="social-icon bg-blue-800 text-white" title="LinkedIn"><Linkedin className="w-4 h-4" /></a>
          <a href={SOURCE_ARTICLE_URL} target="_blank" rel="noreferrer" className="social-icon bg-amber-500 text-white" title="Blog"><Globe className="w-4 h-4" /></a>
        </div>
        <p className="text-[10px] font-black text-black/30 text-center uppercase tracking-widest">jilitsig@gmail.com</p>
      </div>
    </div>
  );
};

const InteractiveMap: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedId, onSelect, pan, setPan, scale, setScale }) => {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  
  const lastPos = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const handleFitToScreen = () => {
    if (!naturalSize || !mapContainerRef.current) return;
    const { width, height } = mapContainerRef.current.getBoundingClientRect();
    const scaleW = width / naturalSize.w;
    const scaleH = height / naturalSize.h;
    setScale(Math.min(scaleW, scaleH) * 0.95);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => setNaturalSize({ w: img.width, h: img.height });
  }, []);

  useEffect(() => {
    if (naturalSize && mapContainerRef.current) handleFitToScreen();
  }, [naturalSize]);

  useEffect(() => {
    if (isQuickSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isQuickSearchOpen]);

  useEffect(() => {
    if (selectedId && naturalSize) {
      const map = MAP_DATA.find(m => m.id === selectedId);
      if (map && map.coords) {
        let cx = 0, cy = 0;
        if (map.shape === 'rect') {
          cx = (map.coords[0] + map.coords[2]) / 2;
          cy = (map.coords[1] + map.coords[3]) / 2;
        } else {
          for (let i = 0; i < map.coords.length; i += 2) {
            cx += map.coords[i]; cy += map.coords[i+1];
          }
          cx /= (map.coords.length / 2); cy /= (map.coords.length / 2);
        }
        setPan({ x: (naturalSize.w/2 - cx), y: (naturalSize.h/2 - cy) });
        setScale(Math.max(scale, 1.5));
      }
    }
  }, [selectedId, naturalSize]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.min(Math.max(prev + (-e.deltaY * 0.001), 0.1), 10));
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    setMousePos({ x: clientX, y: clientY });
    if (!isDragging) return;
    setPan(prev => ({ x: prev.x + (clientX - lastPos.current.x), y: prev.y + (clientY - lastPos.current.y) }));
    lastPos.current = { x: clientX, y: clientY };
  };

  const transformStyle = useMemo(() => ({
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
    transformOrigin: 'center'
  }), [pan, scale]);

  const hoveredMap = useMemo(() => MAP_DATA.find(m => m.id === hoveredId), [hoveredId]);
  const quickSearchResults = useMemo(() => {
    if (!quickSearchQuery) return [];
    return MAP_DATA.filter(m => m.name.toLowerCase().includes(quickSearchQuery.toLowerCase()) || m.id.includes(quickSearchQuery) || m.nameAr?.includes(quickSearchQuery)).slice(0, 5);
  }, [quickSearchQuery]);

  return (
    <div 
      ref={mapContainerRef}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-100 select-none"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="absolute left-6 top-6 z-30">
        <button 
          onClick={() => setIsQuickSearchOpen(!isQuickSearchOpen)} 
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all border-4 ${isQuickSearchOpen ? `bg-[${SELECTION_GREEN}] text-white border-white` : 'bg-white text-black border-slate-100 hover:scale-105'}`} 
        >
          {isQuickSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
        </button>
      </div>

      <div className={`absolute top-6 right-6 bg-[#22c55e] text-white px-5 py-2.5 rounded-full font-black text-xs shadow-2xl z-30 border-2 border-white`} dir="ltr">
       TUNISIE 1/50000
      </div>

      {isQuickSearchOpen && (
        <div className="absolute top-24 left-6 w-80 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-slate-100 overflow-hidden">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Nom ou numéro..."
              className="w-full px-6 py-4 outline-none font-bold text-black text-sm border-b-2 border-slate-50"
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
            />
            {quickSearchResults.map(m => (
              <button
                key={m.id}
                onClick={() => { onSelect(m.id); setIsQuickSearchOpen(false); }}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <span className="text-sm font-bold text-black">{m.name}</span>
                <span className={`text-[9px] font-black text-white bg-[${SELECTION_GREEN}] px-2 py-0.5 rounded-full`}>{m.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hoveredMap && !isDragging && (
        <div 
          className="fixed pointer-events-none z-[100] bg-white px-6 py-4 rounded-3xl shadow-2xl border-2 border-black -translate-x-1/2 -translate-y-[120%] flex flex-col items-center animate-in fade-in zoom-in duration-200"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <span className={`text-[${SELECTION_GREEN}] text-[10px] font-black uppercase tracking-widest mb-1`}>FEUILLE {hoveredMap.id}</span>
          <span className="text-black text-xl font-black">{hoveredMap.name}</span>
          <span className="text-black/50 text-xs mt-1" dir="rtl">{hoveredMap.nameAr}</span>
        </div>
      )}

      <div 
        className="relative transition-transform duration-300 ease-out rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border-8 border-white"
        style={transformStyle}
      >
        <img src={INDEX_IMAGE_URL} alt="Tunisia Index" className="block max-w-none pointer-events-none" style={{ width: naturalSize?.w, height: naturalSize?.h }} />
        {naturalSize && (
          <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}>
            {MAP_DATA.map((map) => {
              if (!map.coords) return null;
              const isSelected = selectedId === map.id;
              const isHovered = hoveredId === map.id;
              const shapeProps = {
                onClick: (e: any) => { e.stopPropagation(); onSelect(map.id); },
                onMouseEnter: () => setHoveredId(map.id),
                onMouseLeave: () => setHoveredId(null),
                style: {
                    fill: (isSelected || isHovered) ? `${SELECTION_GREEN}44` : 'transparent',
                    stroke: (isSelected || isHovered) ? SELECTION_GREEN : `${SELECTION_GREEN}22`,
                    transition: 'all 0.2s ease'
                },
                className: "cursor-pointer",
                strokeWidth: (isSelected || isHovered) ? "3" : "0.5"
              };

              if (map.shape === 'rect' && map.coords.length === 4) {
                return <rect key={map.id} x={map.coords[0]} y={map.coords[1]} width={map.coords[2] - map.coords[0]} height={map.coords[3] - map.coords[1]} {...shapeProps} />;
              } else if (map.shape === 'poly') {
                const pts = [];
                for(let i=0; i<map.coords.length; i+=2) pts.push(`${map.coords[i]},${map.coords[i+1]}`);
                return <polygon key={map.id} points={pts.join(' ')} {...shapeProps} />;
              }
              return null;
            })}
          </svg>
        )}
      </div>

      <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-8 py-4 rounded-full border-2 border-black shadow-2xl text-[10px] font-black text-black items-center gap-6">
        <div className="flex items-center gap-2"><Move className="w-3 h-3" /> FAITES GLISSER POUR DÉPLACER</div>
        <div className="w-px h-5 bg-black/10"></div>
        <div className="flex items-center gap-2">MOLETTE POUR ZOOMER</div>
        <div className="w-px h-5 bg-black/10"></div>
        <div className={`text-[${SELECTION_GREEN}] font-black`}>{Math.round(scale * 100)}%</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); 
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSourceToast, setShowSourceToast] = useState(false);
  const [showContactButtons, setShowContactButtons] = useState(true);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('m-maps-favs') || '[]'); } catch { return []; }
  });
  
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('m-maps-downloads') || '{}'); } catch { return {}; }
  });

  useEffect(() => localStorage.setItem('m-maps-favs', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('m-maps-downloads', JSON.stringify(downloadCounts)), [downloadCounts]);

  const filteredMaps = useMemo(() => MAP_DATA.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.nameAr?.includes(q);
  }), [searchQuery]);

  const toggleFavorite = (id: string) => setFavorites(f => f.includes(id) ? f.filter(i => i !== id) : [...f, id]);
  const incrementDownload = (id: string) => setDownloadCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const selectedMap = useMemo(() => MAP_DATA.find(m => m.id === selectedId), [selectedId]);
  const whatsappLink = `https://wa.me/212668090285?text=${encodeURIComponent("Bonjour, j'ai une question concernant l'archive des cartes topographiques de la Tunisie.")}`;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden text-black antialiased">
      
      {/* Mobile Header */}
      <div className={`lg:hidden flex items-center justify-between p-4 bg-white border-b-4 border-[${TUNISIA_RED}] z-50`}>
        <div className="flex items-center gap-2">
          <img src={CUSTOM_ICON_URL} alt="Logo" className="w-8 h-8 rounded-full shadow-sm" />
          <span className="font-black text-black text-xs truncate max-w-[200px]">{APP_TITLE}</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className={`p-2 bg-[${TUNISIA_RED}] text-white rounded-lg shadow-lg active:scale-95`}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-[120] w-full lg:w-[320px] h-full transition-transform duration-500 ease-in-out`}>
        <Sidebar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaps={filteredMaps} 
          selectedId={selectedId} 
          onSelect={(id) => { setSelectedId(id); setViewMode('map'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          onClose={() => setIsSidebarOpen(false)}
          onDownload={incrementDownload}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-white">
        
        {/* Desktop Header - Only visible on computer */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 z-40">
          <div className="flex items-center gap-4">
            <img src={CUSTOM_ICON_URL} alt="Logo" className="w-10 h-10 rounded-full shadow-sm border border-slate-100" />
            <div>
              <h2 className="text-xl font-black text-black leading-none">{APP_TITLE}</h2>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Digital Index 1/50 000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">AMS L760 SERIES</span>
          </div>
        </header>

        {/* Source Logo (Smaller) */}
        <div className="fixed bottom-6 left-6 z-[80] flex flex-col items-center">
          {showSourceToast && (
            <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <a href={SOURCE_ARTICLE_URL} target="_blank" rel="noreferrer" className="bg-black text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-[10px] font-black">
                Source: Je Me Casse Au Soleil <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          <button onClick={() => setShowSourceToast(!showSourceToast)} className={`w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-slate-100 overflow-hidden`}>
            <img src={SOURCE_FAVICON_URL} alt="Source" className="w-6 h-6 object-contain" />
          </button>
        </div>

        {/* Floating Action Buttons (Smaller & Closable) */}
        {showContactButtons && (
          <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-[80]">
            <button 
              onClick={() => setShowContactButtons(false)}
              className="w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm mb-1"
              title="Fermer"
            >
              <X className="w-3 h-3" />
            </button>
            
            {/* WhatsApp Button */}
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all" title="WhatsApp">
              <MessageCircle size={18} fill="currentColor" />
            </a>
            
            {/* LinkedIn Button */}
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#0077B5] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all" title="LinkedIn">
              <Linkedin size={18} fill="currentColor" />
            </a>
          </div>
        )}

        {viewMode === 'map' ? (
          <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} pan={pan} setPan={setPan} scale={scale} setScale={setScale} />
        ) : (
          <div className="flex-1 overflow-auto bg-white p-8 lg:p-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                {filteredMaps.map(map => (
                  <MapCard 
                    key={map.id} map={map} 
                    isFavorite={favorites.includes(map.id)} 
                    onToggleFavorite={toggleFavorite} 
                    onDownload={incrementDownload} 
                    onViewOnMap={(id) => { setSelectedId(id); setViewMode('map'); }} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Map Modal (French Translation) */}
        {selectedMap && viewMode === 'map' && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] w-[85%] max-w-[300px] animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-slate-100 flex flex-col items-center">
               <button onClick={() => setSelectedId(null)} className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-black transition-colors"><X className="w-4 h-4" /></button>
               <span className={`text-[${TUNISIA_RED}] text-[9px] font-black uppercase tracking-[0.2em] mb-1`}>FEUILLE {selectedMap.id}</span>
               <h3 className="text-lg font-black text-black mb-1 text-center leading-none">{selectedMap.name}</h3>
               <p className="text-black/50 text-xs mb-5" dir="rtl">{selectedMap.nameAr}</p>
               <button 
                onClick={() => { window.open(selectedMap.href, '_blank'); incrementDownload(selectedMap.id); }} 
                className={`w-full bg-[#4ade80] hover:bg-[#22c55e] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95`}
               >
                  <Download className="w-4 h-4" />  Télécharger
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
