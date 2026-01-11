import React from 'react';
import { Category } from '../types';
import { Check } from 'lucide-react';

interface Props {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const CategoryGrid: React.FC<Props> = ({ categories, selectedIds, onToggle }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => {
        const isSelected = selectedIds.includes(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className={`
              relative p-3 rounded-2xl text-left transition-all duration-300 h-20 flex flex-col justify-center items-center gap-1 group overflow-hidden
              ${isSelected 
                ? 'bg-gradient-to-br from-emerald-500/90 to-teal-600/90 shadow-lg shadow-emerald-500/20 border border-emerald-400/30' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10'}
            `}
          >
            <div className="text-2xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
              {cat.icon}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
              {cat.name}
            </span>
            
            {isSelected && (
              <div className="absolute top-2 right-2 text-white">
                <Check size={14} strokeWidth={4} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};