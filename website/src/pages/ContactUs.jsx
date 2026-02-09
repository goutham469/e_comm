import React from 'react'

function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Contact Us
        </h1>

        <p className="text-gray-600 mb-6">
          Have questions about our products or orders? Reach out to us using the
          details below.
        </p>

        <div className="space-y-3 text-gray-700 text-sm">
          <p>
            <span className="font-medium">Store Name:</span> Goutham Stores
          </p>
          <p>
            <span className="font-medium">Address:</span> Goutham Stores, Madhapuram, Khammam, Telangana,
            India
          </p>
          <p>
            <span className="font-medium">Phone:</span> +91 9398141936
          </p>
          <p>
            <span className="font-medium">Email:</span> gouthamreddy@gmail.com
          </p>
          <p>
            <span className="font-medium">Business Hours:</span> Mon – Sat,
            10:00 AM – 4:00 PM IST
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
