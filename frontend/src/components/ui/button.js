import React from 'react';
import { clsx } from 'clsx';

const buttonVariants = {
  default: {
    light: 'bg-black text-white hover:bg-black/90',
    dark: 'dark:bg-white dark:text-black dark:hover:bg-white/90',
  },
  outline: {
    light: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    dark: 'dark:border-input dark:bg-background dark:hover:bg-accent dark:hover:text-accent-foreground',
  },
  secondary: {
    light: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    dark: 'dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80',
  },
  ghost: {
    light: 'hover:bg-accent hover:text-accent-foreground',
    dark: 'dark:hover:bg-accent dark:hover:text-accent-foreground',
  },
};

const Button = React.forwardRef(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = buttonVariants[variant];
    const variantStyles = clsx(
      variantClasses?.light,
      variantClasses?.dark
    );

    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
