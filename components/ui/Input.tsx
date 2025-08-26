import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'error' | 'success';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    inputSize = 'md', // Updated prop name
    leftIcon, 
    rightIcon, 
    label, 
    error, 
    id, 
    ...props 
  }, ref) => {
    const [isClient, setIsClient] = useState(false);
    const [inputId, setInputId] = useState(id || 'input-placeholder');
    
    // Generate unique ID only on client-side after hydration
    useEffect(() => {
      setIsClient(true);
      if (!id) {
        setInputId(`input-${Math.random().toString(36).substr(2, 9)}`);
      }
    }, [id]);
    
    const baseStyles = "flex w-full rounded-lg border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      default: "border-gray-300 focus-visible:ring-blue-500 dark:border-gray-600 dark:placeholder:text-gray-400",
      error: "border-red-500 focus-visible:ring-red-500 dark:border-red-400",
      success: "border-green-500 focus-visible:ring-green-500 dark:border-green-400"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-4 text-lg"
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6"
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",
              iconSizes[inputSize] // Updated prop name
            )}>
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              baseStyles,
              variants[variant],
              sizes[inputSize], // Updated prop name
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
              iconSizes[inputSize] // Updated prop name
            )}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;


