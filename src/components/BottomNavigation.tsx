"use client"

import { Plus, Calendar, BarChart3, Settings } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'register', label: 'Registrar', icon: Plus },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'summary', label: 'Resumo', icon: BarChart3 },
    { id: 'settings', label: 'Outros', icon: Settings }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#FF7A00] text-white shadow-lg' 
                  : 'text-[#9B9B9B] hover:text-[#FF7A00]'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}