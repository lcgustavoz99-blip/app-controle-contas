"use client"

import { useState, useEffect } from 'react'
import { 
  Download, 
  Upload, 
  Globe, 
  Palette, 
  Shield, 
  Crown,
  Mail,
  Smartphone,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react'
import { storageService } from '@/lib/storage'
import { CURRENCIES, LANGUAGES, SUBSCRIPTION_PLANS, DEFAULT_CATEGORIES } from '@/lib/constants'
import { AppSettings, Category } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings())
  const [showBackup, setShowBackup] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [backupEmail, setBackupEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)

  useEffect(() => {
    setCategories(storageService.getCategories())
  }, [])

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    storageService.saveSettings(newSettings)
  }

  const handleBackup = () => {
    const data = storageService.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `controle-contas-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          storageService.importData(data)
          setCategories(storageService.getCategories())
          setSettings(storageService.getSettings())
          alert('Backup restaurado com sucesso!')
        } catch (error) {
          alert('Erro ao restaurar backup. Verifique se o arquivo está correto.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleEmailBackup = () => {
    if (!backupEmail) return
    
    // Simulate OTP sending
    setShowOtpInput(true)
    alert(`Código OTP enviado para ${backupEmail}`)
  }

  const handleOtpVerification = () => {
    if (otpCode.length === 6) {
      updateSetting('backupEmail', backupEmail)
      setShowBackup(false)
      setShowOtpInput(false)
      setBackupEmail('')
      setOtpCode('')
      alert('Email configurado com sucesso!')
    }
  }

  const addCategory = () => {
    const name = prompt('Nome da categoria:')
    const icon = prompt('Emoji da categoria:')
    const color = prompt('Cor da categoria (hex):') || '#FF7A00'
    
    if (name && icon) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        icon,
        color
      }
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      storageService.saveCategories(updatedCategories)
    }
  }

  const deleteCategory = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      const updatedCategories = categories.filter(c => c.id !== id)
      setCategories(updatedCategories)
      storageService.saveCategories(updatedCategories)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-orange-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Crown size={20} />
              <span className="font-bold">Controle de Contas Premium</span>
            </div>
            <p className="text-sm opacity-90">
              Remova anúncios e tenha acesso completo
            </p>
          </div>
          <button
            onClick={() => setShowSubscription(true)}
            className="bg-white text-[#FF7A00] px-4 py-2 rounded-xl font-bold"
          >
            Assinar
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Backup & Restore */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center">
            <Shield className="mr-2 text-[#FF7A00]" size={20} />
            Backup e Segurança
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowBackup(true)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-[#FF7A00]" />
                <div className="text-left">
                  <div className="font-medium text-[#222222]">Backup por Email</div>
                  <div className="text-sm text-[#9B9B9B]">
                    {settings.backupEmail || 'Não configurado'}
                  </div>
                </div>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBackup}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm font-medium">Exportar</span>
              </button>
              
              <label className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                <Upload size={16} />
                <span className="text-sm font-medium">Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
            </div>

            <button
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-[#FF7A00]" />
                <div className="text-left">
                  <div className="font-medium text-[#222222]">Biometria</div>
                  <div className="text-sm text-[#9B9B9B]">
                    {settings.biometricEnabled ? 'Ativada' : 'Desativada'}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.biometricEnabled}
                  onChange={(e) => updateSetting('biometricEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A00]"></div>
              </label>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center">
            <Globe className="mr-2 text-[#FF7A00]" size={20} />
            Preferências
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-[#222222]">Moeda</div>
                <div className="text-sm text-[#9B9B9B]">
                  {CURRENCIES.find(c => c.code === settings.currency)?.name}
                </div>
              </div>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-[#222222]">Idioma</div>
                <div className="text-sm text-[#9B9B9B]">
                  {LANGUAGES.find(l => l.code === settings.language)?.name}
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm"
              >
                {LANGUAGES.map(language => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-[#222222]">Tema</div>
                <div className="text-sm text-[#9B9B9B]">
                  {settings.theme === 'light' ? 'Claro' : 'Escuro'}
                </div>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#222222] flex items-center">
              <Palette className="mr-2 text-[#FF7A00]" size={20} />
              Categorias
            </h3>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="text-[#FF7A00] font-medium"
            >
              {showCategories ? 'Ocultar' : 'Gerenciar'}
            </button>
          </div>

          {showCategories && (
            <div className="space-y-3">
              <button
                onClick={addCategory}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-[#9B9B9B] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
              >
                <Plus size={16} />
                <span>Adicionar Categoria</span>
              </button>

              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <span className="font-medium text-[#222222]">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backup Modal */}
      {showBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#222222] mb-4">
              Backup por Email
            </h3>
            
            {!showOtpInput ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-2">
                    Email para backup
                  </label>
                  <input
                    type="email"
                    value={backupEmail}
                    onChange={(e) => setBackupEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBackup(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-[#9B9B9B]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEmailBackup}
                    disabled={!backupEmail}
                    className="flex-1 py-3 bg-[#FF7A00] text-white rounded-xl disabled:bg-gray-200"
                  >
                    Enviar Código
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-2">
                    Código OTP (6 dígitos)
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-center text-lg tracking-widest"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowOtpInput(false)
                      setOtpCode('')
                    }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-[#9B9B9B]"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleOtpVerification}
                    disabled={otpCode.length !== 6}
                    className="flex-1 py-3 bg-[#FF7A00] text-white rounded-xl disabled:bg-gray-200"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <Crown size={32} className="text-[#FF7A00] mx-auto mb-2" />
              <h3 className="text-xl font-bold text-[#222222]">
                Controle de Contas Premium
              </h3>
              <p className="text-[#9B9B9B] text-sm mt-2">
                Remova anúncios e tenha acesso completo
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="border-2 border-gray-200 rounded-2xl p-4 hover:border-[#FF7A00] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#222222]">
                        {plan.name}
                      </div>
                      <div className="text-sm text-[#9B9B9B]">
                        {plan.duration}
                      </div>
                      {plan.discount && (
                        <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full inline-block mt-1">
                          {plan.discount}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#FF7A00] text-lg">
                        {formatCurrency(plan.price)}
                      </div>
                      {plan.originalPrice && plan.originalPrice !== plan.price && (
                        <div className="text-sm text-[#9B9B9B] line-through">
                          {formatCurrency(plan.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubscription(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-[#9B9B9B]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Funcionalidade de pagamento será implementada')
                  setShowSubscription(false)
                }}
                className="flex-1 py-3 bg-[#FF7A00] text-white rounded-xl font-bold"
              >
                Assinar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}