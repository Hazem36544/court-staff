import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, CheckCircle } from 'lucide-react';
import { statusOptions } from './ComplaintsHelpers';

export default function ComplaintsFilter({ statusFilter, setStatusFilter }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < statusOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < statusOptions.length) {
        setStatusFilter(statusOptions[highlightedIndex].value);
        setIsDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const getSelectedLabel = () => {
    const selected = statusOptions.find(opt => opt.value === statusFilter);
    return selected ? selected.label : 'جميع الحالات';
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <Filter className="w-5 h-5 text-[#1e3a8a]" />
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">تصفية السجل:</span>
        </div>

        <div className="relative w-full md:w-64" ref={dropdownRef}>
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full h-[52px] md:h-14 px-4 pr-12 rounded-xl flex items-center justify-between outline-none transition-all font-bold text-sm md:text-base border cursor-pointer shadow-sm
              ${isDropdownOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]'}
            `}
          >
            <span className="text-gray-800">{getSelectedLabel()}</span>
            <ChevronDown
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transition-opacity duration-300 opacity-100">
              <ul className="py-2 m-0 list-none">
                {statusOptions.map((option, index) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center
                      ${statusFilter === option.value ? 'bg-blue-50 text-[#1e3a8a]' : ''}
                      ${highlightedIndex === index && statusFilter !== option.value ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}
                    `}
                  >
                    {option.label}
                    {statusFilter === option.value && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}