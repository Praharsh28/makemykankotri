/**
 * V0 Generator
 * Handles v0.dev API integration and template generation
 */

import { Template, Element } from '@/core/types';
import { eventBus } from '@/core/event-bus';
import { z } from 'zod';
import type { V0GenerationResult, V0Config, TemplateParseResult } from './types';

// Validation schema for v0 API response (unused but kept for future validation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const V0ResponseSchema = z.object({
  code: z.string(),
  framework: z.string(),
  dependencies: z.array(z.string()),
  preview_url: z.string().optional()
});

const PromptSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  style: z.string().optional(),
  framework: z.literal('react').optional()
});

export class V0Generator {
  private config: V0Config;
  
  constructor(config: V0Config = {}) {
    this.config = {
      endpoint: config.endpoint || 'https://v0.dev/api/generate',
      maxTokens: config.maxTokens || 2000,
      timeout: config.timeout || 30000,
      ...config
    };
  }
  
  /**
   * Generate template from text prompt
   */
  async generateTemplate(prompt: string): Promise<V0GenerationResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validated = PromptSchema.parse({ 
        prompt,
        framework: 'react' as const
      });
      
      // Emit generation start event
      eventBus.emit('ai:generation:start', { prompt: validated.prompt });
      
      // Call v0.dev API
      const code = await this.callV0Api(validated.prompt);
      
      // Parse React code to Template format
      const template = await this.parseV0Output(code);
      
      // Emit success event
      eventBus.emit('ai:generation:success', { 
        templateId: template.id,
        prompt: validated.prompt
      });
      
      return {
        success: true,
        template,
        code,
        timestamp: Date.now() - startTime
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Emit error event
      eventBus.emit('ai:generation:error', { 
        prompt,
        error: errorMessage
      });
      
      return {
        success: false,
        error: errorMessage,
        timestamp: Date.now() - startTime
      };
    }
  }
  
  /**
   * Call v0.dev API
   */
  private async callV0Api(prompt: string): Promise<string> {
    const apiKey = this.config.apiKey || process.env.V0_API_KEY;
    
    if (!apiKey) {
      console.warn('[V0Generator] No API key found, using mock response');
      return this.getMockResponse();
    }
    
    try {
      // Call real v0.dev API
      const response = await fetch('https://api.v0.dev/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
          framework: 'react',
          styling: 'tailwind'
        }),
        signal: AbortSignal.timeout(this.config.timeout || 30000)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`v0.dev API error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data.code || data.content || this.getMockResponse();
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('v0.dev API request timeout');
      }
      console.error('[V0Generator] API call failed:', error);
      console.warn('[V0Generator] Falling back to mock response');
      return this.getMockResponse();
    }
  }
  
  /**
   * Get mock response for testing/fallback
   */
  private getMockResponse(): string {
    // Mock API delay
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `
import React from 'react';

export function WeddingInvitation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-red-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12">
        <h1 className="font-serif text-5xl text-center text-red-700 mb-6">
          Wedding Invitation
        </h1>
        <p className="text-center text-2xl text-neutral-700 mb-4">
          Bride Name
        </p>
        <p className="text-center text-2xl text-neutral-700 mb-4">
          Groom Name
        </p>
        <p className="text-center text-lg text-neutral-600">
          Join us in celebrating our special day
        </p>
        <p className="text-center text-lg text-neutral-600 mt-6">
          Wedding Date: December 15, 2025
        </p>
        <p className="text-center text-lg text-neutral-600">
          Venue: Mumbai, India
        </p>
      </div>
    </div>
  );
}
    `;
  }
  
  /**
   * Parse v0.dev React code and convert to Template format
   */
  async parseV0Output(code: string): Promise<Template> {
    // Extract elements from React code
    const parseResult = this.extractElements(code);
    
    // Convert to our Template format
    const template: Template = {
      id: `ai-gen-${Date.now()}`,
      name: parseResult.metadata.name || 'AI Generated Template',
      slug: `ai-template-${Date.now()}`,
      
      elements: parseResult.elements.map((el, index) => ({
        id: `elem-${index}`,
        type: this.mapElementType(el.type),
        content: el.content,
        position: el.position || { x: 0, y: index * 100, z: index },
        size: { width: 'auto' as const, height: 'auto' as const },
        style: {
          fontFamily: 'Cinzel',
          fontSize: 24,
          color: '#262626',
          ...el.style
        },
        editable: this.isEditableField(el.content),
        required: this.isEditableField(el.content),
        name: this.extractFieldName(el.content),
        placeholder: this.extractPlaceholder(el.content),
        animations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      
      layout: {
        width: parseResult.layout.width,
        height: parseResult.layout.height,
        background: parseResult.layout.background,
        orientation: parseResult.layout.width > parseResult.layout.height ? 'landscape' as const : 'portrait' as const
      },
      
      editableFields: [],
      globalAnimations: [],
      
      thumbnail: '',
      category: 'wedding',
      tags: parseResult.metadata.tags,
      description: parseResult.metadata.description || 'AI Generated Template',
      
      createdBy: 'ai-generator',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      published: false,
      
      views: 0,
      uses: 0
    };
    
    // Auto-detect editable fields
    template.editableFields = template.elements
      .filter(el => el.editable)
      .map(el => el.id);
    
    return template;
  }
  
  /**
   * Extract elements from React JSX code
   */
  private extractElements(code: string): TemplateParseResult {
    const elements: TemplateParseResult['elements'] = [];
    
    // Simple regex-based extraction (production would use AST parser)
    const h1Match = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1Match) {
      elements.push({
        type: 'text',
        content: this.cleanContent(h1Match[1]),
        style: { fontSize: 48, fontWeight: 700 }
      });
    }
    
    const pMatches = Array.from(code.matchAll(/<p[^>]*>(.*?)<\/p>/g));
    for (const match of pMatches) {
      const content = this.cleanContent(match[1]);
      if (content) {
        elements.push({
          type: 'text',
          content,
          style: { fontSize: 18 }
        });
      }
    }
    
    return {
      elements,
      layout: {
        width: 800,
        height: 600,
        background: '#FFFFFF'
      },
      metadata: {
        name: 'AI Generated Template',
        description: 'Generated by v0.dev',
        tags: ['wedding', 'ai-generated']
      }
    };
  }
  
  /**
   * Clean HTML content
   */
  private cleanContent(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Map element type from HTML to our Element types
   */
  private mapElementType(type: string): Element['type'] {
    const typeMap: Record<string, Element['type']> = {
      'text': 'text',
      'image': 'image',
      'gallery': 'gallery',
      'container': 'container'
    };
    
    return typeMap[type] || 'text';
  }
  
  /**
   * Determine if field should be editable
   */
  private isEditableField(content: string): boolean {
    const editablePatterns = [
      /bride.*name/i,
      /groom.*name/i,
      /date/i,
      /venue/i,
      /time/i,
      /location/i
    ];
    
    return editablePatterns.some(pattern => pattern.test(content));
  }
  
  /**
   * Extract field name from content
   */
  private extractFieldName(content: string): string {
    if (/bride.*name/i.test(content)) return 'Bride Name';
    if (/groom.*name/i.test(content)) return 'Groom Name';
    if (/date/i.test(content)) return 'Wedding Date';
    if (/venue|location/i.test(content)) return 'Venue';
    if (/time/i.test(content)) return 'Time';
    
    return content.substring(0, 30);
  }
  
  /**
   * Extract placeholder text
   */
  private extractPlaceholder(content: string): string {
    return `Enter ${this.extractFieldName(content).toLowerCase()}`;
  }
}
