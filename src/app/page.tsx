'use client'

import { useState, useMemo } from 'react'
import citiesData from '@/data/cities.json'
import { Shield, Users, Search, ListFilter, TrendingUp, Globe2, CreditCard } from 'lucide-react'

type SortOption = 'total' | 'rent' | 'safety' | 'expat'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('total')

  const filteredAndSortedCities = useMemo(() => {
    let result = citiesData.filter(city => 
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
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold mb-4 tracking-wider uppercase">
            <Globe2 className="w-3 h-3" />
            Global Relocation Index
          </div>
          <h1 
            className="text-3xl font-black text-slate-900 sm:text-4xl mb-4 tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = '/'}
          >
            WHERE SHOULD <span className="text-emerald-600">I LIVE?</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Discover your next home. Find the perfect city that fits your budget and lifestyle.
          </p>
        </header>

        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search city or country..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-200/50 rounded-xl">
            <SortButton active={sortBy === 'total'} onClick={() => setSortBy('total')} label="Overall" />
            <SortButton active={sortBy === 'rent'} onClick={() => setSortBy('rent')} label="Rent" />
            <SortButton active={sortBy === 'safety'} onClick={() => setSortBy('safety')} label="Safety" />
            <SortButton active={sortBy === 'expat'} onClick={() => setSortBy('expat')} label="Expat" />
          </div>
        </div>

        {/* Status Info */}
        <div className="mb-6 flex flex-wrap items-center gap-2 px-1">
          <Badge icon={<ListFilter className="w-3 h-3" />} label={`${filteredAndSortedCities.length} Cities Found`} color="slate" />
          <Badge 
            icon={<TrendingUp className="w-3 h-3" />} 
            label={`Sorted by ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`} 
            color="emerald" 
          />
          {searchQuery && <Badge label={`Search: ${searchQuery}`} color="amber" />}
        </div>

        {/* City Cards */}
        <div className="grid gap-4">
          {filteredAndSortedCities.length > 0 ? (
            filteredAndSortedCities.map((city, index) => (
              <div 
                key={city.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center font-black text-lg">
                    {index + 1}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{city.name}</h2>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {city.country}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-snug">{city.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                    <ScoreItem icon={<CreditCard className="w-3.5 h-3.5 text-amber-400" />} label="Rent" value={`$${city.rentPrice1BR}`} active={sortBy === 'rent'} />
                    <ScoreItem icon={<Shield className="w-3.5 h-3.5 text-sky-400" />} label="Safety" value={city.safetyIndex} active={sortBy === 'safety'} />
                    <ScoreItem icon={<Users className="w-3.5 h-3.5 text-indigo-400" />} label="Expat" value={city.expatIndex} active={sortBy === 'expat'} />
                    
                    <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 border-2 transition-all ${sortBy === 'total' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                      <span className={`text-[8px] uppercase font-black tracking-widest mb-0.5 ${sortBy === 'total' ? 'text-emerald-600/60' : 'text-slate-400'}`}>Total</span>
                      <span className="text-xl font-black">{city.totalScore}</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-slate-100">
                  <ProgressMini label="Rent Score" score={city.rentScore} color="bg-amber-400" />
                  <ProgressMini label="Safety Score" score={city.safetyIndex} color="bg-sky-400" />
                  <ProgressMini label="Expat Score" score={city.expatIndex} color="bg-indigo-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-xl">No cities found.</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors">Clear search</button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function SortButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
    <div className={`flex items-center gap-1 px-2.5 py-1 border rounded-full text-[10px] font-black ${styles[color]}`}>
      {icon} {label}
    </div>
  )
}

function ScoreItem({ icon, label, value, active }: { icon: React.ReactNode, label: string, value: string | number, active: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${active ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-50'}`}>
      <div className={`flex items-center gap-1 text-[8px] uppercase font-black tracking-widest mb-1 text-slate-400`}>
        {icon} {label}
      </div>
      <div className={`text-sm font-black text-slate-900`}>{value}</div>
    </div>
  )
}

function ProgressMini({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-slate-900">{Math.round(score)}</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} opacity-70 transition-all duration-700`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  )
}
