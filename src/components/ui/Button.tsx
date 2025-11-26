import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-accent-blue text-white hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/25",
        secondary: "bg-system-fill-secondary text-system-label-primary hover:bg-system-fill-primary backdrop-blur-md",
        ghost: "bg-transparent text-system-label-primary hover:bg-system-fill-quaternary",
        glass: "bg-system-material-thin text-white border border-white/10 hover:bg-system-material-regular backdrop-blur-md shadow-lg"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
        md: "h-10 px-4 text-sm rounded-xl gap-2",
        lg: "h-12 px-6 text-base rounded-2xl gap-2.5"
    };

    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.96 }}
            className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
            <span className={clsx("flex items-center gap-2", isLoading && "opacity-0")}>
                {leftIcon}
                {children}
                {rightIcon}
            </span>
        </motion.button>
    );
});

Button.displayName = 'Button';
