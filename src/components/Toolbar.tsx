
import React from 'react';
import { MousePointer, Square, Circle, Type, Pen, Move } from 'lucide-react';
import { useDesignStore } from '../hooks/useDesignStore';
import { Button } from '@/components/ui/button';

export const Toolbar = () => {
  const { selectedTool, setSelectedTool } = useDesignStore();

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'pen', icon: Pen, label: 'Pen' },
  ];

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Tools</h3>
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          className={`w-full justify-start transition-all duration-200 ${
            selectedTool === tool.id 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
              : 'hover:bg-slate-100 hover:scale-105'
          }`}
          onClick={() => setSelectedTool(tool.id as any)}
        >
          <tool.icon className="w-4 h-4 mr-3" />
          {tool.label}
        </Button>
      ))}
    </div>
  );
};
