import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    showBackButton?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

export default function AdminLayout({
    children,
    title,
    description,
    showBackButton = true,
    maxWidth = '7xl'
}: AdminLayoutProps) {
    const maxWidthClass = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        'full': 'max-w-full'
    }[maxWidth];

    return (
        <div className="admin-shell">
            <header className="admin-header sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {showBackButton && (
                                <Link
                                    href="/admin/dashboard"
                                    className="p-2 hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                >
                                    <FaArrowLeft className="text-[var(--text-secondary)]" />
                                </Link>
                            )}
                            <div>
                                <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{title}</h1>
                                {description && (
                                    <p className="text-sm text-[var(--text-tertiary)] font-medium mt-0.5">{description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                {children}
            </main>
        </div>
    );
}

export function AdminCard({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`admin-card p-6 sm:p-8 ${className}`}>
            {children}
        </div>
    );
}

export function SectionHeader({
    title,
    subtitle,
    action
}: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{title}</h2>
                {subtitle && <p className="text-sm text-[var(--text-tertiary)] font-medium mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function FormInput({
    label,
    required = false,
    optional = false,
    error,
    helpText,
    ...props
}: {
    label: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    helpText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-[11px] font-black mb-2 text-[var(--text-tertiary)] uppercase tracking-widest">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {optional && <span className="text-[var(--text-tertiary)] font-normal ml-1 lowercase">(optional)</span>}
            </label>
            <input
                {...props}
                className={`admin-input ${error ? 'border-red-300 focus:ring-red-100' : ''} ${props.className || ''}`}
            />
            {error && <p className="text-xs text-red-600 font-bold mt-1.5">{error}</p>}
            {helpText && !error && <p className="text-xs text-[var(--text-tertiary)] font-medium mt-1.5">{helpText}</p>}
        </div>
    );
}

export function FormTextarea({
    label,
    required = false,
    optional = false,
    error,
    helpText,
    ...props
}: {
    label: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    helpText?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-[11px] font-black mb-2 text-[var(--text-tertiary)] uppercase tracking-widest">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {optional && <span className="text-[var(--text-tertiary)] font-normal ml-1 lowercase">(optional)</span>}
            </label>
            <textarea
                {...props}
                className={`admin-input ${error ? 'border-red-300 focus:ring-red-100' : ''} ${props.className || ''}`}
            />
            {error && <p className="text-xs text-red-600 font-bold mt-1.5">{error}</p>}
            {helpText && !error && <p className="text-xs text-[var(--text-tertiary)] font-medium mt-1.5">{helpText}</p>}
        </div>
    );
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus:ring-4 focus:ring-[var(--accent-muted)]',
        secondary: 'bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-default)]',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200'
    }[variant];

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }[size];

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            {...props}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${props.className || ''}`}
        >
            {children}
        </button>
    );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }[size];

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`${sizeClass} border-4 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin`} />
        </div>
    );
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action
}: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="text-center py-12">
            {Icon && (
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
                        <Icon className="text-3xl text-[var(--text-tertiary)]" />
                    </div>
                </div>
            )}
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            {description && <p className="text-[var(--text-secondary)] mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}

export function Alert({
    type = 'info',
    children
}: {
    type?: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
}) {
    const classes = {
        success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
        error: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300',
        warning: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
    }[type];

    return (
        <div className={`border rounded-xl p-4 ${classes}`}>
            {children}
        </div>
    );
}
