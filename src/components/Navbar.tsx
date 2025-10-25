'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Customer Management', href: '/customers' },
    { name: 'Order Management', href: '/orders' },
    { name: 'Supplier and Purchase', href: '/suppliers' },
    { name: 'Inventory Management', href: '/inventory' },
    { name: 'Production Management', href: '/production' },
    { name: 'Billing & Invoice', href: '/billing' },
    { name: 'Employee Payroll', href: '/payroll' },
    { name: 'Report & Analytics', href: '/reports' },
  ];

  return (
    <div className="w-64 bg-[#0B5351] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-[#0B5351]/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
            <Image
              src="/Logo (2).png"
              alt="Silekta Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <span className="text-white text-xl font-semibold">Silekta</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#0B5351]/20">
        <button className="w-full bg-[#DE8080] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#DE8080]/90 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
