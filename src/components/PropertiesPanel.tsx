
import React from 'react';
import { useDesignStore } from '../hooks/useDesignStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Trash2, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const PropertiesPanel = () => {
  const { selectedElement, updateElement, deleteElement, duplicateElement } = useDesignStore();

  if (!selectedElement) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Properties</h3>
        <p className="text-slate-500 text-center mt-8">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateElement(selectedElement.id, { [property]: value });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-700">Properties</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => duplicateElement(selectedElement.id)}
            className="hover:bg-slate-50"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteElement(selectedElement.id)}
            className="hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Position */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-slate-700">Position</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-500">X</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => handlePropertyChange('x', parseInt(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Y</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => handlePropertyChange('y', parseInt(e.target.value))}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Size</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-500">Width</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.width || 0)}
                onChange={(e) => handlePropertyChange('width', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Height</Label>
              <Input
                type="number"
                value={Math.round(selectedElement.height || 0)}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
        </div>
      )}

      {/* Circle Radius */}
      {selectedElement.type === 'circle' && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Radius</Label>
          <Input
            type="number"
            value={Math.round(selectedElement.radius || 0)}
            onChange={(e) => handlePropertyChange('radius', parseInt(e.target.value))}
            className="h-8"
          />
        </div>
      )}

      {/* Fill Color */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-slate-700">Fill Color</Label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={selectedElement.fill || '#000000'}
            onChange={(e) => handlePropertyChange('fill', e.target.value)}
            className="w-12 h-8 rounded border border-slate-300 cursor-pointer"
          />
          <Input
            value={selectedElement.fill || '#000000'}
            onChange={(e) => handlePropertyChange('fill', e.target.value)}
            className="h-8 flex-1"
          />
        </div>
      </div>

      {/* Stroke */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-slate-700">Stroke</Label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={selectedElement.stroke || '#000000'}
            onChange={(e) => handlePropertyChange('stroke', e.target.value)}
            className="w-12 h-8 rounded border border-slate-300 cursor-pointer"
          />
          <Input
            value={selectedElement.stroke || '#000000'}
            onChange={(e) => handlePropertyChange('stroke', e.target.value)}
            className="h-8 flex-1"
          />
        </div>
        <div>
          <Label className="text-xs text-slate-500">Stroke Width</Label>
          <Slider
            value={[selectedElement.strokeWidth || 1]}
            onValueChange={(value) => handlePropertyChange('strokeWidth', value[0])}
            max={20}
            min={0}
            step={1}
            className="mt-2"
          />
          <div className="text-xs text-slate-500 mt-1">
            {selectedElement.strokeWidth || 1}px
          </div>
        </div>
      </div>

      {/* Text Properties */}
      {selectedElement.type === 'text' && (
        <>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Text</Label>
            <Input
              value={selectedElement.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="h-8"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">Font Size</Label>
            <Slider
              value={[selectedElement.fontSize || 16]}
              onValueChange={(value) => handlePropertyChange('fontSize', value[0])}
              max={100}
              min={8}
              step={1}
            />
            <div className="text-xs text-slate-500">
              {selectedElement.fontSize || 16}px
            </div>
          </div>
        </>
      )}
    </div>
  );
};
