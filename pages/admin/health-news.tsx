"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type NewsItem = {
    _id: string;
    title: string;
    image?: string;
    description?: string;
    author?: string;
    publishedAt?: string;
    order?: number;
    active: boolean;
};

const TYPE = "healthNews";
const TITLE = "Health News";
const API_URL = `/api/sanity/categoryNews?type=${TYPE}`;
const ADMIN_API_URL = `/api/admin/category-news?type=${TYPE}`;

export default function HealthNewsAdmin() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        author: string;
        order: number;
        active: boolean;
        image?: any;
    }>({
        title: "",
        description: "",
        author: "",
        order: 1,
        active: true,
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`${API_URL}&all=true&t=${Date.now()}`);
            const data = await res.json();
            const normalizedData = data.map((item: any) => ({
                ...item,
                active: item.active !== false
            }));
            setNews(normalizedData);
        } catch (error) {
            console.error(`Error fetching ${TITLE}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(`Are you sure you want to delete this ${TITLE} item?`)) return;

        const previousNews = [...news];
        setNews(news.filter(item => item._id !== id));

        try {
            const res = await fetch(`${ADMIN_API_URL}&id=${id}`, {
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

    const handleToggleActive = async (item: NewsItem) => {
        const updatedItem = { ...item, active: !item.active };
        setNews(news.map(n => n._id === item._id ? updatedItem : n));

        try {
            const res = await fetch(ADMIN_API_URL, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: item._id, active: !item.active }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            // Re-fetch to reflect any auto-deactivated items (20-cap enforcement)
            await fetchNews();
        } catch (error) {
            console.error("Error updating status:", error);
            setNews(news.map(n => n._id === item._id ? item : n));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            publishedAt: new Date().toISOString(),
        };

        try {
            const url = ADMIN_API_URL;
            const method = editingItem ? "PATCH" : "POST";
            const body = editingItem ? { _id: editingItem._id, ...payload } : payload;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                alert(editingItem ? "✅ Updated successfully!" : "✅ Created successfully!");
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: "", description: "", author: "", order: 1, active: true });
                setPreviewImage("");
                fetchNews();
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("❌ Error saving");
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
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">{TITLE}</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({ title: "", description: "", author: "", order: news.length + 1, active: true });
                                    setPreviewImage("");
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md transition-all hover:scale-105 flex-shrink-0"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add News</span>
                                <span className="sm:hidden">Add</span>
                            </button>
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
                                                        alert("Image upload failed. Please try again.");
                                                        setPreviewImage("");
                                                    } finally {
                                                        setIsUploading(false);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border-2 border-gray-300 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="News title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Author (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="Author name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            rows={4}
                                            placeholder="Brief description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="active-toggle"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                                        />
                                        <label htmlFor="active-toggle" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex-1 text-white py-3 rounded-xl font-bold order-1 sm:order-1 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600'}`}
                                        >
                                            {isUploading ? "Uploading..." : "Save"}
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

                    <div className="space-y-8">
                        {/* Active News Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-red-50/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-red-900 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            Active {TITLE} ({news.filter(n => n.active).length}/20)
                                        </h2>
                                        <p className="text-xs text-red-700 font-medium">Max 20 active — oldest auto-deactivates when limit is reached</p>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : news.filter(n => n.active).length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-gray-300 mb-2 font-black text-4xl">0</div>
                                    <p className="text-sm text-gray-500 font-bold italic">No active items.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {news.filter(n => n.active).map((item, index) => (
                                        <div
                                            key={item._id}
                                            className="p-4 sm:p-6 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                                            onClick={() => {
                                                setEditingItem(item);
                                                setFormData({
                                                    title: item.title,
                                                    description: item.description || "",
                                                    author: item.author || "",
                                                    order: item.order || 1,
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
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 w-full">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider text-gray-500">#{index + 1}</span>
                                                    </div>
                                                    <h3 className="font-black text-base text-gray-900 mb-1 break-words group-hover:text-red-700 transition-colors">{item.title}</h3>
                                                    {item.description && (
                                                        <p className="text-gray-500 text-xs line-clamp-2 mb-2 break-words leading-relaxed">{item.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleToggleActive(item)}
                                                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                                        Inactive {TITLE} ({news.filter(n => !n.active).length})
                                    </h2>
                                    <p className="text-xs text-gray-500 font-medium">Hidden from the website</p>
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
                                                    title: item.title,
                                                    description: item.description || "",
                                                    author: item.author || "",
                                                    order: item.order || 1,
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
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 w-full">
                                                    <h3 className="font-bold text-sm text-gray-600 mb-1 break-words">{item.title}</h3>
                                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Inactive</div>
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
