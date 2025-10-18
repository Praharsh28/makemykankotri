/**
 * Text Element Type
 * Basic text element for templates
 */

import { Element } from '../../types';
import { elementRegistry } from '../ElementRegistry';

export interface TextElementContent extends Element {
  type: 'text';
  content: string;
}

// Default text style
const DEFAULT_TEXT_STYLE = {
  font: 'Inter',
  fontSize: 16,
  fontWeight: 400,
  color: '#000000',
  textAlign: 'left',
  lineHeight: 1.5,
};

// Register text element type
export function registerTextElement(): void {
  elementRegistry.register('text', {
    name: 'Text',
    icon: '📝',
    defaultContent: 'Enter text',
    defaultStyle: DEFAULT_TEXT_STYLE,
    renderer: (element: Element) => {
      return element.content as string;
    },
    validator: (element: Element) => {
      return typeof element.content === 'string';
    },
  });
}
