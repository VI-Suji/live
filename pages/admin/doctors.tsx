"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAuthGuard from "../../components/AdminAuthGuard";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Doctor = {
    _id: string;
    name: string;
    specialization: string;
    hospital?: string;
    phone?: string;
    availability?: string;
    order?: number;
    active: boolean;
};

export default function DoctorsAdmin() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<Doctor | null>(null);

    const [formData, setFormData] = useState<{
        name: string;
        specialization: string;
        hospital: string;
        phone: string;
        availability: string;
        order: number;
        active: boolean;
    }>({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        availability: "",
        order: 1,
        active: true,
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`/api/sanity/doctors?all=true&t=${Date.now()}`);
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this doctor?")) return;

        // Optimistic update
        const previousDoctors = [...doctors];
        setDoctors(doctors.filter(doc => doc._id !== id));

        try {
            const res = await fetch(`/api/admin/doctors?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                // fetchDoctors(); // No need to re-fetch
                alert("✅ Doctor deleted successfully!");
            } else {
                setDoctors(previousDoctors); // Revert
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setDoctors(previousDoctors); // Revert
        }
    };

    const handleToggleActive = async (doc: Doctor) => {
        // Optimistic update
        const updatedDoc = { ...doc, active: !doc.active };
        setDoctors(doctors.map(d => d._id === doc._id ? updatedDoc : d));

        try {
            const res = await fetch("/api/admin/doctors", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: doc._id, active: !doc.active }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setDoctors(doctors.map(d => d._id === doc._id ? doc : d));
            alert("❌ Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = "/api/admin/doctors";
            const method = editingItem ? "PATCH" : "POST";

            // Sanitize data
            const sanitizedData = { ...formData };
            if (!sanitizedData.hospital) delete (sanitizedData as any).hospital;
            if (!sanitizedData.phone) delete (sanitizedData as any).phone;
            if (!sanitizedData.availability) delete (sanitizedData as any).availability;

            const body = editingItem ? { _id: editingItem._id, ...sanitizedData } : sanitizedData;

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
                    specialization: "",
                    hospital: "",
                    phone: "",
                    availability: "",
                    order: doctors.length + 1,
                    active: true,
                });

                // Update local state
                if (method === "POST") {
                    setDoctors([savedItem, ...doctors]);
                } else {
                    setDoctors(doctors.map(doc => doc._id === savedItem._id ? savedItem : doc));
                }

                alert("✅ Doctor saved successfully!");
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
                                <h1 className="text-2xl font-black text-gray-900">Doctors</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingItem(null);
                                    setFormData({
                                        name: "",
                                        specialization: "",
                                        hospital: "",
                                        phone: "",
                                        availability: "",
                                        order: doctors.length + 1,
                                        active: true,
                                    });
                                }}
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Add Doctor</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {showForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">{editingItem ? "Edit Doctor" : "Add Doctor"}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">


                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="Doctor's full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Specialization *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="e.g. Cardiologist"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Hospital</label>
                                        <input
                                            type="text"
                                            value={formData.hospital}
                                            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="Hospital name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Phone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="Contact number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Availability</label>
                                        <input
                                            type="text"
                                            value={formData.availability}
                                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="e.g. 9:00 AM - 5:00 PM"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-900">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="doctor-active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                                        />
                                        <label htmlFor="doctor-active" className="font-bold text-gray-900">Active (Show on Website)</label>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold order-1 sm:order-1">
                                            Save
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
                        {doctors.map((doc) => (
                            <div
                                key={doc._id}
                                className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                                onClick={() => {
                                    setEditingItem(doc);
                                    setFormData({
                                        name: doc.name,
                                        specialization: doc.specialization,
                                        hospital: doc.hospital || "",
                                        phone: doc.phone || "",
                                        availability: doc.availability || "",
                                        order: doc.order || 1,
                                        active: doc.active,
                                    });
                                    setShowForm(true);
                                }}
                            >
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-lg text-gray-900 break-words">{doc.name}</h3>
                                    <p className="text-gray-700 font-medium break-words">{doc.specialization}</p>
                                    <p className="text-sm text-gray-600 break-words">{doc.hospital}</p>
                                    <p className="text-xs mt-2">
                                        <span className={`px-2 py-1 rounded ${doc.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {doc.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    {/* Active Toggle */}
                                    <button
                                        onClick={() => handleToggleActive(doc)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${doc.active ? 'bg-green-500' : 'bg-gray-500'}`}
                                        title={doc.active ? "Deactivate" : "Activate"}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doc.active ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingItem(doc);
                                            setFormData({
                                                name: doc.name,
                                                specialization: doc.specialization,
                                                hospital: doc.hospital || "",
                                                phone: doc.phone || "",
                                                availability: doc.availability || "",
                                                order: doc.order || 1,
                                                active: doc.active,
                                            });
                                            setShowForm(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
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
