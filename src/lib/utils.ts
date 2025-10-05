import { Transaction, DayData, CategorySummary, MonthlyData } from './types'

export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  const symbols: { [key: string]: string } = {
    'BRL': 'R$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  }
  
  return `${symbols[currency] || 'R$'} ${amount.toFixed(2).replace('.', ',')}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  })
}

export function getMonthName(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function groupTransactionsByDate(transactions: Transaction[]): DayData[] {
  const grouped: { [key: string]: DayData } = {}
  
  transactions.forEach(transaction => {
    const date = transaction.date.split('T')[0]
    
    if (!grouped[date]) {
      grouped[date] = {
        date,
        income: 0,
        expenses: 0,
        balance: 0,
        transactions: []
      }
    }
    
    grouped[date].transactions.push(transaction)
    
    if (transaction.type === 'income') {
      grouped[date].income += transaction.amount
    } else {
      grouped[date].expenses += transaction.amount
    }
    
    grouped[date].balance = grouped[date].income - grouped[date].expenses
  })
  
  return Object.values(grouped).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getTransactionsByMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(transaction => {
    const transactionMonth = transaction.date.substring(0, 7)
    return transactionMonth === month
  })
}

export function calculateMonthlyData(transactions: Transaction[]): MonthlyData {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return {
    month: new Date().toISOString().substring(0, 7),
    income,
    expenses,
    balance: income - expenses
  }
}

export function getCategorySummary(transactions: Transaction[]): CategorySummary[] {
  const categoryMap: { [key: string]: CategorySummary } = {}
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  
  transactions.forEach(transaction => {
    const categoryId = transaction.category.id
    
    if (!categoryMap[categoryId]) {
      categoryMap[categoryId] = {
        category: transaction.category,
        amount: 0,
        percentage: 0,
        transactions: []
      }
    }
    
    categoryMap[categoryId].amount += transaction.amount
    categoryMap[categoryId].transactions.push(transaction)
  })
  
  // Calculate percentages
  Object.values(categoryMap).forEach(summary => {
    summary.percentage = totalAmount > 0 ? (summary.amount / totalAmount) * 100 : 0
  })
  
  return Object.values(categoryMap).sort((a, b) => b.amount - a.amount)
}

export function getCurrentMonth(): string {
  return new Date().toISOString().substring(0, 7)
}

export function getPreviousMonth(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date.toISOString().substring(0, 7)
}

export function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []
  
  // Add days from previous month to fill the week
  const startDay = firstDay.getDay()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push(date)
  }
  
  // Add all days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }
  
  // Add days from next month to fill the week
  const endDay = lastDay.getDay()
  for (let i = 1; i <= 6 - endDay; i++) {
    const date = new Date(year, month + 1, i)
    days.push(date)
  }
  
  return days
}