"use client";

import { useState, useEffect } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, FormInput, FormTextarea, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";

type HeroSection = {
    _id: string;
    greeting?: string;
    tagline?: string;
};

export default function HeroSectionAdmin() {
    const [hero, setHero] = useState<HeroSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        greeting: "",
        tagline: "",
    });

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const res = await fetch(`/api/sanity/heroContent?t=${Date.now()}`);
            if (!res.ok) {
                setHero(null);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data && !data.error) {
                setHero(data);
                setFormData({
                    greeting: data.greeting || "",
                    tagline: data.tagline || "",
                });
            }
        } catch (error) {
            console.error("Error fetching hero:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/hero-section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const responseData = await res.json();

            if (res.ok) {
                setHero(responseData);
                setFormData({
                    greeting: responseData.greeting || "",
                    tagline: responseData.tagline || "",
                });
                setMessage({ type: 'success', text: '✅ Hero section updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const errorMsg = responseData.message || responseData.error || "Failed to save";
                setMessage({ type: 'error', text: `❌ Error: ${errorMsg}` });
                await fetchHero();
            }
        } catch (error) {
            console.error("Error saving:", error);
            setMessage({ type: 'error', text: '❌ Error saving. Please try again.' });
            await fetchHero();
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminAuthGuard>
            <AdminLayout
                title="Hero Section"
                description="Manage the homepage hero content"
                maxWidth="3xl"
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
                                label="Greeting"
                                optional
                                type="text"
                                value={formData.greeting}
                                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                                placeholder="e.g. നമസ്കാരം,"
                            />
                            <FormInput
                                label="Tagline"
                                optional
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                placeholder="e.g. ഗ്രാമീണതയുടെ ഹൃദയതാളം"
                            />



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
        </AdminAuthGuard >
    );
}
