import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { API } from '../utils/API'
import SectionIndicatorCard from './SectionIndicator'

function SavedLocations() {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [newAddress, setNewAddress] = useState("")
    const [pincode, setPincode] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        fetchAddresses()
    }, [])

    async function fetchAddresses() {
        setLoading(true)
        const res = await API.USER.list_address()

        if (res.success) {
            setAddresses(res.data.addressList || [])
            setError("")
        } else {
            setError(res.error || "Failed to load addresses")
        }
        setLoading(false)
    }

    async function handleDelete(addressId) {
        setDeletingId(addressId)
        const res = await API.USER.delete_address(addressId)
        
        if (res.success) {
            setAddresses(prev => prev.filter(a => a._id !== addressId))
        } else {
            alert(res.error || "Failed to delete address")
        }
        setDeletingId(null)
    }

    async function handleAddAddress() {
        if (!newAddress.trim() || !pincode.trim()) {
            alert("Address and pincode are required")
            return
        }

        setIsAdding(true)
        const payload = {
            address: newAddress,
            pincode: Number(pincode),
            metaData: {}
        }

        const res = await API.USER.add_address(payload)

        if (res.success) {
            setAddresses(prev => [res.data, ...prev])
            setNewAddress("")
            setPincode("")
        } else {
            alert(res.error || "Failed to add address")
        }
        setIsAdding(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading saved locations...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-red-800 font-semibold">Error</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className=" space-y-6">
            <SectionIndicatorCard text={"USER / Saved-Locations"} />

            {/* Add Address Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Address
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea
                            placeholder="Enter your full address"
                            value={newAddress}
                            onChange={e => setNewAddress(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                        </label>
                        <input
                            type="number"
                            placeholder="Enter pincode"
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                    
                    <button
                        onClick={handleAddAddress}
                        disabled={isAdding}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                        {isAdding ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Address
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Address List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Saved Addresses ({addresses.length})
                </h2>

                {addresses.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No saved addresses</h3>
                        <p className="text-gray-500">Add your first address to get started</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {addresses.map(addr => (
                            <div
                                key={addr._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-800 font-medium leading-relaxed">{addr.address}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600 ml-7">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-semibold">Pincode:</span>
                                            <span className="ml-1">{addr.pincode}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-xs text-gray-500 ml-7">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Saved on {new Date(addr.savedOn).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleDelete(addr._id)}
                                        disabled={deletingId === addr._id}
                                        className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
                                        title="Delete address"
                                    >
                                        {deletingId === addr._id ? (
                                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedLocations