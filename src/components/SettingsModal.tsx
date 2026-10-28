import React, { useState } from 'react';
import { X, Key, Database, Check, RefreshCw, FileCode } from 'lucide-react';
import { DEFAULT_GEMINI_KEY, getGeminiKey, saveGeminiKey } from '../services/ai';
import { getSupabaseConfig, saveSupabaseConfig, fetchDishes } from '../services/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [apiKey, setApiKey] = useState(getGeminiKey());
  const initialSupabase = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialSupabase.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialSupabase.key);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveGeminiKey(apiKey);
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSavedSuccess(true);
    onRefreshData();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetKey = () => {
    setApiKey(DEFAULT_GEMINI_KEY);
    saveGeminiKey(DEFAULT_GEMINI_KEY);
  };

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseStatus(null);
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);

    const result = await fetchDishes();
    setTestingSupabase(false);
    if (result.source === 'supabase') {
      setSupabaseStatus(`✅ Успешно! Подключено к таблице dishes (${result.dishes.length} позиций)`);
    } else {
      setSupabaseStatus(`⚠️ Supabase не отвечает или база пуста. Используется локальный кэш (${result.error || 'Проверьте ключи'})`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-28 p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-12 bg-black text-apple-400 flex items-center justify-center">
              ⚙️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Параметры интеграций</h3>
              <p className="text-xs text-gray-500">Google Gemini & Supabase Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Gemini API */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-apple-600" />
              <span>Google Gemini API Key</span>
            </label>
            <button
              type="button"
              onClick={handleResetKey}
              className="text-[11px] text-apple-700 hover:underline font-mono"
            >
              Сбросить к дефолтному
            </button>
          </div>

          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AQ.Ab8RN6I..."
              className="w-full px-3.5 py-2.5 rounded-16 bg-[#F5F5F7] border border-gray-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-apple-500"
            />
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            Предустановлен рабочий ключ. В UI модель отображается как <strong>Gemini 3.8 Flash</strong>. При сетевых сбоях автоматически активен локальный движок.
          </p>
        </div>

        {/* Section 2: Supabase */}
        <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Подключение к Supabase</span>
            </label>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">
              Опционально
            </span>
          </div>

          <div>
            <label className="text-[11px] text-gray-500 block mb-1">Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2 rounded-14 bg-[#F5F5F7] border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-apple-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-500 block mb-1">Anon / Public API Key</label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 rounded-14 bg-[#F5F5F7] border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-apple-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTestSupabase}
              disabled={testingSupabase || !supabaseUrl}
              className="px-3 py-1.5 rounded-12 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40"
            >
              {testingSupabase ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
              <span>Проверить связь</span>
            </button>

            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-gray-400" />
              <span>SQL: supabase_setup.sql</span>
            </span>
          </div>

          {supabaseStatus && (
            <div className="p-2.5 rounded-12 bg-gray-50 border border-gray-200 text-xs text-gray-700 font-mono">
              {supabaseStatus}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-16 text-gray-600 hover:bg-gray-100 text-xs font-semibold"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-16 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-apple-500 hover:bg-apple-400 text-black shadow-glow-apple'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Сохранено!</span>
              </>
            ) : (
              <span>Сохранить параметры</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
