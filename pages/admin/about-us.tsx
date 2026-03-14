"use client";

import { useState, useEffect, useCallback } from "react";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import AdminLayout, { AdminCard, FormInput, Button, LoadingSpinner, Alert } from "../../components/AdminLayout";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";

export default function AboutUsAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [aboutData, setAboutData] = useState<any>({
        md: { name: "", designation: "", area: "", phone: "" },
        executiveDirectors: [],
        directors: []
    });

    const fetchAboutData = useCallback(async () => {
        try {
            const res = await fetch(`/api/sanity/aboutUs?raw=true&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data && !data.error) {
                    setAboutData({
                        md: data.md || { name: "", designation: "", area: "", phone: "" },
                        executiveDirectors: Array.isArray(data.executiveDirectors) ? data.executiveDirectors : [],
                        directors: Array.isArray(data.directors) ? data.directors : []
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching about data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAboutData();
    }, [fetchAboutData]);

    const handleMdChange = (field: string, value: any) => {
        setAboutData((prev: any) => ({
            ...prev,
            md: { ...prev.md, [field]: value }
        }));
    };

    const handleArrayItemChange = (arrayKey: string, index: number, field: string, value: any) => {
        setAboutData((prev: any) => {
            const newArray = [...(prev[arrayKey] || [])];
            if (newArray[index]) {
                newArray[index] = { ...newArray[index], [field]: value };
            }
            return { ...prev, [arrayKey]: newArray };
        });
    };

    const addItem = (arrayKey: string) => {
        setAboutData((prev: any) => ({
            ...prev,
            [arrayKey]: [...(prev[arrayKey] || []), { name: "", designation: "", area: "", phone: "" }]
        }));
    };

    const removeItem = (arrayKey: string, index: number) => {
        setAboutData((prev: any) => ({
            ...prev,
            [arrayKey]: (prev[arrayKey] || []).filter((_: any, i: number) => i !== index)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: { arrayKey?: string, index?: number, isMd?: boolean }) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadId = target.isMd ? 'md' : `${target.arrayKey}-${target.index}`;
        setIsUploading(uploadId);

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
                const imageData = {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: asset._id,
                    },
                    previewUrl: asset.url
                };

                if (target.isMd) {
                    handleMdChange('image', imageData);
                } else if (target.arrayKey !== undefined && target.index !== undefined) {
                    handleArrayItemChange(target.arrayKey, target.index, 'image', imageData);
                }
            }
        } catch (err) {
            console.error("Image upload error:", err);
            alert("Upload failed.");
        } finally {
            setIsUploading(null);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving || isUploading) return;

        setSaving(true);
        setMessage(null);

        const payload = JSON.parse(JSON.stringify(aboutData));
        payload._type = 'aboutUs';

        const cleanPerson = (person: any) => {
            if (person && person.image && typeof person.image === 'object') {
                const cleanImage = {
                    _type: 'image',
                    asset: person.image.asset
                };
                person.image = cleanImage;
            }
        };

        cleanPerson(payload.md);
        if (Array.isArray(payload.executiveDirectors)) payload.executiveDirectors.forEach(cleanPerson);
        if (Array.isArray(payload.directors)) payload.directors.forEach(cleanPerson);

        try {
            const res = await fetch("/api/admin/about-us", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: '✅ Details saved!' });
                setTimeout(async () => {
                    await fetchAboutData();
                    setSaving(false);
                }, 1000);
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: `❌ Error: ${err.error || 'Unknown'}` });
                setSaving(false);
            }
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Network error.' });
            setSaving(false);
        }
    };

    const getImageUrl = (image: any) => {
        if (!image) return null;
        if (typeof image === 'string') return image;
        return image.previewUrl || image.url || null;
    };

    if (loading) return <AdminLayout title="Loading..."><LoadingSpinner /></AdminLayout>;

    const renderPersonFields = (person: any, onChange: (field: string, value: any) => void, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, uploadId: string, showDelete: boolean = false, onDelete?: () => void) => (
        <div className="space-y-4 relative">
            {showDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="absolute -top-1 -right-1 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors z-20 shadow-sm"
                >
                    <FiTrash2 size={14} />
                </button>
            )}
            <div className="flex flex-col items-center gap-3 mb-2">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center relative shrink-0 shadow-inner">
                    {getImageUrl(person?.image) ? (
                        <img src={getImageUrl(person.image)!} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <div className="text-[9px] text-gray-300 font-bold uppercase">Photo</div>
                    )}
                    {isUploading === uploadId && (
                        <div className="absolute inset-0 bg-blue-600/80 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <div className="relative w-full">
                    <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="text-[11px] font-bold text-blue-600 bg-blue-50 py-2 px-3 rounded-lg text-center border border-blue-100 hover:bg-blue-100 transition-colors">
                        {isUploading === uploadId ? "Uploading..." : "Change Photo"}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <FormInput
                    label="Full Name"
                    required
                    value={person.name || ""}
                    onChange={(e) => onChange('name', e.target.value)}
                    className="py-2 px-3 text-xs"
                />

                <FormInput
                    label="Area"
                    required
                    value={person.area || ""}
                    onChange={(e) => onChange('area', e.target.value)}
                    className="py-2 px-3 text-xs"
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormInput
                        label="Designation"
                        required
                        value={person.designation || ""}
                        onChange={(e) => onChange('designation', e.target.value)}
                        className="py-2 px-3 text-xs"
                    />
                    <FormInput
                        label="Phone"
                        required
                        value={person.phone || ""}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className="py-2 px-3 text-xs"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <AdminAuthGuard>
            <AdminLayout title="About Us Management" description="Leadership Team Overview" maxWidth="7xl">
                {message && <div className="mb-4"><Alert type={message.type}>{message.text}</Alert></div>}

                <form onSubmit={handleSubmit} className="space-y-10 pb-28">
                    <section>
                        <h2 className="text-2xl font-black text-gray-900 border-l-4 border-blue-600 pl-4 mb-8">Managing Director</h2>
                        <div className="max-w-xs mx-auto">
                            <AdminCard className="p-6 border-t-4 border-blue-600 shadow-lg">
                                {renderPersonFields(aboutData.md, handleMdChange, (e) => handleImageUpload(e, { isMd: true }), 'md')}
                            </AdminCard>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-indigo-500 pl-3">Executive Directors</h2>
                            <button
                                type="button"
                                onClick={() => addItem('executiveDirectors')}
                                className="flex items-center gap-2.5 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 transition-all shadow-md active:scale-95"
                            >
                                <FiPlus size={20} /> Add Executive Director
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {aboutData.executiveDirectors.map((person: any, idx: number) => (
                                <AdminCard key={`ed-${idx}`} className="p-6 border-t-2 border-indigo-500 shadow-md">
                                    {renderPersonFields(
                                        person,
                                        (f, v) => handleArrayItemChange('executiveDirectors', idx, f, v),
                                        (e) => handleImageUpload(e, { arrayKey: 'executiveDirectors', index: idx }),
                                        `executiveDirectors-${idx}`,
                                        true,
                                        () => removeItem('executiveDirectors', idx)
                                    )}
                                </AdminCard>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-purple-500 pl-3">Directors</h2>
                            <button
                                type="button"
                                onClick={() => addItem('directors')}
                                className="flex items-center gap-2.5 bg-green-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 transition-all shadow-md active:scale-95"
                            >
                                <FiPlus size={20} /> Add Director
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {aboutData.directors.map((person: any, idx: number) => (
                                <AdminCard key={`dir-${idx}`} className="p-6 border-t-2 border-purple-500 shadow-md">
                                    {renderPersonFields(
                                        person,
                                        (f, v) => handleArrayItemChange('directors', idx, f, v),
                                        (e) => handleImageUpload(e, { arrayKey: 'directors', index: idx }),
                                        `directors-${idx}`,
                                        true,
                                        () => removeItem('directors', idx)
                                    )}
                                </AdminCard>
                            ))}
                        </div>
                    </section>

                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                        <Button type="submit" variant="primary" size="lg" className="w-full h-15 text-lg font-black rounded-xl shadow-2xl shadow-blue-600/20 border-2 border-white/10" disabled={saving || !!isUploading}>
                            {saving ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FiSave className="mr-3 text-xl" /> <span>Save All Changes</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
