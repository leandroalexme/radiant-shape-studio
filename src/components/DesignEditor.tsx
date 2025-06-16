
import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { CanvasElements } from './CanvasElements';
import { useDesignStore } from '../hooks/useDesignStore';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const DesignEditor = () => {
  const stageRef = useRef<any>(null);
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  
  const {
    selectedTool,
    elements,
    selectedElement,
    addElement,
    selectElement,
    updateElement,
    deleteElement,
    exportToSVG
  } = useDesignStore();

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
    setZoom(newScale);
    stage.scale({ x: newScale, y: newScale });
    
    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    
    stage.position(newPos);
    setStagePos(newPos);
    stage.batchDraw();
  }, []);

  const handleStageClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      selectElement(null);
      return;
    }
    
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectElement(null);
    }
  }, [selectElement]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 5);
    setZoom(newZoom);
    if (stageRef.current) {
      stageRef.current.scale({ x: newZoom, y: newZoom });
      stageRef.current.batchDraw();
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
    if (stageRef.current) {
      stageRef.current.scale({ x: newZoom, y: newZoom });
      stageRef.current.batchDraw();
    }
  };

  const handleExport = () => {
    const svg = exportToSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.svg';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Design exported as SVG!');
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Sidebar - Tools */}
      <div className="w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Design Editor
          </h1>
        </div>
        <Toolbar />
        <LayersPanel />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="hover:bg-slate-50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-slate-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="hover:bg-slate-50"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export SVG
          </Button>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-4 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
            <Stage
              ref={stageRef}
              width={window.innerWidth - 320}
              height={window.innerHeight - 120}
              onWheel={handleWheel}
              onClick={handleStageClick}
              scaleX={zoom}
              scaleY={zoom}
              x={stagePos.x}
              y={stagePos.y}
              className="cursor-crosshair"
            >
              <Layer>
                <CanvasElements
                  elements={elements}
                  selectedElement={selectedElement}
                  onSelectElement={selectElement}
                  onUpdateElement={updateElement}
                  selectedTool={selectedTool}
                  onAddElement={addElement}
                />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 bg-white shadow-xl border-l border-slate-200">
        <PropertiesPanel />
      </div>
    </div>
  );
};
