import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { API } from '../utils/API'
import SectionIndicatorCard from '../components/SectionIndicator';

function MobileMessages() {
    const [messages, setMessages] = useState([]);

    async function getData()
    {
        try{
            const response = await API.ADMIN.mobile_messages();
            setMessages(response.data.messages)

            console.log(response)

        }catch(err){
            toast.error(err.message)
        }
    }
    useEffect(()=>{
        getData()
    },[])
  return (
    <div className="min-h-screen bg-gray-50" >
        <SectionIndicatorCard text={"ADMIN/ Mobile Messages"} />
         <div className="max-w-6xl mx-auto mt-6 px-4 pb-8">
            {messages.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No messages yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.map((msg, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{msg.PhoneNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                                            <p className="line-clamp-2">{msg.message}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {API.TOOLS.timestamp_formatter(msg.time)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
         </div>
    </div>
  )
}

export default MobileMessages