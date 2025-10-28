export interface User {
  employeeId: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  department: string;
  position: string;
  role: 'admin' | 'employee';
}

export const mockUsers: User[] = [

  {
    employeeId: 'ADMIN001',
    password: 'Admin@123',
    fullName: 'Nilanthi Admin',
    phoneNumber: '0771234567',
    department: 'IT',
    position: 'System Administrator',
    role: 'admin',
  },
  {
    employeeId: 'ADMIN002',
    password: 'Admin@123',
    fullName: 'Saman Admin',
    phoneNumber: '0772345678',
    department: 'Management',
    position: 'IT Manager',
    role: 'admin',
  },
  // Employee users - Standard access
  {
    employeeId: 'EMP001',
    password: 'Employee@123',
    fullName: 'Kumari Employee',
    phoneNumber: '0773456789',
    department: 'Operations',
    position: 'Operations Clerk',
    role: 'employee',
  },
  {
    employeeId: 'EMP002',
    password: 'Employee@123',
    fullName: 'Kumara Worker',
    phoneNumber: '0774567890',
    department: 'Operations',
    position: 'Operations clerk',
    role: 'employee',
  },
//   {
//     employeeId: 'EMP003',
//     password: 'Employee@123',
//     fullName: 'David Staff',
//     phoneNumber: '0775678901',
//     department: 'Sales',
//     position: 'Sales Representative',
//     role: 'employee',
//   },
//   {
//     employeeId: 'EMP004',
//     password: 'Employee@123',
//     fullName: 'Emma Assistant',
//     phoneNumber: '0776789012',
//     department: 'Inventory',
//     position: 'Inventory Clerk',
//     role: 'employee',
//   },
];

// Mock login function
export const mockLogin = (employeeId: string, password: string): User | null => {
  const user = mockUsers.find(
    (u) => u.employeeId === employeeId && u.password === password
  );
  return user || null;
};

// Mock register function
export const mockRegister = (userData: Omit<User, 'employeeId'> & { employeeId: string }): boolean => {
  // Check if employee ID already exists
  const exists = mockUsers.find((u) => u.employeeId === userData.employeeId);
  if (exists) {
    return false;
  }
  
  // Add new user to mock database
  mockUsers.push(userData as User);
  return true;
};

// Get user role
export const getUserRole = (employeeId: string): string | null => {
  const user = mockUsers.find((u) => u.employeeId === employeeId);
  return user ? user.role : null;
};

// Store current user in localStorage (for demo purposes)
export const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Check if current user is employee
export const isEmployee = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'employee';
};

// Pages that only admins can access
export const ADMIN_ONLY_PAGES = ['/dashboard', '/employee', '/reports', '/payroll', '/paysheet'];

// Check if a page is admin-only
export const isAdminOnlyPage = (pathname: string): boolean => {
  return ADMIN_ONLY_PAGES.some(page => pathname.startsWith(page));
};
