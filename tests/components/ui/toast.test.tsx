/**
 * Toast Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastContainer, useToast, useToastStore } from '@/components/ui/Toast';
import { act } from 'react';

describe('Toast', () => {
  beforeEach(() => {
    // Clear all toasts before each test
    useToastStore.setState({ toasts: [] });
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ToastContainer', () => {
    it('renders empty container initially', () => {
      const { container } = render(<ToastContainer />);
      expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });

    it('displays success toast', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'success',
          title: 'Success!',
          message: 'Operation completed',
        });
      });

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('displays error toast', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'error',
          title: 'Error!',
          message: 'Something went wrong',
        });
      });

      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays warning toast', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'warning',
          title: 'Warning!',
        });
      });

      expect(screen.getByText('Warning!')).toBeInTheDocument();
    });

    it('displays info toast', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'info',
          title: 'Information',
        });
      });

      expect(screen.getByText('Information')).toBeInTheDocument();
    });

    it('auto-removes toast after duration', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'success',
          title: 'Temporary',
          duration: 3000,
        });
      });

      expect(screen.getByText('Temporary')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      waitFor(() => {
        expect(screen.queryByText('Temporary')).not.toBeInTheDocument();
      });
    });

    it('removes toast on close button click', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'success',
          title: 'Closeable',
        });
      });

      const closeButton = screen.getByLabelText('Close notification');
      fireEvent.click(closeButton);

      act(() => {
        vi.advanceTimersByTime(300); // Animation duration
      });

      waitFor(() => {
        expect(screen.queryByText('Closeable')).not.toBeInTheDocument();
      });
    });

    it('displays multiple toasts', () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast({
          type: 'success',
          title: 'First',
        });
        useToastStore.getState().addToast({
          type: 'error',
          title: 'Second',
        });
      });

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    function TestComponent() {
      const toast = useToast();

      return (
        <div>
          <button onClick={() => toast.success('Success!')}>Success</button>
          <button onClick={() => toast.error('Error!')}>Error</button>
          <button onClick={() => toast.warning('Warning!')}>Warning</button>
          <button onClick={() => toast.info('Info!')}>Info</button>
        </div>
      );
    }

    it('provides success method', () => {
      render(
        <>
          <TestComponent />
          <ToastContainer />
        </>
      );

      fireEvent.click(screen.getByText('Success'));

      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('provides error method', () => {
      render(
        <>
          <TestComponent />
          <ToastContainer />
        </>
      );

      fireEvent.click(screen.getByText('Error'));

      expect(screen.getByText('Error!')).toBeInTheDocument();
    });

    it('provides warning method', () => {
      render(
        <>
          <TestComponent />
          <ToastContainer />
        </>
      );

      fireEvent.click(screen.getByText('Warning'));

      expect(screen.getByText('Warning!')).toBeInTheDocument();
    });

    it('provides info method', () => {
      render(
        <>
          <TestComponent />
          <ToastContainer />
        </>
      );

      fireEvent.click(screen.getByText('Info'));

      expect(screen.getByText('Info!')).toBeInTheDocument();
    });
  });
});
