
import { create } from 'zustand';

export interface DesignElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'path';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  points?: number[];
  visible?: boolean;
}

interface DesignStore {
  selectedTool: 'select' | 'move' | 'rectangle' | 'circle' | 'text' | 'pen';
  elements: DesignElement[];
  selectedElement: DesignElement | null;
  
  setSelectedTool: (tool: DesignStore['selectedTool']) => void;
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => void;
  exportToSVG: () => string;
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  selectedTool: 'select',
  elements: [],
  selectedElement: null,

  setSelectedTool: (tool) => set({ selectedTool: tool }),

  addElement: (element) => {
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement = { ...element, id };
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElement: newElement,
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
      selectedElement: state.selectedElement?.id === id 
        ? { ...state.selectedElement, ...updates }
        : state.selectedElement,
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
    }));
  },

  selectElement: (id) => {
    const state = get();
    const element = id ? state.elements.find((el) => el.id === id) : null;
    set({ selectedElement: element || null });
  },

  duplicateElement: (id) => {
    const state = get();
    const element = state.elements.find((el) => el.id === id);
    if (element) {
      const newId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duplicated = {
        ...element,
        id: newId,
        x: element.x + 20,
        y: element.y + 20,
      };
      set((state) => ({
        elements: [...state.elements, duplicated],
        selectedElement: duplicated,
      }));
    }
  },

  exportToSVG: () => {
    const state = get();
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">\n';
    
    state.elements.forEach((element) => {
      if (element.visible === false) return;
      
      switch (element.type) {
        case 'rectangle':
          svg += `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" />\n`;
          break;
        case 'circle':
          svg += `  <circle cx="${element.x + (element.radius || 0)}" cy="${element.y + (element.radius || 0)}" r="${element.radius}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" />\n`;
          break;
        case 'text':
          svg += `  <text x="${element.x}" y="${element.y + (element.fontSize || 16)}" font-size="${element.fontSize}" fill="${element.fill}">${element.text}</text>\n`;
          break;
        case 'path':
          if (element.points && element.points.length > 2) {
            const pathData = `M ${element.points[0]} ${element.points[1]} ` + 
              element.points.slice(2).reduce((acc, point, index) => {
                return acc + (index % 2 === 0 ? `L ${point} ` : `${point} `);
              }, '');
            svg += `  <path d="${pathData.trim()}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />\n`;
          }
          break;
      }
    });
    
    svg += '</svg>';
    return svg;
  },
}));
