

// "use client"

// import { useRouter, useParams } from "next/navigation"
// import Navbar from "@/components/Navbar"
// import { useCustomers } from "@/context/customer-context"

// const CustomerDetailsPage = () => {
//   const router = useRouter()
//   const params = useParams()
//   const customerId = params.id as string
//   const { getCustomer } = useCustomers()
//   const customer = getCustomer(customerId)

//   if (!customer) {
//     return (
//       <div className="flex h-screen bg-gray-50 overflow-hidden">
//         <Navbar />
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//             </div>
//           </div>

//           {/* Not Found Section */}
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
//               <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
//               <button
//                 onClick={() => router.push("/customers")}
//                 className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
//               >
//                 Back to Customers
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       <Navbar />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {/* Back Button */}
//           <button
//             onClick={() => router.push("/customers")}
//             className="mb-6 text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1"
//           >
//             <span>←</span>
//             <span>Back to Customers</span>
//           </button>

//           {/* Customer Details Card */}
//           <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-3xl">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8">
//               <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
//               <p className="text-teal-100 mt-2">Customer ID: {customer.id}</p>
//             </div>

//             {/* Details */}
//             <div className="p-6 space-y-6">
//               {/* Status */}
//               <div className="flex items-center justify-between pb-6 border-b border-gray-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Status</p>
//                   <p className="text-lg font-semibold text-gray-900 mt-1">{customer.status}</p>
//                 </div>
//                 <span
//                   className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
//                     customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {customer.status}
//                 </span>
//               </div>

//               {/* Contact Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Email</p>
//                   <p className="text-lg font-semibold text-gray-900 mt-1">{customer.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Phone</p>
//                   <p className="text-lg font-semibold text-gray-900 mt-1">{customer.phone}</p>
//                 </div>
//               </div>

//               {/* Join Date */}
//               <div className="pt-6 border-t border-gray-200">
//                 <p className="text-sm font-medium text-gray-600">Join Date</p>
//                 <p className="text-lg font-semibold text-gray-900 mt-1">{customer.joinDate}</p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
//               <button
//                 onClick={() => router.push("/customers")}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => router.push(`/customers/${customer.id}/edit`)}
//                 className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
//               >
//                 Edit Customer
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CustomerDetailsPage







"use client"

import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useCustomers } from "@/context/customer-context"

const CustomerDetailsPage = () => {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const { getCustomer } = useCustomers()
  const customer = getCustomer(customerId)

  if (!customer) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Navbar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Not Found Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
              <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push("/customers")}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Back to Customers
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Content - centered the card on the page */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/customers")}
            className="mb-6 text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1 self-start"
          >
            <span>←</span>
            <span>Back to Customers</span>
          </button>

          {/* Customer Details Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-3xl w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8">
              <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
              <p className="text-teal-100 mt-2">Customer ID: {customer.id}</p>
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{customer.status}</p>
                </div>
                <span
                  className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                    customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{customer.phone}</p>
                </div>
              </div>

              {/* Join Date */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600">Join Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{customer.joinDate}</p>
              </div>
            </div>

            {/* Actions - removed Edit Customer button, kept only Close button */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => router.push("/customers")}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailsPage
