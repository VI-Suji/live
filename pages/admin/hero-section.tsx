"use client";

import { useState, useEffect } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, FormInput, FormTextarea, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";

type HeroSection = {
    _id: string;
    greeting?: string;
    welcomeMessage?: string;
    tagline?: string;
    description?: string;
    ctaButtonText?: string;
    secondaryButtonText?: string;
};

export default function HeroSectionAdmin() {
    const [hero, setHero] = useState<HeroSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        greeting: "",
        welcomeMessage: "",
        tagline: "",
        description: "",
        ctaButtonText: "",
        secondaryButtonText: "",
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
                    welcomeMessage: data.welcomeMessage || "",
                    tagline: data.tagline || "",
                    description: data.description || "",
                    ctaButtonText: data.ctaButtonText || "",
                    secondaryButtonText: data.secondaryButtonText || "",
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
                    welcomeMessage: responseData.welcomeMessage || "",
                    tagline: responseData.tagline || "",
                    description: responseData.description || "",
                    ctaButtonText: responseData.ctaButtonText || "",
                    secondaryButtonText: responseData.secondaryButtonText || "",
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Greeting"
                                    optional
                                    type="text"
                                    value={formData.greeting}
                                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                                    placeholder="e.g. നമസ്കാരം,"
                                />
                                <FormInput
                                    label="Welcome Message"
                                    optional
                                    type="text"
                                    value={formData.welcomeMessage}
                                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                    placeholder="e.g. Welcome to Gramika"
                                />
                            </div>

                            <FormInput
                                label="Tagline"
                                optional
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                placeholder="e.g. ഗ്രാമീണതയുടെ ഹൃദയതാളം"
                            />

                            <FormTextarea
                                label="Description"
                                optional
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Brief description of your website..."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="CTA Button Text"
                                    optional
                                    type="text"
                                    value={formData.ctaButtonText}
                                    onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                                    placeholder="e.g. Explore Stories"
                                />
                                <FormInput
                                    label="Secondary Button Text"
                                    optional
                                    type="text"
                                    value={formData.secondaryButtonText}
                                    onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                                    placeholder="e.g. Learn More"
                                />
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
