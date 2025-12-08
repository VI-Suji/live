"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type VideoItem = {
    _id: string;
    title: string;
    videoUrl: string;
    thumbnail?: string;
    order?: number;
    active: boolean;
};

export default function VideoGalleryAdmin() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<{
        title: string;
        videoUrl: string;
        order: number;
        active: boolean;
        thumbnail?: any;
    }>({
        title: "",
        videoUrl: "",
        order: 1,
        active: true,
    });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`/api/sanity/videoGallery?all=true&t=${Date.now()}`);
            const data = await res.json();
            const normalizedData = data.map((item: any) => ({
                ...item,
                active: item.active !== false
            }));
            setVideos(normalizedData);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        const previousVideos = [...videos];
        setVideos(videos.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/admin/video-gallery?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Deleted successfully!");
            } else {
                setVideos(previousVideos);
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setVideos(previousVideos);
        }
    };

    const handleToggleActive = async (item: VideoItem) => {
        const updatedItem = { ...item, active: !item.active };
        setVideos(videos.map(v => v._id === item._id ? updatedItem : v));

        try {
            const res = await fetch("/api/admin/video-gallery", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: item._id, active: !item.active }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setVideos(videos.map(v => v._id === item._id ? item : v));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingItem && !formData.thumbnail) {
            alert("Please upload a thumbnail");
            return;
        }

        const payload = { ...formData };

        try {
            const url = "/api/admin/video-gallery";
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
                setFormData({ title: "", videoUrl: "", order: videos.length + 1, active: true });
                setPreviewImage("");
                fetchVideos();
            } else {
                alert("Error saving");
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
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">Video Gallery</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({ title: "", videoUrl: "", order: videos.length + 1, active: true });
                                    setPreviewImage("");
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md transition-all hover:scale-105 flex-shrink-0"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add Video</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{editingItem ? "Edit Video" : "Add Video"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Thumbnail *</label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {previewImage && (
                                                <div className="relative w-full sm:w-32 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
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
                                                                thumbnail: {
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
                                            placeholder="Video Title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Video URL *</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="video-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                                        />
                                        <label htmlFor="video-active" className="font-bold text-gray-900">Active (Show on Website)</label>
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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900">
                                All Videos ({videos.length} items)
                            </h2>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : videos.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No videos yet.</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {videos.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setEditingItem(item);
                                            setFormData({
                                                title: item.title,
                                                videoUrl: item.videoUrl,
                                                order: item.order || 1,
                                                active: item.active ?? true,
                                            });
                                            setPreviewImage(item.thumbnail || "");
                                            setShowForm(true);
                                        }}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            {item.thumbnail && (
                                                <div className="relative w-full sm:w-32 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 w-full">
                                                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{item.title}</h3>
                                                <p className="text-gray-500 text-xs truncate mb-2">{item.videoUrl}</p>
                                                <p className="text-xs">
                                                    <span className={`px-2 py-1 rounded ${item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {item.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleToggleActive(item)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-500'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
