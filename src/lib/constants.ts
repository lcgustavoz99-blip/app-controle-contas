import { Category } from './types'

export const DEFAULT_CATEGORIES: Category[] = [
  // Despesas
  { id: 'food', name: 'Alimentação', icon: '🍽️', color: '#FF6B6B' },
  { id: 'transport', name: 'Transporte', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: 'Compras', icon: '🛍️', color: '#45B7D1' },
  { id: 'health', name: 'Saúde', icon: '🏥', color: '#96CEB4' },
  { id: 'education', name: 'Educação', icon: '📚', color: '#FFEAA7' },
  { id: 'entertainment', name: 'Lazer', icon: '🎬', color: '#DDA0DD' },
  { id: 'bills', name: 'Contas', icon: '📄', color: '#FFB347' },
  { id: 'home', name: 'Casa', icon: '🏠', color: '#98D8C8' },
  
  // Rendas
  { id: 'salary', name: 'Salário', icon: '💰', color: '#6BCF7F' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#4D96FF' },
  { id: 'investment', name: 'Investimentos', icon: '📈', color: '#9B59B6' },
  { id: 'gift', name: 'Presente', icon: '🎁', color: '#F39C12' },
  { id: 'bonus', name: 'Bônus', icon: '🎯', color: '#1ABC9C' },
  { id: 'other', name: 'Outros', icon: '💡', color: '#95A5A6' }
]

export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Mensal',
    duration: '1 mês',
    price: 13.99,
    originalPrice: 13.99
  },
  {
    id: 'bimonthly',
    name: 'Bimestral',
    duration: '2 meses',
    price: 22.99,
    originalPrice: 27.98,
    discount: '18% OFF'
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    duration: '3 meses',
    price: 31.99,
    originalPrice: 41.97,
    discount: '24% OFF'
  },
  {
    id: 'annual',
    name: 'Anual',
    duration: '12 meses',
    price: 89.99,
    originalPrice: 167.88,
    discount: '46% OFF'
  }
]

export const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' }
]

export const LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español' }
]