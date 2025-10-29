'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { getCurrentUser, User } from '@/lib/mockAuth';

const HomePage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);



  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0B5351] to-[#8CBCB9] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Silekta Holdings</h1>
            <p className="text-xl text-[#80DED9] mb-6">
              Your Trusted Partner in Sustainable Paper Products & Custom Printing Solutions
            </p>
            <p className="text-lg opacity-90">
              Established 2017 | Serving Modern Trade & Corporate Clients Across Sri Lanka
            </p>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Company History */}
        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-[#0B5351] mb-6 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            Our Journey Since 2017
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              <strong>Silekta Holdings (Pvt) Ltd</strong> was established in 2017 as a subsidiary of UTN, 
              initially launching operations under the brand name <em>Mint</em> for tissue paper box production. 
              What began as a small-scale local manufacturer has evolved into a trusted supplier of sustainable 
              paper products and custom printing solutions across Sri Lanka.
            </p>
            <p className="mb-4">
              A transformative milestone came with the acquisition of a <strong>die-cutting cylinder machine</strong>, 
              which revolutionized our production capabilities. This technological upgrade enabled us to transition 
              from tissue boxes to high-quality <strong>paper plate manufacturing</strong>, marking our entry into 
              a more competitive market segment.
            </p>
            <p className="mb-4">
              Today, we have diversified into <strong>paper plates, cups, and bags</strong>, while importing 
              premium box boards from India and sustainable wooden cutlery from China. Through three strategic 
              location relocations, we have continuously expanded our production capacity to meet growing demand.
            </p>
            <p>
              Our printing division offers <strong>sticker printing, calendar printing, and custom bag branding</strong>, 
              serving prestigious corporate clients including Barista, P&S (Perera & Sons), and Enchanter.
            </p>
          </div>
        </section>

        {/* Products & Services Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0B5351] mb-6 text-center">Our Products & Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Paper Products */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-800">Paper Products</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Paper Plates</li>
                <li>• Paper Cups</li>
                <li>• Paper Bags</li>
                <li>• Lunch Boxes</li>
                <li>• Sustainable Packaging</li>
              </ul>
            </div>

            {/* Wooden Cutlery */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#8CBCB9] to-[#80DED9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-800">Wooden Cutlery</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Wooden Spoons</li>
                <li>• Wooden Forks</li>
                <li>• Imported from China</li>
                <li>• Eco-Friendly Alternative</li>
                <li>• Supermarket Supply</li>
              </ul>
            </div>

            {/* Printing Services */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-800">Printing Services</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sticker Printing</li>
                <li>• Calendar Printing</li>
                <li>• Bag Branding</li>
                <li>• Custom Packaging Design</li>
                <li>• Corporate Branding</li>
              </ul>
            </div>

            {/* Raw Materials */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#8CBCB9] to-[#80DED9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800">Raw Materials</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Box Boards (India)</li>
                <li>• Quality Packaging Materials</li>
                <li>• Imported Supplies</li>
                <li>• Consistent Material Quality</li>
                <li>• Reliable Supply Chain</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Product Gallery */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0B5351] mb-6 text-center">Our Product Gallery</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[5, 6, 7, 1, 2].map((num) => (
              <div key={num} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image
                  src={`/assests/Products/Product ${num}.webp`}
                  alt={`Product ${num}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e: any) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Production Process */}
        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-[#0B5351] mb-6 text-center">Our Production Process</h2>
          <p className="text-center text-gray-600 mb-8">
            State-of-the-art facilities and modern equipment ensure consistent quality in every product we manufacture
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <Image
                  src={`/assests/Products/Production ${num}.webp`}
                  alt={`Production Process ${num}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e: any) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Key Clients */}
        <section className="mb-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-[#0B5351] mb-6 text-center">Our Valued Clients</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Modern Trade */}
            <div className="text-center p-6 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] rounded-lg text-white">
              <h3 className="text-xl font-bold mb-4">Modern Trade Partners</h3>
              <ul className="space-y-2 text-[#80DED9]">
                <li>✓ Keells Supermarkets</li>
                <li>✓ Cargills Food City</li>
                <li>✓ Arpico Supercenter</li>
              </ul>
            </div>

            {/* Wholesale */}
            <div className="text-center p-6 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] rounded-lg text-white">
              <h3 className="text-xl font-bold mb-4">Wholesale Clients</h3>
              <ul className="space-y-2 text-[#80DED9]">
                <li>✓ Wijesiri Distributors</li>
                <li>✓ Thusara Wholesale</li>
                <li>✓ Nosh Trading</li>
              </ul>
            </div>

            {/* Corporate */}
            <div className="text-center p-6 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] rounded-lg text-white">
              <h3 className="text-xl font-bold mb-4">Corporate Clients</h3>
              <ul className="space-y-2 text-[#80DED9]">
                <li>✓ Barista (Bag Printing)</li>
                <li>✓ P&S (Perera & Sons)</li>
                <li>✓ Goal Premathilake Upali</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Company Stats */}
        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-[#0B5351] mb-2">2017</div>
              <div className="text-gray-600 font-medium">Established</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-[#0B5351] mb-2">11</div>
              <div className="text-gray-600 font-medium">Team Members</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-[#0B5351] mb-2">3</div>
              <div className="text-gray-600 font-medium">Location Relocations</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-4xl font-bold text-[#0B5351] mb-2">100%</div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-gradient-to-r from-[#0B5351] to-[#8CBCB9] rounded-xl shadow-lg p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-xl text-[#80DED9]">
              To become a leading player in Sri Lanka&apos;s paper products and printing industry, 
              expanding production capacity while maintaining focus on sustainability and customer satisfaction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Quality Assurance</h3>
              <p className="text-sm text-[#80DED9]">Consistent quality standards in every product</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Timely Delivery</h3>
              <p className="text-sm text-[#80DED9]">Reliable and punctual service delivery</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Sustainability</h3>
              <p className="text-sm text-[#80DED9]">Eco-friendly products for a better future</p>
            </div>
          </div>
        </section>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
