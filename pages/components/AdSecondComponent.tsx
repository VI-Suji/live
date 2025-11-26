import React from "react"
export default function AdTwo() {
    return (
        <div className="w-full relative rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400 font-bold text-lg aspect-video border border-gray-700">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm text-white">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-400 mb-2">Advertisement Space</p>
                    <p className="text-lg font-bold">Available for Rent</p>
                </div>
            </div>
        </div>
    )
}