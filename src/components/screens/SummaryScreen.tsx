"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { storageService } from '@/lib/storage'
import { Transaction } from '@/lib/types'
import { formatCurrency, getCategorySummary, getTransactionsByMonth } from '@/lib/utils'

export function SummaryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense')
  const [rankingType, setRankingType] = useState<'expense' | 'income'>('expense')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
  const [currentMonthData, setCurrentMonthData] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  })
  const [previousMonthData, setPreviousMonthData] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  })

  // Mock data for different months
  const mockDataByMonth = {
    '2025-10': { income: 3500, expenses: 2923, balance: 577 },
    '2025-09': { income: 3200, expenses: 2800, balance: 400 },
    '2025-11': { income: 4000, expenses: 3200, balance: 800 },
    '2025-08': { income: 2800, expenses: 2500, balance: 300 },
    '2025-12': { income: 4500, expenses: 3800, balance: 700 }
  }

  const getCurrentMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  const getPreviousMonthKey = (date: Date) => {
    const prevMonth = new Date(date)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    
    if (viewMode === 'month') {
      // Navegação por mês
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
    } else {
      // Navegação por ano
      if (direction === 'prev') {
        const newYear = newDate.getFullYear() - 1
        if (newYear >= 2000) { // Limite mínimo
          newDate.setFullYear(newYear)
        }
      } else {
        const newYear = newDate.getFullYear() + 1
        if (newYear <= 2100) { // Limite máximo
          newDate.setFullYear(newYear)
        }
      }
    }
    
    setSelectedDate(newDate)
  }

  useEffect(() => {
    const loadedTransactions = storageService.getTransactions()
    setTransactions(loadedTransactions)

    // Get current month data (mock or real)
    const currentMonthKey = getCurrentMonthKey(selectedDate)
    const mockCurrentData = mockDataByMonth[currentMonthKey as keyof typeof mockDataByMonth]
    
    if (mockCurrentData) {
      setCurrentMonthData(mockCurrentData)
    } else {
      // Fallback to real data calculation
      const currentMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`
      const currentTransactions = getTransactionsByMonth(loadedTransactions, currentMonth)
      const currentIncome = currentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      const currentExpenses = currentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      setCurrentMonthData({
        income: currentIncome,
        expenses: currentExpenses,
        balance: currentIncome - currentExpenses
      })
    }

    // Get previous month data (mock or real)
    const previousMonthKey = getPreviousMonthKey(selectedDate)
    const mockPreviousData = mockDataByMonth[previousMonthKey as keyof typeof mockDataByMonth]
    
    if (mockPreviousData) {
      setPreviousMonthData(mockPreviousData)
    } else {
      // Fallback to real data calculation
      const previousMonth = getPreviousMonthKey(selectedDate)
      const previousTransactions = getTransactionsByMonth(loadedTransactions, previousMonth)
      const previousIncome = previousTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      const previousExpenses = previousTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      setPreviousMonthData({
        income: previousIncome,
        expenses: previousExpenses,
        balance: previousIncome - previousExpenses
      })
    }
  }, [selectedDate])

  const currentMonth = getCurrentMonthKey(selectedDate)
  const currentTransactions = getTransactionsByMonth(transactions, currentMonth)
  const expenseTransactions = currentTransactions.filter(t => t.type === 'expense')
  const incomeTransactions = currentTransactions.filter(t => t.type === 'income')
  
  const expenseSummary = getCategorySummary(expenseTransactions)
  const incomeSummary = getCategorySummary(incomeTransactions)

  // Prepare chart data based on selected type
  const currentSummary = chartType === 'expense' ? expenseSummary : incomeSummary
  const pieChartData = currentSummary.slice(0, 6).map(item => ({
    name: item.category.name,
    value: item.amount,
    color: item.category.color
  }))

  // Prepare bar chart data based on ranking type
  const rankingSummary = rankingType === 'expense' ? expenseSummary : incomeSummary
  const barChartData = rankingSummary.slice(0, 8).map(item => ({
    name: item.category.name.substring(0, 8),
    amount: item.amount,
    color: item.category.color
  }))

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const incomeChange = calculateChange(currentMonthData.income, previousMonthData.income)
  const expenseChange = calculateChange(currentMonthData.expenses, previousMonthData.expenses)
  const balanceChange = calculateChange(currentMonthData.balance, previousMonthData.balance)

  return (
    <div className="p-4 space-y-6">
      {/* Monthly Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'month'
                ? 'bg-[#FF7A00] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ver por mês
          </button>
          
          <button
            onClick={() => setViewMode('year')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'year'
                ? 'bg-[#FF7A00] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ver todo o ano
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#FF7A00]" />
          </button>
          
          <h2 className="text-xl font-bold text-[#222222]">
            {viewMode === 'month' 
              ? selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
              : selectedDate.getFullYear().toString()
            }
          </h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} className="text-[#FF7A00]" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Balance */}
          <div className="text-center p-4 bg-gradient-to-r from-[#FF7A00] to-orange-600 rounded-2xl text-white">
            <div className="text-sm opacity-90">Saldo Total</div>
            <div className="text-2xl font-bold">
              {formatCurrency(currentMonthData.balance)}
            </div>
            <div className="flex items-center justify-center mt-2">
              {balanceChange >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              <span className="text-sm">
                {Math.abs(balanceChange).toFixed(1)}% vs {viewMode === 'month' ? 'mês anterior' : 'ano anterior'}
              </span>
            </div>
          </div>

          {/* Income and Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-600">Receitas</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(currentMonthData.income)}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600">Despesas</span>
                <TrendingDown size={16} className="text-red-600" />
              </div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(currentMonthData.expenses)}
              </div>
              <div className="text-xs text-red-500 mt-1">
                {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {(expenseSummary.length > 0 || incomeSummary.length > 0) && (
        <div className="space-y-6">
          {/* Pie Chart with Toggle */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#222222]">
                {chartType === 'expense' ? 'Despesas' : 'Receitas'} por Categoria
              </h3>
              
              {/* Toggle Switch */}
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setChartType('expense')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    chartType === 'expense'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  Despesas
                </button>
                <button
                  onClick={() => setChartType('income')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    chartType === 'income'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-green-500 hover:bg-green-50'
                  }`}
                >
                  Receitas
                </button>
              </div>
            </div>

            {pieChartData.length > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieChartData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-[#222222] truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">
                  {chartType === 'expense' ? '💸' : '💰'}
                </div>
                <p className="text-[#9B9B9B]">
                  Nenhuma {chartType === 'expense' ? 'despesa' : 'receita'} este mês
                </p>
              </div>
            )}
          </div>

          {/* Bar Chart with Toggle */}
          {(expenseSummary.length > 0 || incomeSummary.length > 0) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#222222]">
                  Ranking de {rankingType === 'expense' ? 'Gastos' : 'Ganhos'}
                </h3>
                
                {/* Toggle Switch */}
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setRankingType('expense')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      rankingType === 'expense'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    Gastos
                  </button>
                  <button
                    onClick={() => setRankingType('income')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      rankingType === 'income'
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'text-green-500 hover:bg-green-50'
                    }`}
                  >
                    Ganhos
                  </button>
                </div>
              </div>

              {barChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">
                    {rankingType === 'expense' ? '💸' : '💰'}
                  </div>
                  <p className="text-[#9B9B9B]">
                    Nenhum {rankingType === 'expense' ? 'gasto' : 'ganho'} este mês
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Category Details */}
      {expenseSummary.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-bold text-[#222222] mb-4">Detalhes por Categoria</h3>
          <div className="space-y-3">
            {expenseSummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: item.category.color }}
                  >
                    {item.category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#222222]">
                      {item.category.name}
                    </div>
                    <div className="text-sm text-[#9B9B9B]">
                      {item.transactions.length} transação{item.transactions.length !== 1 ? 'ões' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#222222]">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-sm text-[#9B9B9B]">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Income Details */}
      {incomeSummary.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-bold text-[#222222] mb-4">Receitas por Categoria</h3>
          <div className="space-y-3">
            {incomeSummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: item.category.color }}
                  >
                    {item.category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#222222]">
                      {item.category.name}
                    </div>
                    <div className="text-sm text-[#9B9B9B]">
                      {item.transactions.length} transação{item.transactions.length !== 1 ? 'ões' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-sm text-[#9B9B9B]">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {expenseSummary.length === 0 && incomeSummary.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-[#222222] mb-2">
            Nenhuma transação este mês
          </h3>
          <p className="text-[#9B9B9B]">
            Adicione algumas transações para ver seus relatórios
          </p>
        </div>
      )}
    </div>
  )
}