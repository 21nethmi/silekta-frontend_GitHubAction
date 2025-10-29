'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard,
  Users,
  ShoppingCart,
  Truck,
  Package,
  Factory,
  UserCheck,
  Receipt,
  BarChart3,
  LogOut,
  Sparkles,
  Home
} from 'lucide-react';
import { getCurrentUser } from '@/lib/mockAuth';

// Define NavItem type
type NavItem = {
  name: string;
  href?: string;
  icon?: any;
  children?: { name: string; href: string }[];
};

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'employee' | null>(null);

  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Track navbar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check user role on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserRole(user.role);
    }
  }, []);

  // Define navigation structure for ADMIN (all routes)
  const adminNavItems: NavItem[] = [
    {name: 'Home', href: '/home', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customer Management', href: '/customers', icon: Users },
    { name: 'Order Management', href: '/orders', icon: ShoppingCart },
    { name: 'Supplier & Purchase', href: '/suppliers', icon: Truck },
    { name: 'Inventory Management', href: '/inventory', icon: Package },
    { name: 'Production Management', href: '/production', icon: Factory },
    {
      name: 'Employee Management',
      icon: UserCheck,
      children: [
        { name: 'Employee List', href: '/employee' },
        { name: 'Payroll', href: '/payroll' },
      ],
    },
    { name: 'Billing & Invoice', href: '/billing', icon: Receipt },
    { name: 'Report & Analytics', href: '/reports', icon: BarChart3 },
  ];

  // Define navigation structure for EMPLOYEE (no Dashboard, Employee Management, Payroll, or Reports)
  const employeeNavItems: NavItem[] = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Customer Management", href: "/customers", icon: Users },
    { name: "Order Management", href: "/orders", icon: ShoppingCart },
    { name: "Supplier & Purchase", href: "/suppliers", icon: Truck },
    { name: "Inventory Management", href: "/inventory", icon: Package },
    { name: "Production Management", href: "/production", icon: Factory },
    { name: "Billing & Invoice", href: "/billing", icon: Receipt },
  ];

  // Select navigation items based on role
  const navItems = currentUserRole === 'admin' ? adminNavItems : employeeNavItems;

  // Toggle dropdown open/close
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    router.push('/login');
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-[#0B5351] to-[#083936] flex flex-col min-h-screen shadow-2xl relative transition-all duration-300 ease-in-out`}>
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B5351]/30 via-[#083936]/20 to-[#0B5351]/15 pointer-events-none"></div>
      
      {/* Logo */}
      <div className="p-8 border-b border-white/10 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8CBCB9]/50 to-[#0B5351]/30 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-[#8CBCB9]/40">
              <Image
                src="/Logo (2).png"
                alt="Silekta Logo"
                width={28}
                height={28}
                className="w-7 h-7 drop-shadow-md"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-white text-xl font-bold tracking-wide drop-shadow-md">Silekta</span>
                <div className="flex items-center space-x-1 text-xs text-white/70">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Management System</span>
                </div>
              </div>
            )}
          </div>
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <ChevronRight 
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 relative overflow-y-auto">
        <ul className="space-y-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => !isCollapsed && toggleDropdown(item.name)}
                      className={`w-full flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center px-5 py-4 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] relative overflow-hidden`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <div className="flex items-center space-x-4">
                        {IconComponent && (
                          <IconComponent 
                            size={20} 
                            className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
                          />
                        )}
                        {!isCollapsed && <span className="text-base font-medium">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className="transition-transform duration-300">
                          {openDropdown === item.name ? (
                            <ChevronDown size={16} className="rotate-0" />
                          ) : (
                            <ChevronRight size={16} className="group-hover:translate-x-1" />
                          )}
                        </div>
                      )}
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8CBCB9]/20 to-[#0B5351]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Dropdown children with smooth animation */}
                    {!isCollapsed && (
                      <div className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === item.name ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <ul className="ml-6 mt-3 space-y-2 pl-4 border-l border-white/10">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={`block px-4 py-3 rounded-lg text-sm transition-all duration-300 group hover:translate-x-1 ${
                                  pathname === child.href
                                    ? 'bg-white/20 text-white shadow-md border border-white/10'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                    pathname === child.href ? 'bg-white' : 'bg-white/30'
                                  }`}></div>
                                  <span>{child.name}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-5 py-4 rounded-xl transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] relative overflow-hidden ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-[#8CBCB9]/40 to-[#0B5351]/25 text-white shadow-md border border-[#8CBCB9]/30'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <div className="flex items-center space-x-4">
                      {IconComponent && (
                        <IconComponent 
                          size={20} 
                          className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
                        />
                      )}
                      {!isCollapsed && <span className="text-base font-medium">{item.name}</span>}
                    </div>
                    {/* Active indicator */}
                    {pathname === item.href && !isCollapsed && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      </div>
                    )}
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8CBCB9]/20 to-[#0B5351]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-white/10 relative">
        <button 
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-[#DE8080] to-[#E09090] text-white px-5 py-4 rounded-xl font-medium hover:from-[#E09090] hover:to-[#DE8080] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-3 group relative overflow-hidden"
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300 relative z-10" />
          {!isCollapsed && <span className="relative z-10">Logout</span>}
        </button>
      </div>
      
    </div>
  );
};

export default Navbar;