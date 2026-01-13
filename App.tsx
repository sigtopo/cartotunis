
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Download, Heart, Menu, X, 
  Globe, Move, ExternalLink,
  Facebook, Linkedin, Table as TableIcon
} from 'lucide-react';
import { MAP_DATA, INDEX_IMAGE_URL } from './constants.ts';
import { MapArea } from './types.ts';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.631 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TUNISIA_RED = '#E70013';
const TUNISIA_GREEN = '#22c55e';
const LIGHT_GREEN = '#4ade80';

const MapCard: React.FC<{
  map: MapArea;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDownload: (id: string) => void;
  onViewOnMap: (id: string) => void;
  isSelected?: boolean;
}> = ({ map, isFavorite, onToggleFavorite, onDownload, onViewOnMap, isSelected }) => (
  <div className={`group bg-white rounded-xl border-2 ${isSelected ? 'border-black ring-4 ring-black/5' : 'border-slate-100'} hover:border-[${TUNISIA_RED}] hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden`}>
    <div className="p-6 flex-1">
      <div className="flex justify-between items-start mb-4">
        <span className={`bg-[${TUNISIA_RED}] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tight`}>
          SHEET {map.id}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(map.id); }} 
          className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-rose-50 text-rose-500' : 'text-slate-200 hover:bg-slate-50 hover:text-rose-400'}`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <h3 className="text-black font-black text-2xl leading-tight mb-2 group-hover:text-[${TUNISIA_RED}] transition-colors">
        {map.name}
      </h3>
      <p className="text-black/50 text-xs font-bold uppercase tracking-widest">Tunisia • 1/50 000</p>
    </div>
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
      <button 
        onClick={() => onViewOnMap(map.id)}
        className="flex-1 bg-white border-2 border-black text-black hover:bg-black hover:text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <MapIcon className="w-4 h-4" /> عرض الخريطة
      </button>
      <a 
        href={map.href} 
        target="_blank" 
        rel="noreferrer" 
        onClick={() => onDownload(map.id)}
        className={`bg-[${TUNISIA_RED}] hover:brightness-110 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center`}
        title="télécharger"
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
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl overflow-hidden z-[110] relative">
      <button 
        onClick={onClose}
        className="lg:hidden absolute left-4 top-4 p-2 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors z-[120]"
      >
        <X className="w-6 h-6 text-black" />
      </button>

      <div className={`p-6 border-b-4 border-[${TUNISIA_RED}] bg-white pt-16 lg:pt-6`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`bg-[${TUNISIA_RED}] p-2 rounded-full`}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-black leading-none">خرائط تونس الطبوغرافية 1/50000</h1>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Digital Index</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 w-4 h-4" />
          <input
            type="text"
            dir="rtl"
            placeholder="بحث سريع برقم أو اسم..."
            className={`w-full pr-10 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-[${TUNISIA_RED}] transition-all text-base font-black text-black`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
        {filteredMaps.map((map) => (
          <div key={map.id} className="flex gap-2">
            <button
              onClick={() => onSelect(map.id)}
              className={`flex-1 p-5 rounded-xl border-2 text-right transition-all flex items-center gap-4 group ${selectedId === map.id ? `bg-[${TUNISIA_RED}] border-[${TUNISIA_RED}] text-white` : 'bg-white border-slate-100 hover:border-slate-300 text-black'}`}
            >
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${selectedId === map.id ? 'bg-white text-black' : `bg-[${TUNISIA_RED}]/10 text-[${TUNISIA_RED}]`}`}>
                {map.id}
              </span>
              <span className="text-lg font-black flex-1 truncate">{map.name}</span>
            </button>
            <a
              href={map.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => onDownload(map.id)}
              className="hidden lg:flex p-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl items-center justify-center transition-all active:scale-95"
              title="تحميل"
            >
              <Download className="w-6 h-6" />
            </a>
          </div>
        ))}
        {filteredMaps.length === 0 && (
          <p className="text-center text-black/30 text-xs py-10 font-black">لا توجد نتائج</p>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center justify-center gap-4 mb-3">
          <a href="https://www.facebook.com/jilitsig/" target="_blank" rel="noreferrer" className="social-icon bg-blue-600 text-white"><Facebook className="w-4 h-4" /></a>
          <a href="https://www.linkedin.com/in/Jilitelmostafa" target="_blank" rel="noreferrer" className="social-icon bg-blue-800 text-white"><Linkedin className="w-4 h-4" /></a>
        </div>
        <p className="text-[10px] font-black text-black/30 text-center uppercase tracking-widest">© 2025 Jilit • Tunisia Archive</p>
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
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all border-4 ${isQuickSearchOpen ? `bg-[${TUNISIA_RED}] text-white border-white` : 'bg-white text-black border-slate-100 hover:scale-105'}`} 
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
              dir="rtl"
              placeholder="ابحث بالاسم أو الرقم..."
              className="w-full px-6 py-5 outline-none font-black text-black text-base border-b-2 border-slate-50"
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
            />
            {quickSearchResults.map(m => (
              <button
                key={m.id}
                onClick={() => { onSelect(m.id); setIsQuickSearchOpen(false); }}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-right border-b border-slate-50 last:border-0"
              >
                <span className={`text-[10px] font-black text-white bg-[${TUNISIA_RED}] px-2.5 py-1 rounded-full`}>{m.id}</span>
                <span className="text-sm font-black text-black">{m.name}</span>
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
          <span className={`text-[${TUNISIA_RED}] text-[10px] font-black uppercase tracking-widest mb-1`}>Sheet {hoveredMap.id}</span>
          <span className="text-black text-xl font-black">{hoveredMap.name}</span>
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
                    fill: (isSelected || isHovered) ? `${TUNISIA_RED}44` : 'transparent',
                    stroke: (isSelected || isHovered) ? TUNISIA_RED : `${TUNISIA_RED}22`,
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

      <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-8 py-4 rounded-full border-2 border-black shadow-2xl text-xs font-black text-black items-center gap-6">
        <div className="flex items-center gap-2"><Move className="w-4 h-4" /> اسحب للتحريك</div>
        <div className="w-px h-5 bg-black/10"></div>
        <div className="flex items-center gap-2">استخدم العجلة للتقريب</div>
        <div className="w-px h-5 bg-black/10"></div>
        <div className={`text-[${TUNISIA_RED}] font-black`}>{Math.round(scale * 100)}%</div>
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
  const whatsappLink = `https://wa.me/212668090285?text=${encodeURIComponent("مرحبا، استفسار بخصوص أرشيف الخرائط الطبوغرافية التونسية.")}`;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden text-black antialiased" dir="rtl">
      
      {/* Mobile Header */}
      <div className={`lg:hidden flex items-center justify-between p-4 bg-white border-b-4 border-[${TUNISIA_RED}] z-50`}>
        <div className="flex items-center gap-2">
          <div className={`bg-[${TUNISIA_RED}] p-2 rounded-full`}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-black text-base">خرائط تونس الطبوغرافية 1/50000</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className={`p-3 bg-[${TUNISIA_RED}] text-white rounded-xl shadow-lg active:scale-95`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-[120] w-full lg:w-[420px] h-full transition-transform duration-500 ease-in-out`}>
        <Sidebar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaps={filteredMaps} 
          selectedId={selectedId} 
          onSelect={(id) => { setSelectedId(id); setViewMode('map'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          onClose={() => setIsSidebarOpen(false)}
          onDownload={incrementDownload}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-white">
        {/* Source Logo */}
        <div className="fixed bottom-8 left-8 z-[80] flex flex-col items-center">
          {showSourceToast && (
            <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <a href="https://jemecasseausoleil.blogspot.com/" target="_blank" rel="noreferrer" className="bg-black text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black">
                المصدر: Je Me Casse Au Soleil <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
          <button onClick={() => setShowSourceToast(!showSourceToast)} className={`w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-slate-100 overflow-hidden`}>
            <img src="https://jemecasseausoleil.blogspot.com/favicon.ico" alt="Source" className="w-7 h-7" />
          </button>
        </div>

        {/* WhatsApp Button */}
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[80]">
          <WhatsAppIcon />
        </a>

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

        {/* Floating Tool - To Switch to List view if needed */}
        <button 
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[130] lg:hidden bg-black text-white px-8 py-4 rounded-full font-black text-sm flex items-center gap-3 shadow-2xl active:scale-95 transition-all border-2 border-white`}
        >
          {viewMode === 'map' ? <><TableIcon className="w-5 h-5" /> عرض الفهرس</> : <><MapIcon className="w-5 h-5" /> عرض الخريطة</>}
        </button>

        {/* Selected Map Modal (Red and White themed, compact) */}
        {selectedMap && viewMode === 'map' && (
          <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-[110] w-[85%] max-w-[340px] animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-white p-6 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border-2 border-slate-100 flex flex-col items-center">
               <button onClick={() => setSelectedId(null)} className="absolute top-4 left-4 p-1.5 text-slate-300 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
               <span className={`text-[${TUNISIA_RED}] text-[10px] font-black uppercase tracking-[0.2em] mb-2`}>SHEET {selectedMap.id}</span>
               <h3 className="text-xl font-black text-black mb-6 text-center leading-none tracking-tight">{selectedMap.name}</h3>
               <button 
                onClick={() => { window.open(selectedMap.href, '_blank'); incrementDownload(selectedMap.id); }} 
                className={`w-full bg-[#4ade80] hover:bg-[#22c55e] text-white py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95`}
               >
                  <Download className="w-5 h-5" />  télécharger   
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
