"use client"

import { useState } from 'react'
import { Plus, Minus, X, ChevronLeft, ChevronRight, Settings, Trash2, Edit3 } from 'lucide-react'
import { storageService } from '@/lib/storage'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import { generateId, formatCurrency } from '@/lib/utils'
import { Transaction, Category } from '@/lib/types'

export function RegisterScreen() {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [showCategoryEditor, setShowCategoryEditor] = useState(false)
  const [customCategories, setCustomCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingName, setEditingName] = useState('')

  // Ícones disponíveis para despesas
  const expenseIcons = [
    { icon: '🍽️', name: 'Alimentação', color: '#FF6B6B' },
    { icon: '🚗', name: 'Transporte', color: '#4ECDC4' },
    { icon: '🛍️', name: 'Compras', color: '#45B7D1' },
    { icon: '🏥', name: 'Saúde', color: '#96CEB4' },
    { icon: '📚', name: 'Educação', color: '#FFEAA7' },
    { icon: '🏠', name: 'Casa', color: '#DDA0DD' },
    { icon: '⚡', name: 'Energia', color: '#FFD93D' },
    { icon: '💧', name: 'Água', color: '#6C5CE7' },
    { icon: '📱', name: 'Telefone', color: '#A29BFE' },
    { icon: '🎬', name: 'Entretenimento', color: '#FD79A8' },
    { icon: '👕', name: 'Roupas', color: '#FDCB6E' },
    { icon: '💄', name: 'Beleza', color: '#E17055' },
    { icon: '🎮', name: 'Games', color: '#00B894' },
    { icon: '🏋️', name: 'Academia', color: '#00CEC9' },
    { icon: '✈️', name: 'Viagem', color: '#0984E3' },
    { icon: '🐕', name: 'Pet', color: '#A0522D' },
    { icon: '🚌', name: 'Ônibus', color: '#2D3436' },
    { icon: '🚕', name: 'Táxi', color: '#F39C12' },
    { icon: '⛽', name: 'Combustível', color: '#E74C3C' },
    { icon: '🍕', name: 'Fast Food', color: '#E67E22' },
    { icon: '☕', name: 'Café', color: '#8B4513' },
    { icon: '🍺', name: 'Bebidas', color: '#F1C40F' },
    { icon: '🎵', name: 'Música', color: '#9B59B6' },
    { icon: '📖', name: 'Livros', color: '#34495E' },
    { icon: '🔧', name: 'Manutenção', color: '#95A5A6' },
    { icon: '💊', name: 'Remédios', color: '#E74C3C' },
    { icon: '🎂', name: 'Festas', color: '#FF69B4' },
    { icon: '🎁', name: 'Presentes', color: '#FF1493' },
    { icon: '💳', name: 'Cartão', color: '#2C3E50' },
    { icon: '🏦', name: 'Banco', color: '#3498DB' },
    { icon: '📄', name: 'Documentos', color: '#BDC3C7' },
    { icon: '🔒', name: 'Seguro', color: '#7F8C8D' },
    { icon: '💰', name: 'Outros', color: '#27AE60' }
  ]

  // 30 ícones variados de renda e atividades do dia a dia
  const incomeIcons = [
    { icon: '💰', name: 'Salário', color: '#27AE60' },
    { icon: '💻', name: 'Freelance', color: '#3498DB' },
    { icon: '📈', name: 'Investimentos', color: '#9B59B6' },
    { icon: '🎁', name: 'Presente', color: '#E91E63' },
    { icon: '🎯', name: 'Bônus', color: '#FF9800' },
    { icon: '🏢', name: 'Empresa', color: '#2C3E50' },
    { icon: '🛒', name: 'Vendas Online', color: '#FF5722' },
    { icon: '🚗', name: 'Uber/99', color: '#00BCD4' },
    { icon: '🍕', name: 'Delivery', color: '#FF6B35' },
    { icon: '📱', name: 'Apps', color: '#4CAF50' },
    { icon: '🎨', name: 'Design', color: '#E91E63' },
    { icon: '📸', name: 'Fotografia', color: '#9C27B0' },
    { icon: '🎵', name: 'Música', color: '#673AB7' },
    { icon: '📝', name: 'Redação', color: '#3F51B5' },
    { icon: '🏠', name: 'Aluguel', color: '#2196F3' },
    { icon: '🔧', name: 'Consertos', color: '#607D8B' },
    { icon: '👩‍🏫', name: 'Aulas', color: '#795548' },
    { icon: '💄', name: 'Beleza', color: '#E91E63' },
    { icon: '🧹', name: 'Limpeza', color: '#4CAF50' },
    { icon: '🍰', name: 'Doces', color: '#FF9800' },
    { icon: '🧵', name: 'Costura', color: '#9C27B0' },
    { icon: '🌱', name: 'Jardinagem', color: '#4CAF50' },
    { icon: '🐕', name: 'Pet Care', color: '#795548' },
    { icon: '🚚', name: 'Frete', color: '#FF5722' },
    { icon: '💡', name: 'Consultoria', color: '#FFC107' },
    { icon: '🎪', name: 'Eventos', color: '#E91E63' },
    { icon: '🏋️', name: 'Personal', color: '#FF5722' },
    { icon: '📚', name: 'Livros', color: '#3F51B5' },
    { icon: '🎮', name: 'Gaming', color: '#9C27B0' },
    { icon: '🌐', name: 'Internet', color: '#00BCD4' }
  ]

  const categories = DEFAULT_CATEGORIES.concat(customCategories).filter(cat => {
    if (transactionType === 'expense') {
      return !['salary', 'freelance', 'investment', 'gift', 'bonus'].includes(cat.id)
    } else {
      return ['salary', 'freelance', 'investment', 'gift', 'bonus', 'other'].includes(cat.id)
    }
  })

  const handleSubmit = () => {
    if (!amount || !selectedCategory) return

    const transaction: Transaction = {
      id: generateId(),
      date: selectedDate.toISOString(),
      type: transactionType,
      amount: parseFloat(amount.replace(',', '.')),
      category: selectedCategory,
      note: note || undefined
    }

    storageService.addTransaction(transaction)
    
    // Reset form
    setAmount('')
    setSelectedCategory(null)
    setNote('')
    
    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  const navigateCalendarMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCalendarDate(newDate)
  }

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCalendarMonth = () => {
    return calendarDate.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysInMonth = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const selectDate = (day: number) => {
    const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
    setSelectedDate(newDate)
    setShowCalendar(false)
  }

  const isSelectedDay = (day: number) => {
    if (!day) return false
    const dayDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
    return dayDate.toDateString() === selectedDate.toDateString()
  }

  const addCustomCategory = (iconData: { icon: string; name: string; color: string }) => {
    const newCategory: Category = {
      id: generateId(),
      name: iconData.name,
      icon: iconData.icon,
      color: iconData.color
    }
    setCustomCategories(prev => [...prev, newCategory])
  }

  const removeCustomCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const removeDefaultCategory = (categoryId: string) => {
    // Remove from selected if it's the one being removed
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null)
    }
  }

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category)
    setEditingName(category.name)
  }

  const saveEditingCategory = () => {
    if (!editingCategory || !editingName.trim()) return

    if (editingCategory.id.startsWith('custom-')) {
      // Edit custom category
      setCustomCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: editingName.trim() }
            : cat
        )
      )
    } else {
      // For default categories, we need to create a custom version
      const newCategory: Category = {
        id: generateId(),
        name: editingName.trim(),
        icon: editingCategory.icon,
        color: editingCategory.color
      }
      setCustomCategories(prev => [...prev, newCategory])
    }

    setEditingCategory(null)
    setEditingName('')
  }

  const cancelEditingCategory = () => {
    setEditingCategory(null)
    setEditingName('')
  }

  const availableIcons = transactionType === 'expense' ? expenseIcons : incomeIcons

  return (
    <div className="p-4 space-y-6">
      {/* Day Navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <button
          onClick={() => navigateDay('prev')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7A00] text-white hover:bg-orange-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-center">
          <button
            onClick={() => setShowCalendar(true)}
            className="text-lg font-bold text-[#222222] hover:text-[#FF7A00] transition-colors"
          >
            {formatSelectedDate()}
          </button>
          <div className="text-sm text-gray-500">
            Registrar transação
          </div>
        </div>
        
        <button
          onClick={() => navigateDay('next')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7A00] text-white hover:bg-orange-600 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button
                onClick={() => navigateCalendarMonth('prev')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7A00] text-white hover:bg-orange-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h3 className="text-lg font-bold text-[#222222] capitalize">
                {formatCalendarMonth()}
              </h3>
              
              <button
                onClick={() => navigateCalendarMonth('next')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7A00] text-white hover:bg-orange-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && selectDate(day)}
                    disabled={!day}
                    className={`
                      h-10 w-10 rounded-lg text-sm font-medium transition-all
                      ${!day 
                        ? 'invisible' 
                        : isSelectedDay(day)
                          ? 'bg-[#FF7A00] text-white shadow-lg'
                          : 'text-[#222222] hover:bg-orange-50 hover:text-[#FF7A00]'
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowCalendar(false)}
                className="w-full py-3 bg-gray-100 text-[#222222] rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Editor Modal */}
      {showCategoryEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#222222]">
                Gerenciar Categorias
              </h3>
              <button
                onClick={() => setShowCategoryEditor(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Categories in Use */}
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Categorias em Uso</h4>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="relative group">
                      <div className="flex flex-col items-center p-3 rounded-2xl border-2 border-gray-200">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mb-2"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <span className="text-xs text-center text-[#222222]">
                          {editingCategory?.id === category.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onBlur={saveEditingCategory}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditingCategory()
                                if (e.key === 'Escape') cancelEditingCategory()
                              }}
                              className="w-full text-xs text-center bg-transparent border-b border-[#FF7A00] outline-none"
                              autoFocus
                            />
                          ) : (
                            category.name
                          )}
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditingCategory(category)}
                          className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                          <Edit3 size={10} />
                        </button>
                        <button
                          onClick={() => {
                            if (category.id.startsWith('custom-')) {
                              removeCustomCategory(category.id)
                            } else {
                              removeDefaultCategory(category.id)
                            }
                          }}
                          className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Icons to Add */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Adicionar Nova Categoria ({transactionType === 'expense' ? 'Despesas' : 'Rendas'})
                </h4>
                <div className="grid grid-cols-4 gap-3 lasy-highlight">
                  {availableIcons.map((iconData, index) => (
                    <button
                      key={index}
                      onClick={() => addCustomCategory(iconData)}
                      className="flex flex-col items-center p-3 rounded-2xl border-2 border-gray-200 hover:border-[#FF7A00] hover:bg-orange-50 transition-all"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mb-2"
                        style={{ backgroundColor: iconData.color }}
                      >
                        {iconData.icon}
                      </div>
                      <span className="text-xs text-center text-[#222222]">
                        {iconData.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowCategoryEditor(false)}
                className="w-full py-3 bg-[#FF7A00] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl text-center">
          Transação registrada com sucesso!
        </div>
      )}

      {/* Transaction Type Toggle */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        <button
          onClick={() => setTransactionType('expense')}
          className={`flex-1 flex items-center justify-center py-3 rounded-2xl transition-all ${
            transactionType === 'expense'
              ? 'bg-red-500 text-white shadow-lg'
              : 'text-gray-600'
          }`}
        >
          <Minus size={20} className="mr-2" />
          Despesa
        </button>
        <button
          onClick={() => setTransactionType('income')}
          className={`flex-1 flex items-center justify-center py-3 rounded-2xl transition-all ${
            transactionType === 'income'
              ? 'bg-green-500 text-white shadow-lg'
              : 'text-gray-600'
          }`}
        >
          <Plus size={20} className="mr-2" />
          Renda
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-[#222222] font-medium">Valor</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9B9B9B]">
            R$
          </span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[#222222] font-medium">Categoria</label>
          <button
            onClick={() => setShowCategoryEditor(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#FF7A00] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <Settings size={16} />
            Gerenciar
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                selectedCategory?.id === category.id
                  ? 'border-[#FF7A00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg mb-2"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="text-xs text-center text-[#222222]">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Note Input */}
      <div className="space-y-2">
        <label className="text-[#222222] font-medium">Nota (opcional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Adicione uma observação..."
          className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!amount || !selectedCategory}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          amount && selectedCategory
            ? 'bg-[#FF7A00] text-white shadow-lg hover:bg-orange-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {transactionType === 'expense' ? 'Inserir Despesa' : 'Inserir Renda'}
      </button>
    </div>
  )
}