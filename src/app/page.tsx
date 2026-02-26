'use client'

import { useState, useMemo } from 'react'
import citiesData from '@/data/cities.json'
import { Shield, Users, Search, ListFilter, TrendingUp, Globe2, CreditCard, X } from 'lucide-react'

// --- Types ---

type SortOption = 'total' | 'rent' | 'safety' | 'expat'

interface City {
  id: string
  name: string
  country: string
  description: string
  totalScore: number
  rentPrice1BR: number
  safetyIndex: number
  expatIndex: number
}

// --- Main Component ---

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('total')

  const filteredAndSortedCities = useMemo(() => {
    let result = (citiesData as City[]).filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    )

    result.sort((a, b) => {
      if (sortBy === 'total') return b.totalScore - a.totalScore
      if (sortBy === 'rent') return a.rentPrice1BR - b.rentPrice1BR
      if (sortBy === 'safety') return b.safetyIndex - a.safetyIndex
      if (sortBy === 'expat') return b.expatIndex - a.expatIndex
      return 0
    })

    return result
  }, [searchQuery, sortBy])

  return (
    <main className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 pb-12 pt-[env(safe-area-inset-top)]">
      <div className="max-w-4xl mx-auto pt-8 sm:pt-16">
        
        {/* Header Section */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-bold mb-4 tracking-wider uppercase shadow-sm">
            <Globe2 className="w-3 h-3" />
            Global Living Index
          </div>
          <h1 
            className="text-[clamp(1.5rem,8vw,2.25rem)] sm:text-4xl font-black text-slate-900 mb-1 tracking-tighter whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = '/city'}
          >
            WHERE SHOULD <span className="text-emerald-600">I LIVE?</span>
          </h1>
          <p className="text-[12px] sm:text-sm text-slate-400 font-medium tracking-tight">
            Discover your next city. Find the perfect place for your lifestyle.
          </p>
        </header>

        {/* Search & Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search city or country..."
              className="w-full pl-9 pr-10 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm h-[42px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex w-full sm:w-auto gap-1 p-1 bg-slate-200/50 rounded-xl h-[42px]">
            {(['total', 'rent', 'safety', 'expat'] as SortOption[]).map((option) => (
              <SortButton 
                key={option}
                active={sortBy === option} 
                onClick={() => setSortBy(option)} 
                label={option.charAt(0).toUpperCase() + option.slice(1)} 
              />
            ))}
          </div>
        </div>

        {/* Active Filters Info */}
        <div className="mb-4 flex flex-wrap items-center gap-2 px-1">
          <Badge icon={<ListFilter className="w-3 h-3" />} label={`${filteredAndSortedCities.length} Cities Found`} color="slate" />
          <Badge 
            icon={<TrendingUp className="w-3 h-3" />} 
            label={`Sorted by ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`} 
            color="emerald" 
          />
          {searchQuery && <Badge label={`Search: ${searchQuery}`} color="amber" />}
        </div>

        {/* City Listing */}
        <div className="grid gap-3 sm:gap-4">
          {filteredAndSortedCities.length > 0 ? (
            filteredAndSortedCities.map((city, index) => (
              <CityCard key={city.id} city={city} index={index} sortBy={sortBy} />
            ))
          ) : (
            <EmptyState onClear={() => setSearchQuery('')} />
          )}
        </div>

      </div>
    </main>
  )
}

// --- Sub-Components ---

function CityCard({ city, index, sortBy }: { city: City, index: number, sortBy: SortOption }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6">
      <div className="flex flex-col">
        {/* Header: Rank + Name + Score */}
        <div className="flex items-center gap-3 sm:gap-6 mb-1.5 sm:mb-1">
          <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-slate-800 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-black text-sm sm:text-xl">
            {index + 1}
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate leading-tight">{city.name}</h2>
                <span className="flex-shrink-0 text-[9px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                  {city.country}
                </span>
              </div>
              <div className={`flex flex-col items-center justify-center rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2 border transition-all ${sortBy === 'total' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                <span className={`text-[7px] sm:text-[9px] uppercase font-black tracking-widest ${sortBy === 'total' ? 'text-emerald-600/60' : 'text-slate-400'}`}>Score</span>
                <span className="text-lg sm:text-2xl font-black leading-none">{city.totalScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body: Description + Detail Scores */}
        <div className="pl-11 sm:pl-[72px]">
          <p className="text-slate-500 text-[13px] sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            {city.description}
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <ScoreItem icon={<CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />} label="Rent" value={`$${city.rentPrice1BR}`} active={sortBy === 'rent'} />
            <ScoreItem icon={<Shield className="w-3 h-3 sm:w-4 sm:h-4 text-sky-400" />} label="Safety" value={city.safetyIndex} active={sortBy === 'safety'} />
            <ScoreItem icon={<Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />} label="Expat" value={city.expatIndex} active={sortBy === 'expat'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SortButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-1 sm:px-6 rounded-lg sm:rounded-xl text-[12px] sm:text-sm font-bold transition-all h-full ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

function Badge({ icon, label, color }: { icon?: React.ReactNode, label: string, color: 'emerald' | 'slate' | 'amber' }) {
  const styles = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    slate: 'bg-white border-slate-200 text-slate-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-700'
  }
  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 border rounded-full text-[10px] sm:text-xs font-black ${styles[color]}`}>
      {icon} {label}
    </div>
  )
}

function ScoreItem({ icon, label, value, active }: { icon: React.ReactNode, label: string, value: string | number, active: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${active ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-50'}`}>
      <div className="flex items-center gap-1 mb-1">
        <div className="flex-shrink-0 scale-90 sm:scale-100">{icon}</div>
        <span className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 leading-none truncate">{label}</span>
      </div>
      <div className="flex flex-col min-w-0 items-center">
        <span className="text-[11px] sm:text-base font-black text-slate-900 leading-none">{value}</span>
      </div>
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
      <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 font-bold text-xl">No Cities Found</p>
      <button 
        onClick={onClear} 
        className="mt-4 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
      >
        Clear Search
      </button>
    </div>
  )
}
