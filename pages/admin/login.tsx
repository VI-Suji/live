"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminLogin() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn("google", {
                callbackUrl: "/admin/dashboard",
                redirect: false,
            });

            if (result?.error) {
                setError("Access denied. Only gramikaweb@gmail.com is allowed.");
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (err) {
            setError("An error occurred during sign in.");
        }
    };

    return (
        <div className="min-h-screen page-bg flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-display text-3xl sm:text-4xl mb-2">GRAMIKA NEWS ONLINE</h1>
                    <p className="text-[var(--text-tertiary)] text-lg">Admin Portal</p>
                </div>

                <div className="surface-elevated p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-display text-2xl mb-2">Welcome Back</h2>
                        <p className="text-body">Sign in to manage your content</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--border-strong)] text-[var(--text-primary)] font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-[var(--shadow-md)]"
                    >
                        <FcGoogle className="text-2xl" />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[var(--text-tertiary)]">
                            Restricted to authorized email only
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors text-sm"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
