/**
 * Container Element Type
 * Container element for grouping child elements
 */

import { Element } from '../../types';
import { elementRegistry } from '../ElementRegistry';

export interface ContainerElementContent extends Element {
  type: 'container';
  content: Element[];
}

// Default container style
const DEFAULT_CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
};

// Default container content
const DEFAULT_CONTAINER_CONTENT: Element[] = [];

// Register container element type
export function registerContainerElement(): void {
  elementRegistry.register('container', {
    name: 'Container',
    icon: '📦',
    defaultContent: DEFAULT_CONTAINER_CONTENT,
    defaultStyle: DEFAULT_CONTAINER_STYLE,
    renderer: (element: Element) => {
      const children = element.content as Element[];
      return `Container (${children.length} children)`;
    },
    validator: (element: Element) => {
      const content = element.content;
      return Array.isArray(content);
    },
  });
}
