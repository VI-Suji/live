"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Obituary = {
    _id: string;
    name: string;
    age?: number;
    place?: string;
    dateOfDeath: string;
    funeralDetails?: string;
    active: boolean;
    photo?: string;
};



export default function ObituariesAdmin() {
    const [obituaries, setObituaries] = useState<Obituary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Obituary | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState<{
        name: string;
        age: string;
        place: string;
        dateOfDeath: string;
        funeralDetails: string;
        active: boolean;
        photo?: any;
    }>({
        name: "",
        age: "",
        place: "",
        dateOfDeath: new Date().toISOString().split('T')[0],
        funeralDetails: "",
        active: true,
    });

    useEffect(() => {
        fetchObituaries();
    }, []);

    const fetchObituaries = async () => {
        try {
            const res = await fetch(`/api/sanity/obituaries?all=true&t=${Date.now()}`);
            const data = await res.json();
            setObituaries(data);
        } catch (error) {
            console.error("Error fetching obituaries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this obituary?")) return;

        // Optimistic update
        const previousObituaries = [...obituaries];
        setObituaries(obituaries.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/admin/obituaries?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                // fetchObituaries(); // No need to re-fetch
                alert("✅ Obituary deleted successfully!");
            } else {
                setObituaries(previousObituaries); // Revert
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setObituaries(previousObituaries); // Revert
        }
    };

    const handleToggleActive = async (item: Obituary) => {
        // Optimistic update
        const updatedItem = { ...item, active: !item.active };
        setObituaries(obituaries.map(o => o._id === item._id ? updatedItem : o));

        try {
            const res = await fetch("/api/admin/obituaries", {
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
            setObituaries(obituaries.map(o => o._id === item._id ? item : o));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = "/api/admin/obituaries";
            const method = editingItem ? "PATCH" : "POST";

            // Sanitize data
            const sanitizedData = { ...formData };
            if (!sanitizedData.place) delete (sanitizedData as any).place;
            sanitizedData.funeralDetails = sanitizedData.funeralDetails?.trim() || "";

            const body = editingItem ? { _id: editingItem._id, ...sanitizedData, age: Number(formData.age) } : { ...sanitizedData, age: Number(formData.age) };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const savedItem = await res.json();

            if (res.ok) {
                setShowForm(false);
                setEditingItem(null);
                setFormData({
                    name: "",
                    age: "",
                    place: "",
                    dateOfDeath: new Date().toISOString().split('T')[0],
                    funeralDetails: "",
                    active: true,
                });

                setPreviewImage("");

                fetchObituaries();

                alert("✅ Obituary saved successfully!");
            } else {
                throw new Error(savedItem.error || "Failed to save");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("❌ Error saving. Please try again.");
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
                                <h1 className="text-2xl font-black text-gray-900">Obituaries</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({
                                        name: "",
                                        age: "",
                                        place: "",
                                        dateOfDeath: new Date().toISOString().split('T')[0],
                                        funeralDetails: "",
                                        active: true,
                                    });
                                    setPreviewImage("");
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add Obituary</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">{editingItem ? "Edit Obituary" : "Add Obituary"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Photo *</label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {previewImage && (
                                                <div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
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
                                                                photo: {
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
                                                        setPreviewImage("");
                                                    } finally {
                                                        setIsUploading(false);
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 border-2 border-gray-300 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Age *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                            placeholder="Age"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Place *</label>
                                        <input
                                            type="text"
                                            value={formData.place}
                                            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                            placeholder="Place of residence"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Date of Death *</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dateOfDeath}
                                            onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Funeral Details (Optional)</label>
                                        <textarea
                                            value={formData.funeralDetails}
                                            onChange={(e) => setFormData({ ...formData, funeralDetails: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                            rows={4}
                                            placeholder="Funeral service details..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="obituary-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-gray-600 rounded focus:ring-2 focus:ring-gray-500"
                                        />
                                        <label htmlFor="obituary-active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className={`flex-1 text-white py-3 rounded-xl font-bold order-1 sm:order-1 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'}`}
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

                    <div className="grid gap-4">
                        {obituaries.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                                onClick={() => {
                                    setEditingItem(item);
                                    setFormData({
                                        name: item.name,
                                        age: item.age?.toString() || "",
                                        place: item.place || "",
                                        dateOfDeath: item.dateOfDeath,
                                        funeralDetails: item.funeralDetails || "",
                                        active: item.active,
                                    });
                                    setPreviewImage(item.photo || "");
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-lg text-gray-900 break-words">{item.name}</h3>
                                    <p className="text-gray-700 font-medium break-words">{item.place} • {item.age} years</p>
                                    <p className="text-sm text-gray-600 break-words">Died: {new Date(item.dateOfDeath).toLocaleDateString()}</p>
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
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${item.active ? 'bg-green-500' : 'bg-gray-500'}`}
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
                                                name: item.name,
                                                age: item.age?.toString() || "",
                                                place: item.place || "",
                                                dateOfDeath: item.dateOfDeath,
                                                funeralDetails: item.funeralDetails || "",
                                                active: item.active,
                                            });
                                            setPreviewImage(item.photo || "");
                                            setShowForm(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </AdminAuthGuard>
    );
}
