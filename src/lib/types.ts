export interface Transaction {
  id: string
  date: string
  type: 'expense' | 'income'
  amount: number
  category: Category
  note?: string
  photo?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface CategorySummary {
  category: Category
  amount: number
  percentage: number
  transactions: Transaction[]
}

export interface DayData {
  date: string
  income: number
  expenses: number
  balance: number
  transactions: Transaction[]
}

export interface BackupData {
  transactions: Transaction[]
  categories: Category[]
  settings: AppSettings
  exportDate: string
}

export interface AppSettings {
  currency: string
  language: string
  theme: 'light' | 'dark'
  biometricEnabled: boolean
  backupEmail?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  duration: string
  price: number
  originalPrice?: number
  discount?: string
}