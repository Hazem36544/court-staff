import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function CustomSelect({ options, value, onChange, placeholder, icon: Icon, hasSearch = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  const displayValue = value ? options.find(o => o.value === value)?.label : '';
  const filteredOptions = hasSearch ? options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase())) : options;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const currentIndex = filteredOptions.findIndex(o => o.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setHighlightedIndex(-1);
      if (hasSearch) setSearchTerm('');
    }
  }, [isOpen, value, searchTerm]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const listElement = listRef.current;
      const highlightedItem = listElement.children[highlightedIndex];
      if (highlightedItem) highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || (e.key === ' ' && !hasSearch) || e.key === 'ArrowDown') {
        e.preventDefault(); setIsOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev)); break;
      case 'ArrowUp': e.preventDefault(); setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev)); break;
      case 'Enter': e.preventDefault(); if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) { onChange(filteredOptions[highlightedIndex].value); setIsOpen(false); setSearchTerm(''); } break;
      case 'Escape': e.preventDefault(); setIsOpen(false); setSearchTerm(''); break;
      case 'Tab': setIsOpen(false); break;
      default: break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div className="relative w-full h-[52px]">
        {Icon && <Icon className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${isOpen ? 'text-[#1e3a8a]' : 'text-gray-400'}`} />}
        <input
          type="text" readOnly={!hasSearch}
          value={isOpen && hasSearch ? searchTerm : (displayValue || '')}
          onChange={(e) => hasSearch && setSearchTerm(e.target.value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className={`w-full h-full px-4 ${Icon ? 'pr-12' : ''} rounded-xl outline-none transition-all font-bold text-sm border shadow-sm cursor-pointer ${isOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]'}`}
        />
        <ChevronDown onClick={() => setIsOpen(!isOpen)} className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul ref={listRef} className="max-h-60 overflow-y-auto custom-scrollbar py-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <li key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); setSearchTerm(''); }} onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${value === opt.value ? 'text-[#1e3a8a]' : 'text-gray-700'} ${highlightedIndex === index ? (value === opt.value ? 'bg-blue-100' : 'bg-gray-100') : (value === opt.value ? 'bg-blue-50' : 'hover:bg-gray-50')}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-sm text-gray-400 font-bold text-center flex flex-col items-center justify-center gap-2">
                 <Search className="w-6 h-6 opacity-30" /> لا توجد نتائج مطابقة للبحث
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}