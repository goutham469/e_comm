import React from 'react'

function RefundAndCancellation() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Refund & Cancellation Policy
        </h1>

        <p className="text-gray-600 mb-6">
          Please read this policy carefully before placing an order.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          No Refund Policy
        </h2>
        <p className="text-gray-700 text-sm">
          All purchases made on Goutham Stores are final. We do not offer
          refunds under any circumstances.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Order Cancellation
        </h2>
        <p className="text-gray-700 text-sm">
          Orders cannot be cancelled once they are placed and confirmed.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Damaged or Incorrect Products
        </h2>
        <p className="text-gray-700 text-sm">
          If you receive a damaged or incorrect product, contact us within
          <span className="font-medium"> 48 hours </span>
          of delivery with images and order details. Replacement may be provided
          after verification. No refunds will be issued.
        </p>
      </div>
    </div>
  )
}

export default RefundAndCancellation
