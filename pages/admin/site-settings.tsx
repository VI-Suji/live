"use client";

import { useState, useEffect } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";

type HeaderImage = {
    _type: 'image';
    asset: { _type: 'reference'; _ref: string };
    url?: string;
    _key?: string;
};

type SiteSettings = {
    _id?: string;
    liveStreamVisible: boolean;
    heroSectionVisible: boolean;
    advertisementsVisible: boolean;
    latestNewsVisible: boolean;
    topStoriesVisible: boolean;
    headerImages?: HeaderImage[];
    rotationInterval?: number;
};

export default function SiteSettingsAdmin() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSavedSuccess, setShowSavedSuccess] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<SiteSettings>({
        liveStreamVisible: true,
        heroSectionVisible: true,
        advertisementsVisible: true,
        latestNewsVisible: true,
        topStoriesVisible: true,
        headerImages: [],
        rotationInterval: 20
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
                        headerImages: data.headerImages || [],
                        rotationInterval: data.rotationInterval || 20
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
                    headerImages: responseData.headerImages || [],
                    rotationInterval: responseData.rotationInterval || 20
                });
                setMessage({ type: 'success', text: '✅ Settings updated successfully!' });
                setShowSavedSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    setMessage(null);
                    setShowSavedSuccess(false);
                }, 3000);
            } else {
                const errorMsg = responseData.message || responseData.error || "Failed to save";
                setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error saving:", error);
            setMessage({ type: 'error', text: '❌ Error saving. Please try again.' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

                                <hr className="border-gray-200 my-8" />

                                <h3 className="text-lg font-bold text-gray-900 mb-4">Header Configuration</h3>

                                {/* Header Images */}
                                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900">Rotating Header Images</h4>
                                        <p className="text-sm text-gray-600 mt-1">Add up to 3 images. If empty, standard logo is used.</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {formData.headerImages?.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={img.url}
                                                    alt={`Header ${idx + 1}`}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...(formData.headerImages || [])];
                                                        newImages.splice(idx, 1);
                                                        setFormData({ ...formData, headerImages: newImages });
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                        {(!formData.headerImages || formData.headerImages.length < 3) && (
                                            <div className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setMessage({ type: 'success', text: 'Uploading image...' });

                                                        const data = new FormData();
                                                        data.append("file", file);

                                                        try {
                                                            const res = await fetch("/api/admin/upload?type=image", {
                                                                method: "POST",
                                                                body: data,
                                                            });
                                                            const asset = await res.json();

                                                            if (asset._id) {
                                                                const newImage = {
                                                                    _type: 'image' as const,
                                                                    asset: {
                                                                        _type: 'reference' as const,
                                                                        _ref: asset._id
                                                                    },
                                                                    url: asset.url
                                                                };

                                                                setFormData({
                                                                    ...formData,
                                                                    headerImages: [...(formData.headerImages || []), newImage]
                                                                });
                                                                setMessage(null);
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload failed", err);
                                                            setMessage({ type: 'error', text: 'Image upload failed' });
                                                        }
                                                    }}
                                                />
                                                <div className="text-gray-400 text-center">
                                                    <span className="text-2xl block mb-1">+</span>
                                                    <span className="text-xs font-bold">Add Image</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rotation Interval */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="rotationInterval" className="font-bold text-gray-900 block">
                                            Rotation Interval (Seconds)
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">Time between image switches</p>
                                    </div>
                                    <div className="flex items-center justify-end w-24">
                                        <input
                                            type="number"
                                            id="rotationInterval"
                                            min="1"
                                            value={formData.rotationInterval}
                                            onChange={(e) => setFormData({ ...formData, rotationInterval: parseInt(e.target.value) || 20 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-gray-900 bg-white font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant={showSavedSuccess ? "success" : "primary"} // assuming success variant exists, if not primary is fine
                                size="lg"
                                fullWidth
                                disabled={saving}
                            >
                                {saving ? "Saving..." : (showSavedSuccess ? "✅ Settings Saved!" : "Save Settings")}
                            </Button>
                        </form>
                    )}
                </AdminCard>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
