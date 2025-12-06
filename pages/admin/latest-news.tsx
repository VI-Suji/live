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
};

export default function LatestNewsAdmin() {
    const [news, setNews] = useState<LatestNews | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<{
        heading: string;
        content: string;
        date: string;
        active: boolean;
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
                // Keep default formData for new entry
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/latest-news", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                description="Manage the sidebar news widget"
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
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    )}
                </AdminCard>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
