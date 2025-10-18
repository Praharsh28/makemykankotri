/**
 * AI Generator Plugin Types
 */

import { Template } from '@/core/types';

export interface V0Config {
  apiKey?: string;
  endpoint?: string;
  maxTokens?: number;
  timeout?: number;
}

export interface V0GenerationResult {
  success: boolean;
  template?: Template;
  code?: string;
  error?: string;
  timestamp: number;
}

export interface V0ApiResponse {
  code: string;
  framework: string;
  dependencies: string[];
  preview_url?: string;
}

export interface TemplateParseResult {
  elements: Array<{
    type: string;
    content: string;
    position?: { x: number; y: number; z: number };
    style?: Record<string, unknown>;
  }>;
  layout: {
    width: number;
    height: number;
    background: string;
  };
  metadata: {
    name: string;
    description: string;
    tags: string[];
  };
}
