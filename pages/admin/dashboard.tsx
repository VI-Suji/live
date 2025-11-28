"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import {
    FaNewspaper,
    FaMapMarkerAlt,
    FaBell,
    FaUserMd,
    FaCross,
    FaAd,
    FaHome,
    FaSignOutAlt,
    FaBolt,
} from "react-icons/fa";

const contentTypes = [
    {
        name: "Top Stories",
        icon: FaNewspaper,
        href: "/admin/top-stories",
        description: "Manage main news articles",
        color: "from-blue-500 to-blue-600",
    },
    {
        name: "Local News",
        icon: FaMapMarkerAlt,
        href: "/admin/local-news",
        description: "Manage local community news",
        color: "from-green-500 to-green-600",
    },
    {
        name: "Latest News",
        icon: FaBell,
        href: "/admin/latest-news",
        description: "Manage sidebar widget",
        color: "from-yellow-500 to-yellow-600",
    },
    {
        name: "Breaking News",
        icon: FaBolt,
        href: "/admin/breaking-news",
        description: "Manage scrolling ticker (max 3)",
        color: "from-orange-500 to-red-600",
    },
    {
        name: "Hero Section",
        icon: FaHome,
        href: "/admin/hero-section",
        description: "Manage homepage hero",
        color: "from-purple-500 to-purple-600",
    },
    {
        name: "Doctors",
        icon: FaUserMd,
        href: "/admin/doctors",
        description: "Manage doctor listings",
        color: "from-red-500 to-red-600",
    },
    {
        name: "Obituaries",
        icon: FaCross,
        href: "/admin/obituaries",
        description: "Manage obituary notices",
        color: "from-gray-500 to-gray-600",
    },
    {
        name: "Advertisements",
        icon: FaAd,
        href: "/admin/advertisements",
        description: "Manage ads",
        color: "from-pink-500 to-pink-600",
    },
    {
        name: "Site Settings",
        icon: FaHome,
        href: "/admin/site-settings",
        description: "Control section visibility",
        color: "from-indigo-500 to-indigo-600",
    },
];

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        topStories: 0,
        localNews: 0,
        doctors: 0,
        advertisements: 0,
        loading: true
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [topStoriesRes, localNewsRes, doctorsRes, adsRes] = await Promise.all([
                fetch('/api/sanity/topStories'),
                fetch('/api/sanity/localNews'),
                fetch('/api/sanity/doctors'), // This already returns only active doctors
                fetch('/api/admin/advertisements')
            ]);

            const [topStories, localNews, doctors, ads] = await Promise.all([
                topStoriesRes.json(),
                localNewsRes.json(),
                doctorsRes.json(),
                adsRes.json()
            ]);

            setStats({
                topStories: Array.isArray(topStories) ? topStories.length : 0,
                localNews: Array.isArray(localNews) ? localNews.length : 0,
                doctors: Array.isArray(doctors) ? doctors.length : 0, // Already filtered to active
                advertisements: Array.isArray(ads) ? ads.filter((a: any) => a.active).length : 0,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <AdminAuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">ഗ്രാമിക</h1>
                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Admin Dashboard</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors text-sm"
                                >
                                    <FaSignOutAlt />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                    {/* Welcome Section */}
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2 sm:mb-4">
                            Welcome back! 👋
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Manage all your website content from here
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 sm:mb-8 flex flex-wrap gap-3 sm:gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-all text-sm sm:text-base"
                        >
                            View Website →
                        </Link>
                    </div>

                    {/* Content Type Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contentTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <Link
                                    key={type.name}
                                    href={type.href}
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                                >
                                    <div className="p-6">
                                        <div
                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                        >
                                            <Icon className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {type.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{type.description}</p>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            Manage →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <p className="text-sm text-gray-600 mb-1">Total Stories</p>
                            <p className="text-3xl font-black text-gray-900">
                                {stats.loading ? '...' : stats.topStories}
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <p className="text-sm text-gray-600 mb-1">Local News</p>
                            <p className="text-3xl font-black text-gray-900">
                                {stats.loading ? '...' : stats.localNews}
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <p className="text-sm text-gray-600 mb-1">Active Doctors</p>
                            <p className="text-3xl font-black text-gray-900">
                                {stats.loading ? '...' : stats.doctors}
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <p className="text-sm text-gray-600 mb-1">Active Ads</p>
                            <p className="text-3xl font-black text-gray-900">
                                {stats.loading ? '...' : stats.advertisements}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}
