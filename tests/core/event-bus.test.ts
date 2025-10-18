import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventBus, EVENT_NAMES } from '@/core/event-bus';

describe('Event Bus', () => {
  beforeEach(() => {
    eventBus.clear();
  });

  it('subscribes to events', () => {
    const callback = vi.fn();
    eventBus.on('test:event', callback);
    
    expect(eventBus.listenerCount('test:event')).toBe(1);
  });

  it('emits events to subscribers', () => {
    const callback = vi.fn();
    eventBus.on('test:event', callback);
    
    eventBus.emit('test:event', { data: 'test' });
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ data: 'test' });
  });

  it('unsubscribes from events', () => {
    const callback = vi.fn();
    eventBus.on('test:event', callback);
    
    eventBus.off('test:event', callback);
    eventBus.emit('test:event', { data: 'test' });
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('handles multiple subscribers', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    
    eventBus.on('test:event', callback1);
    eventBus.on('test:event', callback2);
    
    eventBus.emit('test:event', { data: 'test' });
    
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('once subscribes only once', () => {
    const callback = vi.fn();
    eventBus.once('test:event', callback);
    
    eventBus.emit('test:event', { data: 'test1' });
    eventBus.emit('test:event', { data: 'test2' });
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ data: 'test1' });
  });

  it('handles errors in event handlers', () => {
    const errorCallback = vi.fn(() => {
      throw new Error('Test error');
    });
    const successCallback = vi.fn();
    
    eventBus.on('test:event', errorCallback);
    eventBus.on('test:event', successCallback);
    
    // Should not throw
    expect(() => {
      eventBus.emit('test:event', { data: 'test' });
    }).not.toThrow();
    
    // Both should be called
    expect(errorCallback).toHaveBeenCalled();
    expect(successCallback).toHaveBeenCalled();
  });

  it('gets event names', () => {
    eventBus.on('event1', () => {});
    eventBus.on('event2', () => {});
    
    const eventNames = eventBus.getEventNames();
    expect(eventNames).toContain('event1');
    expect(eventNames).toContain('event2');
  });

  it('clears all events', () => {
    eventBus.on('event1', () => {});
    eventBus.on('event2', () => {});
    
    eventBus.clear();
    
    expect(eventBus.getEventNames()).toHaveLength(0);
  });

  it('provides event name constants', () => {
    expect(EVENT_NAMES.EDITOR_ELEMENT_SELECTED).toBe('editor:element:selected');
    expect(EVENT_NAMES.TEMPLATE_CREATED).toBe('template:created');
    expect(EVENT_NAMES.USER_FORM_SUBMITTED).toBe('user:form:submitted');
  });

  it('handles events with no subscribers', () => {
    expect(() => {
      eventBus.emit('non-existent:event', { data: 'test' });
    }).not.toThrow();
  });

  it('removes event when last subscriber unsubscribes', () => {
    const callback = vi.fn();
    eventBus.on('test:event', callback);
    
    expect(eventBus.getEventNames()).toContain('test:event');
    
    eventBus.off('test:event', callback);
    
    expect(eventBus.getEventNames()).not.toContain('test:event');
  });
});
