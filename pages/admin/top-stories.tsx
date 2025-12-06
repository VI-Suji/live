"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor with no SSR
const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl"></div>
});

type TopStory = {
    _id: string;
    title: string;
    slug?: { current: string };
    author?: string;
    mainImage?: string;
    excerpt?: string;
    publishedAt?: string;
    featured?: boolean;
    category?: string;
};

export default function TopStoriesAdmin() {
    const [stories, setStories] = useState<TopStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStory, setEditingStory] = useState<TopStory | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<{
        title: string;
        slug: string;
        author: string;
        excerpt: string;
        category: string;
        featured: boolean;
        mainImage?: any;
    }>({
        title: "",
        slug: "",
        author: "Gramika Team",
        excerpt: "",
        category: "news",
        featured: false,
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch("/api/sanity/topStories");
            const data = await res.json();
            setStories(data);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this story?")) return;

        try {
            const res = await fetch(`/api/admin/top-stories?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Story deleted successfully!");
                fetchStories();
            } else {
                alert("Failed to delete story");
            }
        } catch (error) {
            console.error("Error deleting story:", error);
            alert("Error deleting story");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUploading) {
            alert("Please wait for images to finish uploading.");
            return;
        }

        const payload = {
            ...formData,
            slug: { current: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-") },
            publishedAt: new Date().toISOString(),
        };

        try {
            const url = editingStory
                ? "/api/admin/top-stories"
                : "/api/admin/top-stories";

            const method = editingStory ? "PATCH" : "POST";

            const body = editingStory
                ? { _id: editingStory._id, ...payload }
                : payload;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                alert(editingStory ? "Story updated!" : "Story created!");
                setShowForm(false);
                setEditingStory(null);
                setFormData({
                    title: "",
                    slug: "",
                    author: "Gramika Team",
                    excerpt: "",
                    category: "news",
                    featured: false,
                });
                fetchStories();
            } else {
                alert("Failed to save story");
            }
        } catch (error) {
            console.error("Error saving story:", error);
            alert("Error saving story");
        }
    };

    const handleEdit = (story: TopStory) => {
        setEditingStory(story);
        setFormData({
            title: story.title,
            slug: story.slug?.current || "",
            author: story.author || "Gramika Team",
            excerpt: story.excerpt || "",
            category: story.category || "news",
            featured: story.featured || false,
        });
        setEditingStory(story);
        setShowForm(true);
    };

    return (
        <AdminAuthGuard>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                <Link
                                    href="/admin/dashboard"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <FaArrowLeft className="text-gray-600" />
                                </Link>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 truncate">
                                        Top Stories
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                                        Manage main news articles
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingStory(null);
                                    setFormData({
                                        title: "",
                                        slug: "",
                                        author: "Gramika Team",
                                        excerpt: "",
                                        category: "news",
                                        featured: false,
                                    });
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm flex-shrink-0"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add New Story</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-4">
                                <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {editingStory ? "Edit Story" : "Add New Story"}
                                    </h2>
                                </div>
                                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">
                                            Main Image *
                                        </label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {(formData.mainImage || editingStory?.mainImage) && (
                                                <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={formData.mainImage?.previewUrl || (typeof formData.mainImage === 'string' ? formData.mainImage : editingStory?.mainImage || '')}
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
                                                                mainImage: {
                                                                    _type: "image",
                                                                    asset: {
                                                                        _type: "reference",
                                                                        _ref: asset._id,
                                                                    },
                                                                    previewUrl: asset.url
                                                                } as any,
                                                            });
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload failed", err);
                                                        alert("Image upload failed");
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-2 border-gray-300 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="Story title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">
                                            Slug (auto-generated if empty)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) =>
                                                setFormData({ ...formData, slug: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="story-slug"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) =>
                                                setFormData({ ...formData, author: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            placeholder="Author name"
                                        />
                                    </div>

                                    <label className="block text-sm font-bold mb-2 text-gray-900">
                                        Excerpt
                                    </label>
                                    <RichTextEditor
                                        value={formData.excerpt}
                                        onChange={(content: string) =>
                                            setFormData({ ...formData, excerpt: content })
                                        }
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadEnd={() => setIsUploading(false)}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) =>
                                                setFormData({ ...formData, category: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        >
                                            <option value="news">News</option>
                                            <option value="politics">Politics</option>
                                            <option value="sports">Sports</option>
                                            <option value="entertainment">Entertainment</option>
                                            <option value="local">Local</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) =>
                                                setFormData({ ...formData, featured: e.target.checked })
                                            }
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <label htmlFor="featured" className="font-bold text-gray-900">
                                            Featured Story (Show in Hero Carousel)
                                        </label>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors order-1 sm:order-1 ${isUploading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            {isUploading ? "Uploading Image..." : (editingStory ? "Update Story" : "Create Story")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingStory(null);
                                            }}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors order-2 sm:order-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Stories List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading stories...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-600 mb-4">No stories yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Story
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {stories.map((story) => (
                                <div
                                    key={story._id}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleEdit(story)}
                                >
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                                                    {story.title}
                                                </h3>
                                                {story.featured && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded flex-shrink-0">
                                                        FEATURED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">
                                                {story.excerpt ? story.excerpt.replace(/<[^>]+>/g, '') : "No excerpt"}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                                                <span>By {story.author || "Unknown"}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span>{story.category || "Uncategorized"}</span>
                                                {story.publishedAt && (
                                                    <>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>
                                                            {new Date(story.publishedAt).toLocaleDateString()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleEdit(story)}
                                                className="flex-1 sm:flex-none px-4 py-2 sm:p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                                <span className="sm:hidden text-sm font-medium">Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(story._id)}
                                                className="flex-1 sm:flex-none px-4 py-2 sm:p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                                <span className="sm:hidden text-sm font-medium">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </AdminAuthGuard>
    );
}
