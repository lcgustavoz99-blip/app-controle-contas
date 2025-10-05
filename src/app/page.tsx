"use client"

import { useState } from 'react'
import { BottomNavigation } from '@/components/BottomNavigation'
import { RegisterScreen } from '@/components/screens/RegisterScreen'
import { CalendarScreen } from '@/components/screens/CalendarScreen'
import { SummaryScreen } from '@/components/screens/SummaryScreen'
import { SettingsScreen } from '@/components/screens/SettingsScreen'

export default function Home() {
  const [activeTab, setActiveTab] = useState('register')

  const renderScreen = () => {
    switch (activeTab) {
      case 'register':
        return <RegisterScreen />
      case 'calendar':
        return <CalendarScreen />
      case 'summary':
        return <SummaryScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <RegisterScreen />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#FF7A00] text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">Controle de Contas</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}