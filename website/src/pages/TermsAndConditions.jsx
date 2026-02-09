import React from 'react'

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-6">
          These terms govern your use of our website and the purchase of products
          from Goutham Stores.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          General
        </h2>
        <p className="text-gray-700 text-sm">
          By accessing this website or placing an order, you agree to be bound by
          these terms and conditions.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Product Information
        </h2>
        <p className="text-gray-700 text-sm">
          We try to display accurate product details. Minor variations may occur.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Pricing & Payments
        </h2>
        <p className="text-gray-700 text-sm">
          All prices are listed in INR. Orders will be processed only after
          successful payment.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          No Refunds
        </h2>
        <p className="text-gray-700 text-sm">
          All sales are final. No refunds will be provided.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Changes to Terms
        </h2>
        <p className="text-gray-700 text-sm">
          We reserve the right to update these terms at any time without prior
          notice.
        </p>
      </div>
    </div>
  )
}

export default TermsAndConditions
