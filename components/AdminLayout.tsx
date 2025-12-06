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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {showBackButton && (
                                <Link
                                    href="/admin/dashboard"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                            )}
                            <div>
                                <h1 className="text-2xl font-black text-gray-900">{title}</h1>
                                {description && (
                                    <p className="text-sm text-gray-600 mt-0.5">{description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                {children}
            </main>
        </div>
    );
}

// Reusable Card Component
export function AdminCard({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 ${className}`}>
            {children}
        </div>
    );
}

// Reusable Section Header
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
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// Reusable Form Input
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
            <label className="block text-sm font-bold mb-2 text-gray-900">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {optional && <span className="text-gray-500 font-normal ml-1">(Optional)</span>}
            </label>
            <input
                {...props}
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:ring-2 transition-colors ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } ${props.className || ''}`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            {helpText && !error && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
        </div>
    );
}

// Reusable Form Textarea
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
            <label className="block text-sm font-bold mb-2 text-gray-900">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {optional && <span className="text-gray-500 font-normal ml-1">(Optional)</span>}
            </label>
            <textarea
                {...props}
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:ring-2 transition-colors ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } ${props.className || ''}`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            {helpText && !error && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
        </div>
    );
}

// Reusable Button
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
    const baseClasses = 'font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200',
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

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }[size];

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
    );
}

// Empty State
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
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="text-3xl text-gray-400" />
                    </div>
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-600 mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}

// Success/Error Alert
export function Alert({
    type = 'info',
    children
}: {
    type?: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
}) {
    const classes = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    }[type];

    return (
        <div className={`border-2 rounded-xl p-4 ${classes}`}>
            {children}
        </div>
    );
}
