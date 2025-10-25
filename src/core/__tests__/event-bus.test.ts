/**
 * Event Bus Smoke Tests
 * Verify basic functionality of the event bus
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventBus, EVENT_NAMES } from '../event-bus';

describe('EventBus', () => {
  beforeEach(() => {
    // Clear all listeners before each test
    eventBus.clear();
  });

  it('should emit and receive events', () => {
    const callback = vi.fn();
    eventBus.on(EVENT_NAMES.ELEMENT_CREATED, callback);
    
    const payload = { element: { id: '123', type: 'text' } };
    eventBus.emit(EVENT_NAMES.ELEMENT_CREATED, payload);
    
    expect(callback).toHaveBeenCalledWith(payload);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support multiple listeners on same event', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.on(EVENT_NAMES.TEMPLATE_UPDATED, callback1);
    eventBus.on(EVENT_NAMES.TEMPLATE_UPDATED, callback2);
    
    eventBus.emit(EVENT_NAMES.TEMPLATE_UPDATED, { id: '123' });
    
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should remove listeners with off()', () => {
    const callback = vi.fn();
    eventBus.on(EVENT_NAMES.ELEMENT_DELETED, callback);
    
    eventBus.emit(EVENT_NAMES.ELEMENT_DELETED, { id: '123' });
    expect(callback).toHaveBeenCalledTimes(1);
    
    eventBus.off(EVENT_NAMES.ELEMENT_DELETED, callback);
    eventBus.emit(EVENT_NAMES.ELEMENT_DELETED, { id: '456' });
    
    // Should still be 1, not 2
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support once() for one-time listeners', () => {
    const callback = vi.fn();
    eventBus.once(EVENT_NAMES.TEMPLATE_PUBLISHED, callback);
    
    eventBus.emit(EVENT_NAMES.TEMPLATE_PUBLISHED, { id: '1' });
    eventBus.emit(EVENT_NAMES.TEMPLATE_PUBLISHED, { id: '2' });
    
    // Should only be called once
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ id: '1' });
  });

  it('should clear all listeners', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.on(EVENT_NAMES.ELEMENT_CREATED, callback1);
    eventBus.on(EVENT_NAMES.TEMPLATE_UPDATED, callback2);
    
    eventBus.clear();
    
    eventBus.emit(EVENT_NAMES.ELEMENT_CREATED, {});
    eventBus.emit(EVENT_NAMES.TEMPLATE_UPDATED, {});
    
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  it('should handle emitting events with no listeners', () => {
    // Should not throw
    expect(() => {
      eventBus.emit(EVENT_NAMES.ANIMATION_APPLIED, {});
    }).not.toThrow();
  });

  it('should have all documented EVENT_NAMES constants', () => {
    // Verify critical event names exist
    expect(EVENT_NAMES.ELEMENT_CREATED).toBeDefined();
    expect(EVENT_NAMES.ELEMENT_UPDATED).toBeDefined();
    expect(EVENT_NAMES.ELEMENT_DELETED).toBeDefined();
    expect(EVENT_NAMES.TEMPLATE_CREATED).toBeDefined();
    expect(EVENT_NAMES.TEMPLATE_UPDATED).toBeDefined();
    expect(EVENT_NAMES.TEMPLATE_PUBLISHED).toBeDefined();
  });
});
