/**
 * Core types for WebKankotri v2
 * Base interfaces for the entire system
 */

// ============================================================================
// PLUGIN SYSTEM TYPES
// ============================================================================

export interface Plugin {
  name: string;
  version: string;
  dependencies?: string[];
  install(registry: PluginRegistry): void | Promise<void>;
  uninstall?(): void | Promise<void>;
  description?: string;
  author?: string;
}

export interface PluginRegistry {
  register(plugin: Plugin): void;
  unregister(pluginName: string): void;
  getPlugin(pluginName: string): Plugin | undefined;
  hasPlugin(pluginName: string): boolean;
  getAllPlugins(): Plugin[];
}

// ============================================================================
// ELEMENT TYPES
// ============================================================================

export type ElementType = 'text' | 'image' | 'gallery' | 'container';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number | 'auto';
  height: number | 'auto';
}

export interface Spacing {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface BorderStyle {
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'none';
  color?: string;
  radius?: number;
}

export interface ElementStyle {
  font?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  background?: string;
  border?: BorderStyle;
  padding?: Spacing;
  margin?: Spacing;
  opacity?: number;
  transform?: string;
  [key: string]: unknown;
}

export interface ValidationRule {
  type: 'string' | 'number' | 'email' | 'url' | 'date' | 'custom';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: unknown) => boolean;
}

export interface Animation {
  id: string;
  name: string;
  type: 'gsap' | 'konva' | 'framer' | 'css';
  config: Record<string, unknown>;
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface Asset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface Element {
  // Identity
  id: string;
  type: ElementType;
  
  // Content
  content: string | Asset | Element[];
  placeholder?: string;
  
  // Visual Properties
  position: Position;
  size: Size;
  style: ElementStyle;
  
  // Behavior
  editable: boolean;
  required?: boolean;
  validation?: ValidationRule;
  
  // Animations
  animations: Animation[];
  
  // Metadata
  locked?: boolean;
  hidden?: boolean;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface TemplateLayout {
  width: number;
  height: number;
  background: string;
  orientation: 'portrait' | 'landscape';
}

export interface Template {
  // Identity
  id: string;
  name: string;
  slug: string;
  
  // Content
  elements: Element[];
  
  // Configuration
  editableFields: string[];
  layout: TemplateLayout;
  
  // Animations
  globalAnimations: Animation[];
  
  // Metadata
  thumbnail: string;
  category: string;
  tags: string[];
  description: string;
  
  // Admin Info
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  published: boolean;
  
  // Analytics
  views: number;
  uses: number;
}

// ============================================================================
// USER DATA TYPES
// ============================================================================

export interface UserData {
  // Identity
  templateId: string;
  userId: string;
  
  // User Input
  fields: Record<string, unknown>;
  
  // Generated Output
  generatedUrl: string;
  
  // Metadata
  createdAt: Date;
  expiresAt?: Date;
  
  // Sharing
  views: number;
  shares: number;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export type EventCallback<T = unknown> = (data: T) => void | Promise<void>;

export interface EventBus {
  on<T = unknown>(event: string, callback: EventCallback<T>): void;
  off<T = unknown>(event: string, callback: EventCallback<T>): void;
  emit<T = unknown>(event: string, data?: T): void;
  once<T = unknown>(event: string, callback: EventCallback<T>): void;
}

// ============================================================================
// FEATURE FLAGS TYPES
// ============================================================================

export interface FeatureFlags {
  isEnabled(featureName: string): boolean;
  enable(featureName: string): void;
  disable(featureName: string): void;
  getAll(): Record<string, boolean>;
}

// ============================================================================
// EDITOR STATE TYPES
// ============================================================================

export interface EditorState {
  selectedElement: Element | null;
  template: Template | null;
  history: Template[];
  historyIndex: number;
  clipboard: Element | null;
}

export interface EditorStore extends EditorState {
  // Selection
  setSelectedElement: (element: Element | null) => void;
  
  // Template
  loadTemplate: (template: Template) => void;
  getTemplate: () => Template | null;
  updateTemplate: (updates: Partial<Template>) => void;
  
  // Elements
  addElement: (element: Element) => void;
  updateElement: (elementId: string, updates: Partial<Element>) => void;
  deleteElement: (elementId: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Clipboard
  copy: (element: Element) => void;
  paste: () => void;
  
  // Editable fields
  markEditable: (elementIds: string[]) => void;
}
