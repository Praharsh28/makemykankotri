/**
 * AI Generator Plugin
 * Generates templates from text prompts using v0.dev
 */

import { Plugin } from '@/core/types';
import { featureFlags } from '@/core/feature-flags';

export const aiGeneratorPlugin: Plugin = {
  name: 'ai-generator',
  version: '1.0.0',
  description: 'Generate templates from text prompts using v0.dev',
  
  install: () => {
    featureFlags.enable('ai-generator');
    console.log('[ai-generator] Plugin installed');
  },
  
  uninstall: () => {
    featureFlags.disable('ai-generator');
    console.log('[ai-generator] Plugin uninstalled');
  }
};

export { V0Generator } from './V0Generator';
export { AIPromptDialog } from './AIPromptDialog';
export type { V0GenerationResult, V0Config } from './types';
export type { AIPromptDialogProps } from './AIPromptDialog';
