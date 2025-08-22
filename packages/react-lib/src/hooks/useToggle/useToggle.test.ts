import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('should initialize with default value (false)', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[1](); // toggle
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1](); // toggle again
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should set specific value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[2](true); // setToggle
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[2](false); // setToggle
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useToggle());
    
    const firstToggle = result.current[1];
    const firstSetToggle = result.current[2];
    
    rerender();
    
    const secondToggle = result.current[1];
    const secondSetToggle = result.current[2];
    
    expect(firstToggle).toBe(secondToggle);
    expect(firstSetToggle).toBe(secondSetToggle);
  });
});
