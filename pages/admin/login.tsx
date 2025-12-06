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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-white mb-2">ഗ്രാമിക</h1>
                    <p className="text-gray-400 text-lg">Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to manage your content
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                    >
                        <FcGoogle className="text-2xl" />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Restricted to authorized email only
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
