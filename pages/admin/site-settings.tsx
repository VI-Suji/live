"use client";

import { useState, useEffect } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";

type SiteSettings = {
    _id?: string;
    liveStreamVisible: boolean;
    heroSectionVisible: boolean;
    advertisementsVisible: boolean;
    latestNewsVisible: boolean;
    topStoriesVisible: boolean;
};

export default function SiteSettingsAdmin() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<SiteSettings>({
        liveStreamVisible: true,
        heroSectionVisible: true,
        advertisementsVisible: true,
        latestNewsVisible: true,
        topStoriesVisible: true,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`/api/sanity/siteSettings?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data && !data.error) {
                    setSettings(data);
                    setFormData({
                        liveStreamVisible: data.liveStreamVisible ?? true,
                        heroSectionVisible: data.heroSectionVisible ?? true,
                        advertisementsVisible: data.advertisementsVisible ?? true,
                        latestNewsVisible: data.latestNewsVisible ?? true,
                        topStoriesVisible: data.topStoriesVisible ?? true,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/site-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const responseData = await res.json();

            if (res.ok) {
                setSettings(responseData);
                setFormData({
                    liveStreamVisible: responseData.liveStreamVisible ?? true,
                    heroSectionVisible: responseData.heroSectionVisible ?? true,
                    advertisementsVisible: responseData.advertisementsVisible ?? true,
                    latestNewsVisible: responseData.latestNewsVisible ?? true,
                    topStoriesVisible: responseData.topStoriesVisible ?? true,
                });
                setMessage({ type: 'success', text: '✅ Settings updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const errorMsg = responseData.message || responseData.error || "Failed to save";
                setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
            }
        } catch (error) {
            console.error("Error saving:", error);
            setMessage({ type: 'error', text: '❌ Error saving. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminAuthGuard>
            <AdminLayout
                title="Site Settings"
                description="Control visibility of sections on your website"
                maxWidth="2xl"
            >
                {message && (
                    <Alert type={message.type}>
                        {message.text}
                    </Alert>
                )}

                <AdminCard>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Section Visibility</h3>

                                {/* Live Stream */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="liveStream" className="font-bold text-gray-900 cursor-pointer block">
                                            Live Stream Section
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Show/hide the YouTube live stream on homepage</p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto">
                                        <input
                                            type="checkbox"
                                            id="liveStream"
                                            checked={formData.liveStreamVisible}
                                            onChange={(e) => setFormData({ ...formData, liveStreamVisible: e.target.checked })}
                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="heroSection" className="font-bold text-gray-900 cursor-pointer block">
                                            Hero Section
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Show/hide the hero section on homepage</p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto">
                                        <input
                                            type="checkbox"
                                            id="heroSection"
                                            checked={formData.heroSectionVisible}
                                            onChange={(e) => setFormData({ ...formData, heroSectionVisible: e.target.checked })}
                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Advertisements */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="advertisements" className="font-bold text-gray-900 cursor-pointer block">
                                            Advertisements
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Show/hide all advertisements on the site</p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto">
                                        <input
                                            type="checkbox"
                                            id="advertisements"
                                            checked={formData.advertisementsVisible}
                                            onChange={(e) => setFormData({ ...formData, advertisementsVisible: e.target.checked })}
                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Latest News */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="latestNews" className="font-bold text-gray-900 cursor-pointer block">
                                            Latest News Widget
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Show/hide the latest news widget on homepage</p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto">
                                        <input
                                            type="checkbox"
                                            id="latestNews"
                                            checked={formData.latestNewsVisible}
                                            onChange={(e) => setFormData({ ...formData, latestNewsVisible: e.target.checked })}
                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Top Stories */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="topStories" className="font-bold text-gray-900 cursor-pointer block">
                                            Top Stories Section
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Show/hide the top stories section on homepage</p>
                                    </div>
                                    <div className="flex items-center justify-end w-full sm:w-auto">
                                        <input
                                            type="checkbox"
                                            id="topStories"
                                            checked={formData.topStoriesVisible}
                                            onChange={(e) => setFormData({ ...formData, topStoriesVisible: e.target.checked })}
                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Settings"}
                            </Button>
                        </form>
                    )}
                </AdminCard>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
