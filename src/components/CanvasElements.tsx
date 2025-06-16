
import React, { useCallback } from 'react';
import { Rect, Circle, Text, Line, Transformer } from 'react-konva';
import { useDesignStore, DesignElement } from '../hooks/useDesignStore';

interface CanvasElementsProps {
  elements: DesignElement[];
  selectedElement: DesignElement | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectedTool: string;
  onAddElement: (element: Omit<DesignElement, 'id'>) => void;
}

export const CanvasElements: React.FC<CanvasElementsProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  selectedTool,
  onAddElement,
}) => {
  const transformerRef = React.useRef<any>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (selectedElement && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#${selectedElement.id}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement]);

  const handleStageMouseDown = useCallback((e: any) => {
    if (selectedTool === 'select' || selectedTool === 'move') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    switch (selectedTool) {
      case 'rectangle':
        onAddElement({
          type: 'rectangle',
          x: point.x,
          y: point.y,
          width: 100,
          height: 100,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2,
          visible: true,
        });
        break;
      case 'circle':
        onAddElement({
          type: 'circle',
          x: point.x,
          y: point.y,
          radius: 50,
          fill: '#8b5cf6',
          stroke: '#7c3aed',
          strokeWidth: 2,
          visible: true,
        });
        break;
      case 'text':
        onAddElement({
          type: 'text',
          x: point.x,
          y: point.y,
          text: 'Double click to edit',
          fontSize: 24,
          fill: '#1f2937',
          visible: true,
        });
        break;
      case 'pen':
        setIsDrawing(true);
        setCurrentPath([point.x, point.y]);
        break;
    }
  }, [selectedTool, onAddElement]);

  const handleStageMouseMove = useCallback((e: any) => {
    if (!isDrawing || selectedTool !== 'pen') return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setCurrentPath(prev => [...prev, point.x, point.y]);
  }, [isDrawing, selectedTool]);

  const handleStageMouseUp = useCallback(() => {
    if (isDrawing && selectedTool === 'pen' && currentPath.length > 4) {
      onAddElement({
        type: 'path',
        x: 0,
        y: 0,
        points: currentPath,
        stroke: '#1f2937',
        strokeWidth: 3,
        fill: '',
        visible: true,
      });
    }
    setIsDrawing(false);
    setCurrentPath([]);
  }, [isDrawing, selectedTool, currentPath, onAddElement]);

  const handleElementClick = useCallback((id: string) => {
    onSelectElement(id);
  }, [onSelectElement]);

  const handleElementDragEnd = useCallback((id: string, e: any) => {
    onUpdateElement(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [onUpdateElement]);

  const handleTransformEnd = useCallback((id: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    node.scaleX(1);
    node.scaleY(1);
    
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const updates: Partial<DesignElement> = {
      x: node.x(),
      y: node.y(),
    };

    if (element.type === 'rectangle') {
      updates.width = Math.max(5, node.width() * scaleX);
      updates.height = Math.max(5, node.height() * scaleY);
    } else if (element.type === 'circle') {
      updates.radius = Math.max(5, node.radius() * Math.max(scaleX, scaleY));
    } else if (element.type === 'text') {
      updates.fontSize = Math.max(8, (element.fontSize || 16) * scaleX);
    }

    onUpdateElement(id, updates);
  }, [elements, onUpdateElement]);

  return (
    <>
      {/* Stage event handlers */}
      <Rect
        x={-10000}
        y={-10000}
        width={20000}
        height={20000}
        fill="transparent"
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      />
      
      {/* Render elements */}
      {elements.map((element) => {
        if (element.visible === false) return null;
        
        const commonProps = {
          id: element.id,
          key: element.id,
          x: element.x,
          y: element.y,
          draggable: selectedTool === 'select' || selectedTool === 'move',
          onClick: () => handleElementClick(element.id),
          onDragEnd: (e: any) => handleElementDragEnd(element.id, e),
          onTransformEnd: (e: any) => handleTransformEnd(element.id, e),
        };

        switch (element.type) {
          case 'rectangle':
            return (
              <Rect
                {...commonProps}
                width={element.width}
                height={element.height}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
              />
            );
          case 'circle':
            return (
              <Circle
                {...commonProps}
                radius={element.radius}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
              />
            );
          case 'text':
            return (
              <Text
                {...commonProps}
                text={element.text}
                fontSize={element.fontSize}
                fill={element.fill}
              />
            );
          case 'path':
            return (
              <Line
                {...commonProps}
                points={element.points}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            );
          default:
            return null;
        }
      })}

      {/* Current drawing path */}
      {isDrawing && currentPath.length > 2 && (
        <Line
          points={currentPath}
          stroke="#1f2937"
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {/* Transformer */}
      {selectedElement && (selectedTool === 'select' || selectedTool === 'move') && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
