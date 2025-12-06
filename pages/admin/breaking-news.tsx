"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type BreakingNews = {
    _id: string;
    title: string;
    link?: string;
    active: boolean;
    priority: number;
    startDate?: string;
    expiryDate?: string;
};

export default function BreakingNewsAdmin() {
    const [newsList, setNewsList] = useState<BreakingNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<BreakingNews | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        link: string;
        active: boolean;
        priority: number;
        startDate: string;
        expiryDate: string;
    }>({
        title: "",
        link: "",
        active: true,
        priority: 1,
        startDate: "",
        expiryDate: "",
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`/api/admin/breaking-news?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched breaking news:', data);
                // Normalize active field (undefined = true for legacy items)
                const normalizedData = data.map((item: any) => ({
                    ...item,
                    active: item.active !== false
                }));
                setNewsList(normalizedData);
            }
        } catch (error) {
            console.error("Error fetching breaking news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this breaking news?")) return;

        // Optimistic update
        const previousList = [...newsList];
        setNewsList(newsList.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/admin/breaking-news?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                // await fetchNews(); // No need to re-fetch if successful
                alert("✅ Breaking news deleted successfully!");
            } else {
                // Revert on failure
                setNewsList(previousList);
                alert("❌ Error deleting. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setNewsList(previousList);
            alert("❌ Error deleting. Please try again.");
        }
    };

    const handleToggleActive = async (news: BreakingNews) => {
        // Optimistic update
        const updatedNews = { ...news, active: !news.active };
        setNewsList(newsList.map(n => n._id === news._id ? updatedNews : n));

        try {
            const res = await fetch("/api/admin/breaking-news", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: news._id, active: !news.active }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setNewsList(newsList.map(n => n._id === news._id ? news : n));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/breaking-news";
            const method = editingItem ? "PATCH" : "POST";

            // Create payload for API - don't mutate formData
            const payload: any = {
                title: formData.title,
                active: formData.active,
                priority: formData.priority,
            };

            // Add optional fields only if they have values
            if (formData.link && formData.link.trim()) {
                payload.link = formData.link;
            }

            // Convert datetime-local to ISO string for Sanity
            if (formData.startDate && formData.startDate.trim()) {
                payload.startDate = new Date(formData.startDate).toISOString();
            }

            if (formData.expiryDate && formData.expiryDate.trim()) {
                payload.expiryDate = new Date(formData.expiryDate).toISOString();
            }

            const body = editingItem ? { _id: editingItem._id, ...payload } : payload;

            console.log('Submitting breaking news:', { method, body });

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const responseData = await res.json();
            console.log('Response:', responseData);

            if (res.ok) {
                setShowForm(false);
                setEditingItem(null);
                setFormData({
                    title: "",
                    link: "",
                    active: true,
                    priority: 1,
                    startDate: "",
                    expiryDate: "",
                });

                // Update local state immediately with the response data
                if (method === "POST") {
                    setNewsList([responseData, ...newsList]);
                } else {
                    setNewsList(newsList.map(item =>
                        item._id === responseData._id ? responseData : item
                    ));
                }

                alert("✅ Breaking news saved successfully!");
            } else {
                const errorMsg = responseData.message || responseData.error || "Failed to save";
                console.error('Save failed:', responseData);
                alert(`❌ Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("❌ Error saving. Please check console for details.");
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
                                <h1 className="text-2xl font-black text-gray-900">Breaking News</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({
                                        title: "",
                                        link: "",
                                        active: true,
                                        priority: 1,
                                        startDate: "",
                                        expiryDate: "",
                                    });
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add Breaking News</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{editingItem ? "Edit Breaking News" : "Add Breaking News"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">News Title * <span className="text-xs text-gray-500 font-normal">(Max 150 chars)</span></label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={150}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="Breaking: Major announcement..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.title.length}/150 characters</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Link URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="https://example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Priority * <span className="text-xs text-gray-500 font-normal">(Lower = Higher Priority)</span></label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first (e.g., 1, 2, 3...)</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Start Date & Time (Optional)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const date = e.target.value;
                                                        const time = formData.startDate ? formData.startDate.split('T')[1] : '00:00';
                                                        setFormData({ ...formData, startDate: date ? `${date}T${time}` : '' });
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-sm"
                                                    style={{ colorScheme: 'light' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.startDate ? formData.startDate.split('T')[1] || '00:00' : ''}
                                                    onChange={(e) => {
                                                        const time = e.target.value;
                                                        const date = formData.startDate ? formData.startDate.split('T')[0] : '';
                                                        if (date) {
                                                            setFormData({ ...formData, startDate: `${date}T${time}` });
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-sm"
                                                    style={{ colorScheme: 'light' }}
                                                    disabled={!formData.startDate || !formData.startDate.split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">News will start showing from this date & time (leave empty to show immediately)</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Expiry Date & Time (Optional)</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const date = e.target.value;
                                                        const time = formData.expiryDate ? formData.expiryDate.split('T')[1] : '00:00';
                                                        setFormData({ ...formData, expiryDate: date ? `${date}T${time}` : '' });
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-sm"
                                                    style={{ colorScheme: 'light' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.expiryDate ? formData.expiryDate.split('T')[1] || '00:00' : ''}
                                                    onChange={(e) => {
                                                        const time = e.target.value;
                                                        const date = formData.expiryDate ? formData.expiryDate.split('T')[0] : '';
                                                        if (date) {
                                                            setFormData({ ...formData, expiryDate: `${date}T${time}` });
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-sm"
                                                    style={{ colorScheme: 'light' }}
                                                    disabled={!formData.expiryDate || !formData.expiryDate.split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">News will automatically stop showing after this date & time</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                                        />
                                        <label htmlFor="active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-1"
                                        >
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 order-2 sm:order-2"
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
                                All Breaking News ({newsList.filter(n => n.active).length} active)
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">All active breaking news will be shown on the website</p>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : newsList.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No breaking news yet. Click &quot;Add Breaking News&quot; to create one.</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {newsList.map((news) => (
                                    <div
                                        key={news._id}
                                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setEditingItem(news);
                                            setFormData({
                                                title: news.title,
                                                link: news.link || "",
                                                active: news.active,
                                                priority: news.priority,
                                                startDate: news.startDate ? new Date(news.startDate).toISOString().slice(0, 16) : "",
                                                expiryDate: news.expiryDate ? new Date(news.expiryDate).toISOString().slice(0, 16) : "",
                                            });
                                            setShowForm(true);
                                        }}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-1 w-full">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${news.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {news.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                                        Priority {news.priority}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-900 mb-2 break-words">{news.title}</h3>
                                                {news.link && (
                                                    <a
                                                        href={news.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline block mb-2 break-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {news.link}
                                                    </a>
                                                )}
                                                {news.startDate && (
                                                    <p className="text-xs text-gray-500">
                                                        Starts: {new Date(news.startDate).toLocaleString()}
                                                    </p>
                                                )}
                                                {news.expiryDate && (
                                                    <p className="text-xs text-gray-500">
                                                        Expires: {new Date(news.expiryDate).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                {/* Active Toggle */}
                                                <button
                                                    onClick={() => handleToggleActive(news)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${news.active ? 'bg-green-500' : 'bg-gray-500'}`}
                                                    title={news.active ? "Deactivate" : "Activate"}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${news.active ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingItem(news);
                                                        setFormData({
                                                            title: news.title,
                                                            link: news.link || "",
                                                            active: news.active,
                                                            priority: news.priority,
                                                            startDate: news.startDate ? new Date(news.startDate).toISOString().slice(0, 16) : "",
                                                            expiryDate: news.expiryDate ? new Date(news.expiryDate).toISOString().slice(0, 16) : "",
                                                        });
                                                        setShowForm(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(news._id)}
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
