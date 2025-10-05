"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { storageService } from '@/lib/storage'
import { Transaction, DayData } from '@/lib/types'
import { formatCurrency, formatDateShort, getCalendarDays, groupTransactionsByDate } from '@/lib/utils'

export function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dayData, setDayData] = useState<DayData[]>([])

  useEffect(() => {
    const loadedTransactions = storageService.getTransactions()
    setTransactions(loadedTransactions)
    setDayData(groupTransactionsByDate(loadedTransactions))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const calendarDays = getCalendarDays(year, month)

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(month - 1)
    } else {
      newDate.setMonth(month + 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDay = new Date(selectedDay)
    if (direction === 'prev') {
      newDay.setDate(selectedDay.getDate() - 1)
    } else {
      newDay.setDate(selectedDay.getDate() + 1)
    }
    setSelectedDay(newDay)
    
    // Atualizar o mês atual se necessário
    if (newDay.getMonth() !== currentDate.getMonth() || newDay.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(newDay.getFullYear(), newDay.getMonth(), 1))
    }
  }

  const getDayInfo = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return dayData.find(d => d.date === dateStr)
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const selectedDayInfo = selectedDate ? dayData.find(d => d.date === selectedDate) : null

  const monthName = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })

  const selectedDayName = selectedDay.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="p-4 space-y-6">
      {/* Header com navegação mensal */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} className="text-[#FF7A00]" />
        </button>
        
        <h2 className="text-xl font-bold text-[#222222] capitalize">
          {monthName}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={24} className="text-[#FF7A00]" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-[#9B9B9B] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayInfo = getDayInfo(date)
            const dateStr = date.toISOString().split('T')[0]
            const isSelected = selectedDate === dateStr
            const isSelectedDay = date.toDateString() === selectedDay.toDateString()
            const hasTransactions = dayInfo && dayInfo.transactions.length > 0
            
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(isSelected ? null : dateStr)
                  setSelectedDay(date)
                }}
                className={`aspect-square flex flex-col items-center justify-center p-1 rounded-lg text-sm transition-all ${
                  !isCurrentMonth(date)
                    ? 'text-gray-300'
                    : isSelected
                    ? 'bg-[#FF7A00] text-white'
                    : isSelectedDay
                    ? 'bg-orange-200 text-[#FF7A00] font-bold ring-2 ring-[#FF7A00]'
                    : isToday(date)
                    ? 'bg-orange-100 text-[#FF7A00] font-bold'
                    : hasTransactions
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{date.getDate()}</span>
                {hasTransactions && (
                  <div className="flex space-x-1 mt-1">
                    {dayInfo.income > 0 && (
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    )}
                    {dayInfo.expenses > 0 && (
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayInfo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#222222]">
              {new Date(selectedDate!).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h3>
            <div className="text-right">
              <div className="text-sm text-[#9B9B9B]">Saldo do dia</div>
              <div className={`font-bold ${
                selectedDayInfo.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(selectedDayInfo.balance)}
              </div>
            </div>
          </div>

          {/* Day Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-sm text-green-600">Receitas</div>
              <div className="font-bold text-green-600">
                {formatCurrency(selectedDayInfo.income)}
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <div className="text-sm text-red-600">Despesas</div>
              <div className="font-bold text-red-600">
                {formatCurrency(selectedDayInfo.expenses)}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            <h4 className="font-medium text-[#222222]">Transações</h4>
            {selectedDayInfo.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: transaction.category.color }}
                  >
                    {transaction.category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#222222]">
                      {transaction.category.name}
                    </div>
                    {transaction.note && (
                      <div className="text-sm text-[#9B9B9B]">
                        {transaction.note}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-bold text-[#222222] mb-4">Resumo do Mês</h3>
        
        {(() => {
          const monthTransactions = transactions.filter(t => {
            const transactionMonth = new Date(t.date).getMonth()
            const transactionYear = new Date(t.date).getFullYear()
            return transactionMonth === month && transactionYear === year
          })
          
          const monthIncome = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
          
          const monthExpenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
          
          const monthBalance = monthIncome - monthExpenses
          
          return (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-sm text-green-600">Receitas</div>
                <div className="font-bold text-green-600">
                  {formatCurrency(monthIncome)}
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-sm text-red-600">Despesas</div>
                <div className="font-bold text-red-600">
                  {formatCurrency(monthExpenses)}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-sm text-[#9B9B9B]">Saldo</div>
                <div className={`font-bold ${
                  monthBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(monthBalance)}
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}