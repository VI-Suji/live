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
    author?: string;
    publishedAt?: string;
    order?: number;
    active: boolean;
};

export default function LocalNewsAdmin() {
    const [news, setNews] = useState<LocalNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<LocalNews | null>(null);
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
            const res = await fetch(`/api/sanity/localNews?all=true&t=${Date.now()}`);
            const data = await res.json();
            // Normalize active field (undefined = true for legacy items)
            const normalizedData = data.map((item: any) => ({
                ...item,
                active: item.active !== false
            }));
            setNews(normalizedData);
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

    const handleToggleActive = async (item: LocalNews) => {
        // Optimistic update
        const updatedItem = { ...item, active: !item.active };
        setNews(news.map(n => n._id === item._id ? updatedItem : n));

        try {
            const res = await fetch("/api/admin/local-news", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: item._id, active: !item.active }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setNews(news.map(n => n._id === item._id ? item : n));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingItem && !formData.image) {
            alert("Please upload an image");
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
                                    setFormData({ title: "", description: "", author: "", order: news.length + 1, active: true });
                                    setPreviewImage("");
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-md transition-all hover:scale-105"
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
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{editingItem ? "Edit News" : "Add News"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Image *</label>
                                        <div className="w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                                                {previewImage ? (
                                                    <>
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg">Change Image</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                        <div className="mb-3 p-3 bg-white rounded-full shadow-sm">
                                                            <FaPlus className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <p className="mb-1 text-sm text-gray-900 font-bold">Click to upload image</p>
                                                        <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 2MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        // Immediate preview
                                                        setPreviewImage(URL.createObjectURL(file));
                                                        setIsUploading(true);

                                                        const data = new FormData();
                                                        data.append("file", file);

                                                        try {
                                                            const res = await fetch("/api/admin/upload?type=image", {
                                                                method: "POST",
                                                                body: data,
                                                            });
                                                            const asset = await res.json();
                                                            if (asset._id) {
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
                                                            alert("Image upload failed");
                                                        } finally {
                                                            setIsUploading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
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
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Author (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                            placeholder="Author name"
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
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="local-news-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                        />
                                        <label htmlFor="local-news-active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex-1 text-white py-3 rounded-xl font-bold order-1 sm:order-1 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'}`}
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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">
                                All Local News ({news.length} items)
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">Manage your local news items</p>
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
                                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
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
                                                <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 w-full">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2 break-words">{item.title}</h3>
                                                {item.description && (
                                                    <p className="text-gray-600 text-sm mb-2 break-words">{item.description}</p>
                                                )}
                                                <div className="text-xs text-gray-500">
                                                    <span>Order: {item.order}</span>
                                                </div>
                                                <p className="text-xs mt-2">
                                                    <span className={`px-2 py-1 rounded ${item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {item.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                {/* Active Toggle */}
                                                <button
                                                    onClick={() => handleToggleActive(item)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${item.active ? 'bg-green-500' : 'bg-gray-500'}`}
                                                    title={item.active ? "Deactivate" : "Activate"}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </button>

                                                <button
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
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
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
