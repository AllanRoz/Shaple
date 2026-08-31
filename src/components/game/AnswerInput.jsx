import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Check, AlertCircle } from 'lucide-react';
import { normalizeString } from '../../utils/answerMatching.js';

export default function AnswerInput({
  onSubmit,
  disabled = false,
  allPlaces = [],
  placeholder = "Type your answer...",
  shake = false,
  mode = "world"
}) {
  const [inputVal, setInputVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Focus input automatically on mount or when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Update suggestions based on user input
  useEffect(() => {
    const query = normalizeString(inputVal);
    if (!query || query.length < 1 || disabled) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const matches = allPlaces
      .filter(p => {
        const normName = normalizeString(p.name);
        if (normName.includes(query)) return true;
        if (p.abbreviation && normalizeString(p.abbreviation).startsWith(query)) return true;
        if (p.code && normalizeString(p.code).startsWith(query)) return true;
        if (Array.isArray(p.aliases)) {
          return p.aliases.some(a => normalizeString(a).includes(query));
        }
        return false;
      })
      .slice(0, 5);

    setSuggestions(matches);
    setSelectedIndex(-1);
  }, [inputVal, allPlaces, disabled]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (disabled || !inputVal.trim()) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      onSubmit(suggestions[selectedIndex].name);
    } else {
      onSubmit(inputVal.trim());
    }

    setInputVal('');
    setSuggestions([]);
  };

  const handleSelectSuggestion = (placeName) => {
    if (disabled) return;
    onSubmit(placeName);
    setInputVal('');
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  return (
    <div className={`relative w-full max-w-md mx-auto ${shake ? 'animate-shake' : ''}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full pl-11 pr-24 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base font-medium"
          />

          <button
            type="submit"
            disabled={disabled || !inputVal.trim()}
            className="absolute inset-y-1.5 right-1.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-semibold text-sm flex items-center gap-1.5 shadow-md shadow-brand-600/30 transition disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500"
          >
            <span>Guess</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

      {/* Autocomplete / Smart Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && !disabled && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-30 divide-y divide-slate-100 dark:divide-slate-700/60 animate-slide-up"
        >
          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={() => handleSelectSuggestion(item.name)}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition text-sm font-medium ${
                selectedIndex === idx
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.flagEmoji || (mode === 'usa' ? '🇺🇸' : '🌎')}</span>
                <span>{item.name}</span>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                {item.continent || item.region || item.abbreviation}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
