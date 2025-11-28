"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type LocalNews = {
    _id: string;
    title: string;
    image?: string;
    description?: string;
    publishedAt?: string;
    order?: number;
};

export default function LocalNewsAdmin() {
    const [news, setNews] = useState<LocalNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<LocalNews | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        order: number;
        image?: any;
    }>({
        title: "",
        description: "",
        order: 1,
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`/api/sanity/localNews?t=${Date.now()}`);
            const data = await res.json();
            setNews(data);
        } catch (error) {
            console.error("Error fetching local news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item?")) return;

        // Optimistic update
        const previousNews = [...news];
        setNews(news.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/admin/local-news?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Deleted successfully!");
                // fetchNews(); // No need to re-fetch
            } else {
                setNews(previousNews); // Revert
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setNews(previousNews); // Revert
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if trying to add more than 3 items
        if (!editingItem && news.length >= 3) {
            alert("⚠️ Maximum 3 local news items allowed.\n\nPlease delete an existing item first.");
            return;
        }

        const payload = {
            ...formData,
            publishedAt: new Date().toISOString(),
        };

        try {
            const url = "/api/admin/local-news";
            const method = editingItem ? "PATCH" : "POST";
            const body = editingItem ? { _id: editingItem._id, ...payload } : payload;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const savedItem = await res.json();

            if (res.ok) {
                alert(editingItem ? "✅ Updated successfully!" : "✅ Created successfully!");
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: "", description: "", order: 1 });

                // Update local state
                if (method === "POST") {
                    setNews([savedItem, ...news]);
                } else {
                    setNews(news.map(item => item._id === savedItem._id ? savedItem : item));
                }
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
                            <div className="flex items-center gap-4">
                                <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                                <h1 className="text-2xl font-black text-gray-900">Local News</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({ title: "", description: "", order: news.length + 1 });
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-md transition-all hover:scale-105"
                            >
                                <FaPlus /> <span>Add News</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                                <h2 className="text-2xl font-bold mb-4">{editingItem ? "Edit News" : "Add News"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Image *</label>
                                        <div className="flex items-center gap-4">
                                            {(formData.image || editingItem?.image) && (
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={typeof formData.image === 'string' ? formData.image : editingItem?.image || ''}
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
                                                                } as any,
                                                            });
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Image upload failed");
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border-2 border-gray-300 rounded-xl"
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
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                            placeholder="News title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">
                                All Local News ({news.length}/3 items)
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">Maximum 3 local news items allowed</p>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : news.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No local news yet. Click &quot;Add News&quot; to create one.</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {news.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setEditingItem(item);
                                            setFormData({
                                                title: item.title,
                                                description: item.description || "",
                                                order: item.order || 1,
                                            });
                                            setShowForm(true);
                                        }}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                                                {item.description && (
                                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                                )}
                                                <div className="text-xs text-gray-500">
                                                    <span>Order: {item.order}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(item);
                                                        setFormData({
                                                            title: item.title,
                                                            description: item.description || "",
                                                            order: item.order || 1,
                                                        });
                                                        setShowForm(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}
