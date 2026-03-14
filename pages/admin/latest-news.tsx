"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type LatestNews = {
    _id: string;
    heading: string;
    content: string;
    date: string;
    active: boolean;
    image?: string;
};

export default function LatestNewsAdmin() {
    const [news, setNews] = useState<LatestNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<LatestNews | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<{
        heading: string;
        content: string;
        date: string;
        active: boolean;
        image?: any;
    }>({
        heading: "",
        content: "",
        date: new Date().toISOString().split('T')[0],
        active: true,
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`/api/sanity/latestNews?all=true&t=${Date.now()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setNews(data);
            } else if (data && !data.error) {
                setNews([data]);
            } else {
                setNews([]);
            }
        } catch (error) {
            console.error("Error fetching latest news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;

        const previousNews = [...news];
        setNews(news.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/admin/latest-news?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Deleted successfully!");
            } else {
                setNews(previousNews);
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setNews(previousNews);
        }
    };

    const handleToggleActive = async (item: LatestNews) => {
        const updatedItem = { ...item, active: !item.active };
        setNews(news.map(n => n._id === item._id ? updatedItem : n));

        try {
            const res = await fetch("/api/admin/latest-news", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: item._id, active: !item.active }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to update status");
            }

            await fetchNews();
        } catch (error: any) {
            console.error("Error updating status:", error);
            setNews(news.map(n => n._id === item._id ? item : n));
            alert("❌ " + (error.message || "Failed to update status"));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = "/api/admin/latest-news";
            const method = editingItem ? "PATCH" : "POST";
            const body = editingItem ? { _id: editingItem._id, ...formData } : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to save");
            }

            alert(editingItem ? "✅ Updated successfully!" : "✅ Created successfully!");
            setShowForm(false);
            setEditingItem(null);
            setFormData({ heading: "", content: "", date: new Date().toISOString().split('T')[0], active: true });
            setPreviewImage("");
            fetchNews();
        } catch (error: any) {
            console.error("Error saving:", error);
            alert("❌ " + (error.message || "Error saving"));
        }
    };

    return (
        <AdminAuthGuard>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">Latest News</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                {news.filter(n => n.active).length < 2 ? (
                                    <button
                                        onClick={() => {
                                            setShowForm(true);
                                            setEditingItem(null);
                                            setFormData({ heading: "", content: "", date: new Date().toISOString().split('T')[0], active: true });
                                            setPreviewImage("");
                                        }}
                                        className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-all hover:scale-105 flex-shrink-0"
                                    >
                                        <FaPlus />
                                        <span className="hidden sm:inline">Add News</span>
                                        <span className="sm:hidden">Add</span>
                                    </button>
                                ) : (
                                    <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                                        Active Limit Reached (Max 2)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{editingItem ? "Edit News" : "Add News"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Image (Optional)</label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {previewImage && (
                                                <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    setPreviewImage(URL.createObjectURL(file));
                                                    setIsUploading(true);

                                                    const data = new FormData();
                                                    data.append("file", file);

                                                    try {
                                                        const res = await fetch("/api/admin/upload?type=image", {
                                                            method: "POST",
                                                            body: data,
                                                        });

                                                        if (!res.ok) throw new Error("Upload failed");

                                                        const asset = await res.json();
                                                        if (asset._id) {
                                                            setPreviewImage(asset.url);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                image: {
                                                                    _type: "image",
                                                                    asset: {
                                                                        _type: "reference",
                                                                        _ref: asset._id,
                                                                    },
                                                                } as any,
                                                            }));
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Image upload failed.");
                                                        setPreviewImage("");
                                                    } finally {
                                                        setIsUploading(false);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-2 border-gray-300 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Heading *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.heading}
                                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="News heading"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Content *</label>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            rows={4}
                                            placeholder="Brief content..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="latest-news-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <label htmlFor="latest-news-active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex-1 text-white py-3 rounded-xl font-bold order-1 sm:order-1 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                                        >
                                            {isUploading ? "Uploading..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingItem(null);
                                            }}
                                            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold order-2 sm:order-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Active News Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-blue-50/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-blue-900 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                            Active Latest News ({news.filter(n => n.active).length}/2)
                                        </h2>
                                        <p className="text-xs text-blue-700 font-medium">Max 2 active. You must disable an active news before adding a new one.</p>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : news.filter(n => n.active).length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-gray-300 mb-2 font-black text-4xl">0</div>
                                    <p className="text-sm text-gray-500 font-bold italic">No active news items.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {news.filter(n => n.active).map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-4 sm:p-6 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                                            onClick={() => {
                                                setEditingItem(item);
                                                setFormData({
                                                    heading: item.heading,
                                                    content: item.content,
                                                    date: item.date,
                                                    active: item.active ?? true,
                                                });
                                                setPreviewImage(item.image || "");
                                                setShowForm(true);
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                {item.image && (
                                                    <div className="relative w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                                                        <img
                                                            src={item.image}
                                                            alt={item.heading}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 w-full">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider text-blue-600">
                                                            {new Date(item.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-base text-gray-900 mb-1 break-words group-hover:text-blue-700 transition-colors">{item.heading}</h3>
                                                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.content}</p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleToggleActive(item)}
                                                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        title="Deactivate"
                                                    >
                                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => {/* Edit logic */}}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Inactive News Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                                <div>
                                    <h2 className="text-lg font-black text-gray-600">
                                        Inactive Latest News ({news.filter(n => !n.active).length})
                                    </h2>
                                    <p className="text-xs text-gray-500 font-medium">Hidden from the sidebar</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : news.filter(n => !n.active).length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-sm text-gray-400 font-bold italic">No inactive entries.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 bg-gray-50/20">
                                    {news.filter(n => !n.active).map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-4 sm:p-6 opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer group"
                                            onClick={() => {
                                                setEditingItem(item);
                                                setFormData({
                                                    heading: item.heading,
                                                    content: item.content,
                                                    date: item.date,
                                                    active: item.active ?? true,
                                                });
                                                setPreviewImage(item.image || "");
                                                setShowForm(true);
                                            }}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                {item.image && (
                                                    <div className="relative w-full sm:w-16 h-32 sm:h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 filter contrast-75">
                                                        <img
                                                            src={item.image}
                                                            alt={item.heading}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 w-full">
                                                    <h3 className="font-bold text-sm text-gray-600 mb-1 break-words">{item.heading}</h3>
                                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tight">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleToggleActive(item)}
                                                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300 focus:outline-none"
                                                        title="Activate"
                                                    >
                                                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}
