'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

interface ToggleContextValue<T extends string> {
  value: T;
  onChange: (value: T) => void;
}

const ToggleContext = React.createContext<
  ToggleContextValue<string> | undefined
>(undefined);

function useToggleContext<T extends string>() {
  const context = React.useContext(
    ToggleContext as React.Context<ToggleContextValue<T> | undefined>,
  );
  if (!context) {
    throw new Error(
      'ToggleItem must be used within ToggleRoot',
    );
  }
  return context;
}

type DivAttributesWithoutOnChange = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
>;

interface ToggleRootProps extends DivAttributesWithoutOnChange {
  value: string;
  onChange: (value: string) => void;
}

const ToggleRoot = React.forwardRef<
  HTMLDivElement,
  ToggleRootProps
>(({ value, onChange, className, children, ...props }, ref) => {
  return (
    <ToggleContext.Provider value={{ value, onChange }}>
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {children}
      </div>
    </ToggleContext.Provider>
  );
});
ToggleRoot.displayName = 'ToggleRoot';

export interface ToggleItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeClassName?: string;
  inactiveClassName?: string;
  buttonClassName?: string;
}

const ToggleItem = React.forwardRef<
  HTMLButtonElement,
  ToggleItemProps
>(({ value: itemValue, activeClassName, inactiveClassName, buttonClassName, className, children, ...props }, ref) => {
  const { value, onChange } = useToggleContext();
  const isActive = value === itemValue;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onChange(itemValue as any)}
      className={cn(
        'cursor-pointer font-medium',
        isActive ? activeClassName : inactiveClassName,
        buttonClassName,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
ToggleItem.displayName = 'ToggleItem';

export const Toggle = {
  Root: ToggleRoot,
  Item: ToggleItem,
};
