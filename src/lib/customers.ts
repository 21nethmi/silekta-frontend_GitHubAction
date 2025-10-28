export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

const seededCustomers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Amal Perera",
    phone: "+94 77 123 4567",
    email: "amal@example.com",
  },
  {
    id: "CUST-1002",
    name: "Nimal Fernando",
    phone: "+94 77 234 5678",
    email: "nimal@example.com",
  },
  {
    id: "CUST-1003",
    name: "Samanthi Jayasuriya",
    phone: "+94 77 345 6789",
    email: "samanthi@example.com",
  },
  {
    id: "CUST-1004",
    name: "Kamal Silva",
    phone: "+94 77 456 7890",
    email: "kamal@example.com",
  },
  {
    id: "CUST-1005",
    name: "Dilani Perera",
    phone: "+94 77 567 8901",
    email: "dilani@example.com",
  },
];

// Simulate an async search - returns a promise that resolves after a short delay
export function searchCustomers(query: string): Promise<Customer[]> {
  const q = query.trim().toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!q) return resolve(seededCustomers.slice(0, 50));
      const results = seededCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
      resolve(results);
    }, 180);
  });
}

export function getCustomerById(id: string) {
  return seededCustomers.find((c) => c.id === id) ?? null;
}

export function getCustomerByName(name: string) {
  if (!name) return null;
  const q = name.trim().toLowerCase();
  // try exact id-name pattern first
  const m = name.match(/^(CUST-[0-9]+)\s+—\s*(.*)$/);
  if (m) {
    const byId = seededCustomers.find((c) => c.id === m[1]);
    if (byId) return byId;
    // fallthrough to name match using the captured name portion
    const nm = (m[2] || "").trim().toLowerCase();
    const byName = seededCustomers.find((c) => c.name.toLowerCase() === nm);
    if (byName) return byName;
  }

  // fallback to matching by name substring
  return seededCustomers.find((c) => c.name.toLowerCase().includes(q)) ?? null;
}

export default {
  searchCustomers,
  getCustomerById,
};
