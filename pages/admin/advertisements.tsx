"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Advertisement = {
    _id: string;
    title: string;
    position: string;
    link?: string;
    active: boolean;
    startDate?: string;
    endDate?: string;
};

export default function AdvertisementsAdmin() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Advertisement | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        position: string;
        link: string;
        active: boolean;
        startDate: string;
        endDate: string;
        image?: any;
        video?: any;
    }>({
        title: "",
        position: "ad-one",
        link: "",
        active: true,
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            // We need a new API endpoint to fetch ALL ads for admin, not just active ones
            // For now, we'll reuse the existing one but we might need to update it or create a new one
            // Let's create a specific admin fetch in the component for now using GROQ if needed, 
            // but better to use the API we created.
            // The current /api/sanity/advertisement fetches by position.
            // We should probably update the admin API to fetch all.

            // Let's assume we update the admin API to support GET all
            const res = await fetch(`/api/admin/advertisements?t=${Date.now()}`); // We need to implement GET in this route
            if (res.ok) {
                const data = await res.json();
                setAds(data);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this ad?")) return;

        // Optimistic update
        const previousAds = [...ads];
        setAds(ads.filter(ad => ad._id !== id));

        try {
            const res = await fetch(`/api/admin/advertisements?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                // fetchAds(); // No need to re-fetch
                alert("✅ Advertisement deleted successfully!");
            } else {
                setAds(previousAds); // Revert
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setAds(previousAds); // Revert
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/advertisements";
            const method = editingItem ? "PATCH" : "POST";

            // Sanitize data
            const sanitizedData = { ...formData };
            if (!sanitizedData.link) delete (sanitizedData as any).link;
            if (!sanitizedData.startDate) delete (sanitizedData as any).startDate;
            if (!sanitizedData.endDate) delete (sanitizedData as any).endDate;

            const body = editingItem ? { _id: editingItem._id, ...sanitizedData } : sanitizedData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const savedItem = await res.json();

            if (res.ok) {
                setShowForm(false);
                setEditingItem(null);
                setFormData({
                    title: "",
                    position: "ad-one",
                    link: "",
                    active: true,
                    startDate: "",
                    endDate: "",
                });

                // Update local state
                if (method === "POST") {
                    setAds([savedItem, ...ads]);
                } else {
                    setAds(ads.map(ad => ad._id === savedItem._id ? savedItem : ad));
                }

                alert("✅ Advertisement saved successfully!");
            } else {
                throw new Error(savedItem.error || "Failed to save");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("❌ Error saving. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminAuthGuard>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                                <h1 className="text-2xl font-black text-gray-900">Advertisements</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({
                                        title: "",
                                        position: "ad-one",
                                        link: "",
                                        active: true,
                                        startDate: "",
                                        endDate: "",
                                    });
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add Ad</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{editingItem ? "Edit Ad" : "Add Ad"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Upload Image OR Video *</label>
                                        <p className="text-xs text-gray-600 mb-3">Choose either an image or video for this advertisement</p>

                                        {/* Preview */}
                                        {(formData.image || formData.video || (editingItem as any)?.image || (editingItem as any)?.video) && (
                                            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                                <p className="text-xs font-bold text-gray-700 mb-2">Current Upload:</p>
                                                {(formData.image || (editingItem as any)?.image) && (
                                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                                                        <img
                                                            src={formData.image?.previewUrl || (editingItem as any)?.image || ''}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Image</span>
                                                    </div>
                                                )}
                                                {(formData.video || (editingItem as any)?.video) && !formData.image && !(editingItem as any)?.image && (
                                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-900 flex items-center justify-center">
                                                        <span className="text-white text-sm">Video Uploaded</span>
                                                        <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">Video</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-2">Upload Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const data = new FormData();
                                                        data.append("file", file);

                                                        try {
                                                            const res = await fetch("/api/admin/upload?type=image", {
                                                                method: "POST",
                                                                body: data,
                                                            });
                                                            const asset = await res.json();
                                                            if (asset._id) {
                                                                setFormData({
                                                                    ...formData,
                                                                    image: {
                                                                        _type: "image",
                                                                        asset: {
                                                                            _type: "reference",
                                                                            _ref: asset._id,
                                                                        },
                                                                        previewUrl: asset.url, // Store URL for preview
                                                                    } as any,
                                                                    video: undefined, // Clear video if image is uploaded
                                                                });
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload failed", err);
                                                            alert("Image upload failed");
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-gray-900 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-2 border-gray-300 rounded-xl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-2">Upload Video</label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const data = new FormData();
                                                        data.append("file", file);

                                                        try {
                                                            const res = await fetch("/api/admin/upload?type=file", {
                                                                method: "POST",
                                                                body: data,
                                                            });
                                                            const asset = await res.json();
                                                            if (asset._id) {
                                                                setFormData({
                                                                    ...formData,
                                                                    video: {
                                                                        _type: "file",
                                                                        asset: {
                                                                            _type: "reference",
                                                                            _ref: asset._id,
                                                                        },
                                                                    } as any,
                                                                    image: undefined, // Clear image if video is uploaded
                                                                });
                                                                alert("Video uploaded successfully!");
                                                            }
                                                        } catch (err) {
                                                            console.error("Upload failed", err);
                                                            alert("Video upload failed");
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-gray-900 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border-2 border-gray-300 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                            placeholder="Advertisement title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Position *</label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                        >
                                            <option value="ad-one">Sidebar Top (Ad One)</option>
                                            <option value="ad-two">Sidebar Middle (Ad Two)</option>
                                            <option value="banner">Banner</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Link URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-900">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-gray-900">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="ad-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
                                        />
                                        <label htmlFor="ad-active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-1"
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold order-2 sm:order-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {ads.map((ad) => (
                            <div
                                key={ad._id}
                                className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                                onClick={() => {
                                    setEditingItem(ad);
                                    setFormData({
                                        title: ad.title,
                                        position: ad.position,
                                        link: ad.link || "",
                                        active: ad.active,
                                        startDate: ad.startDate || "",
                                        endDate: ad.endDate || "",
                                    });
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-lg text-gray-900 break-words">{ad.title}</h3>
                                    <p className="text-gray-700 text-sm font-medium break-words">Position: {ad.position}</p>
                                    <p className="text-sm text-gray-600 break-words">
                                        {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : 'No start'} -
                                        {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'No end'}
                                    </p>
                                    <p className="text-xs mt-2">
                                        <span className={`px-2 py-1 rounded ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {ad.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => {
                                            setEditingItem(ad);
                                            setFormData({
                                                title: ad.title,
                                                position: ad.position,
                                                link: ad.link || "",
                                                active: ad.active,
                                                startDate: ad.startDate || "",
                                                endDate: ad.endDate || "",
                                            });
                                            setShowForm(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}
