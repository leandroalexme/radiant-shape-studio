
import React from 'react';
import { useDesignStore } from '../hooks/useDesignStore';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

export const LayersPanel = () => {
  const { elements, selectedElement, selectElement, updateElement, deleteElement } = useDesignStore();

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'rectangle': return '⬜';
      case 'circle': return '⭕';
      case 'text': return '📝';
      case 'path': return '✏️';
      default: return '🔷';
    }
  };

  return (
    <div className="flex-1 p-4 border-t border-slate-200">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Layers</h3>
      <div className="space-y-1">
        {elements.map((element, index) => (
          <div
            key={element.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedElement?.id === element.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                : 'hover:bg-slate-50'
            }`}
            onClick={() => selectElement(element.id)}
          >
            <span className="text-sm mr-2">{getElementIcon(element.type)}</span>
            <span className="flex-1 text-sm text-slate-700 truncate">
              {element.type} {index + 1}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(element.id, { visible: !element.visible });
                }}
              >
                {element.visible !== false ? (
                  <Eye className="w-3 h-3 text-slate-500" />
                ) : (
                  <EyeOff className="w-3 h-3 text-slate-400" />
                )}
              </Button>
            </div>
          </div>
        ))}
        {elements.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4">
            No layers yet. Start creating!
          </p>
        )}
      </div>
    </div>
  );
};
