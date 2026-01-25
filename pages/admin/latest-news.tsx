"use client";

import { useState, useEffect } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, FormInput, FormTextarea, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";

type LatestNews = {
    _id: string;
    heading: string;
    content: string;
    date: string;
    active: boolean;
    image?: string;
};

export default function LatestNewsAdmin() {
    const [news, setNews] = useState<LatestNews | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
            const res = await fetch(`/api/sanity/latestNews?t=${Date.now()}`);
            if (!res.ok) {
                console.log('No latest news found yet');
                setNews(null);
                setFormData({
                    heading: "",
                    content: "",
                    date: new Date().toISOString().split('T')[0],
                    active: true,
                });
                setLoading(false);
                return;
            }
            const data = await res.json();

            if (data && !data.error) {
                setNews(data);
                setFormData({
                    heading: data.heading || "",
                    content: data.content || "",
                    date: data.date || new Date().toISOString().split('T')[0],
                    active: data.active ?? true,
                    image: data.image || null,
                });
            } else {
                setNews(null);
                setFormData({
                    heading: "",
                    content: "",
                    date: new Date().toISOString().split('T')[0],
                    active: true,
                });
            }
        } catch (error) {
            console.error("Error fetching latest news:", error);
            setNews(null);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
                setFormData({
                    ...formData,
                    image: {
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
            alert("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUploading) {
            alert("Please wait for the image to finish uploading.");
            return;
        }

        setSaving(true);
        setMessage(null);

        // Prepare payload - if image is just a URL string (from fetch), don't send it in update 
        // to avoid overwriting the complex sanity object with a string unless it's new
        const { image, ...rest } = formData;
        const payload = { ...rest };

        // Only include image if it's a new upload object
        if (image && typeof image === 'object' && image._type === 'image') {
            (payload as any).image = {
                _type: 'image',
                asset: image.asset
            };
        }

        try {
            const res = await fetch("/api/admin/latest-news", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (res.ok) {
                await fetchNews();
                setMessage({ type: 'success', text: '✅ Latest News updated successfully!' });
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
                title="Latest News Widget"
                description="Manage the sidebar news widget with image"
                maxWidth="2xl"
            >
                {message && (
                    <div className="mb-6">
                        <Alert type={message.type}>
                            {message.text}
                        </Alert>
                    </div>
                )}

                <AdminCard>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-900">
                                    Widget Image (Optional)
                                </label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {(formData.image) && (
                                        <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={formData.image?.previewUrl || (typeof formData.image === 'string' ? formData.image : '')}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 w-full">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-2 border-gray-300 rounded-xl"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            {isUploading ? "Uploading..." : "Click to upload news image"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <FormInput
                                label="Heading"
                                required
                                type="text"
                                value={formData.heading}
                                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                placeholder="e.g. Breaking News"
                            />

                            <FormTextarea
                                label="Content"
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={4}
                                placeholder="News content..."
                            />

                            <FormInput
                                label="Date"
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="font-bold text-gray-900 cursor-pointer">
                                    Show on Website (Active)
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={saving || isUploading}
                            >
                                {saving ? "Saving..." : (isUploading ? "Waiting for upload..." : "Save Changes")}
                            </Button>
                        </form>
                    )}
                </AdminCard>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
