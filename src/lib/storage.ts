import { Transaction, Category, AppSettings, BackupData } from './types'
import { DEFAULT_CATEGORIES } from './constants'

class StorageService {
  private readonly TRANSACTIONS_KEY = 'controle_contas_transactions'
  private readonly CATEGORIES_KEY = 'controle_contas_categories'
  private readonly SETTINGS_KEY = 'controle_contas_settings'

  // Transactions
  getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.TRANSACTIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  saveTransactions(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions))
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions()
    transactions.push(transaction)
    this.saveTransactions(transactions)
  }

  updateTransaction(id: string, updatedTransaction: Partial<Transaction>): void {
    const transactions = this.getTransactions()
    const index = transactions.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction }
      this.saveTransactions(transactions)
    }
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions()
    const filtered = transactions.filter(t => t.id !== id)
    this.saveTransactions(filtered)
  }

  // Categories
  getCategories(): Category[] {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES
    const data = localStorage.getItem(this.CATEGORIES_KEY)
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES
  }

  saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories))
  }

  // Settings
  getSettings(): AppSettings {
    if (typeof window === 'undefined') return this.getDefaultSettings()
    const data = localStorage.getItem(this.SETTINGS_KEY)
    return data ? JSON.parse(data) : this.getDefaultSettings()
  }

  saveSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
  }

  private getDefaultSettings(): AppSettings {
    return {
      currency: 'BRL',
      language: 'pt-BR',
      theme: 'light',
      biometricEnabled: false
    }
  }

  // Backup
  exportData(): BackupData {
    return {
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    }
  }

  importData(backupData: BackupData): void {
    this.saveTransactions(backupData.transactions)
    this.saveCategories(backupData.categories)
    this.saveSettings(backupData.settings)
  }

  clearAllData(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TRANSACTIONS_KEY)
    localStorage.removeItem(this.CATEGORIES_KEY)
    localStorage.removeItem(this.SETTINGS_KEY)
  }
}

export const storageService = new StorageService()