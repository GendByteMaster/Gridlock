import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
    className,
    variant = 'glass',
    padding = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = "rounded-[32px] overflow-hidden transition-colors";

    const variants = {
        default: "bg-system-background-secondary border border-system-separator-nonOpaque",
        glass: "bg-system-material-regular backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5",
        outline: "bg-transparent border border-white/10"
    };

    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    };

    return (
        <motion.div
            ref={ref}
            className={twMerge(clsx(baseStyles, variants[variant], paddings[padding], className))}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Card.displayName = 'Card';
