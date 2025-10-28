"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useOrders } from "@/context/OrdersContext";
import { useCustomers } from "@/context/customer-context";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from "recharts";
import { Users, Package, ClipboardList, DollarSign, Truck, PlusSquare, FileText } from "lucide-react";

const StatCard = ({ title, value, hint, icon }: { title: string; value: string | number; hint?: string; icon?: React.ReactNode }) => (
	<Card className="p-4">
		<div className="flex items-start gap-3">
			<div className="p-2 bg-[#f1f8f7] rounded-md text-[#0B5351]">{icon}</div>
			<div className="flex-1">
				<div className="text-sm text-gray-500">{title}</div>
				<div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
				{hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
			</div>
		</div>
	</Card>
);

// Simple in-memory employees placeholder (could come from context/api)
const employees = [
	{ id: "E-001", name: "Aisha Khan", role: "Manager" },
	{ id: "E-002", name: "Bilal Ahmed", role: "Picker" },
	{ id: "E-003", name: "Samira Noor", role: "Driver" },
];

export default function DashboardPage() {
	const { orders } = useOrders();
	const { customers } = useCustomers();

	// summary numbers
	const totalCustomers = customers.length;
	const totalOrders = orders.length;
	const inventoryStock = 12450; // placeholder
	const monthlyRevenue = orders.reduce((s, o) => s + (typeof o.total === "number" ? o.total : 0), 0);
	const pendingShipments = orders.filter((o) => o.status === "In Progress").length;

	const recentOrders = orders.slice(0, 6).map((o) => ({
		id: o.id,
		customer: (o as any).customerName || (o as any).customer || "-",
		date: new Date((o as any).createdAt || Date.now()).toLocaleDateString(),
		status: o.status,
		total: typeof o.total === "number" ? o.total : 0,
	}));

	const revenueTrend = useMemo(() => {
		// create monthly sample data for last 6 months
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
		// derive simplistic monthly sums from orders createdAt
		const monthSums = months.map((m) => ({ name: m, revenue: Math.round(Math.random() * 20000 + 5000) }));
		return monthSums;
	}, [orders]);

	const statusCounts = useMemo(() => {
		const completed = orders.filter((o) => o.status === "Completed").length;
		const inProgress = orders.filter((o) => o.status === "In Progress").length;
		const cancelled = orders.filter((o) => o.status === "Cancelled").length;
		return [
			{ name: "Completed", value: completed },
			{ name: "In Progress", value: inProgress },
			{ name: "Cancelled", value: cancelled },
		];
	}, [orders]);

	return (
		<div className="flex h-screen bg-gray-50 overflow-hidden">
			<Navbar />
			<main className="flex-1 overflow-auto">
				<div className="bg-white border-b border-gray-200 px-6 py-6">
					<div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
							<p className="text-sm text-gray-700">Welcome back — overview of recent activity</p>
						</div>
						<div className="flex items-center gap-3">
							<Link href="/reports" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B5351] text-white rounded-md hover:bg-[#0B5351]/90">
								<FileText size={16} /> Generate Report
							</Link>
						</div>
					</div>
				</div>

				<div className="p-6">
					<div className="max-w-[1200px] mx-auto space-y-6">
						{/* Summary cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
							<StatCard title="Total Customers" value={totalCustomers} hint="All time" icon={<Users size={20} />} />
							<StatCard title="Total Orders" value={totalOrders} hint="All time" icon={<ClipboardList size={20} />} />
							<StatCard title="Inventory Stock" value={inventoryStock} hint="Units in stock" icon={<Package size={20} />} />
							<StatCard title="Monthly Revenue" value={`Rs ${monthlyRevenue.toFixed(2)}`} hint="This month" icon={<DollarSign size={20} />} />
							<StatCard title="Pending Shipments" value={pendingShipments} hint="Awaiting dispatch" icon={<Truck size={20} />} />
						</div>

						{/* Charts */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Monthly Sales</CardTitle>
										<div className="text-sm text-gray-500">Last 6 months</div>
									</div>
								</CardHeader>
								<CardContent>
									<div style={{ height: 260 }}>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={revenueTrend}>
												<XAxis dataKey="name" />
												<YAxis />
												<Tooltip />
												<Bar dataKey="revenue" fill="#0B5351" />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Orders by Status</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-6">
										<div style={{ width: 220, height: 220 }}>
											<ResponsiveContainer width="100%" height={220}>
												<RePieChart>
													<Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
														{statusCounts.map((entry, index) => (
															<Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : index === 1 ? '#F59E0B' : '#EF4444'} />
														))}
													</Pie>
													<Legend verticalAlign="bottom" height={36} />
												</RePieChart>
											</ResponsiveContainer>
										</div>
										<div className="flex-1">
											{statusCounts.map((s) => (
												<div key={s.name} className="flex items-center justify-between py-2">
													<div className="flex items-center gap-3">
														<span style={{ width: 10, height: 10, background: s.name === 'Completed' ? '#10B981' : s.name === 'In Progress' ? '#F59E0B' : '#EF4444', borderRadius: 3 }} />
														<div className="text-sm text-gray-700">{s.name}</div>
													</div>
													<div className="font-semibold">{s.value}</div>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Recent Orders table + Customers + Employees */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Recent Orders</CardTitle>
										<Link href="/orders" className="text-sm text-[#0B5351] underline">View all</Link>
									</div>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead className="text-xs text-gray-600 uppercase">
												<tr>
													<th className="p-2 text-left">Order</th>
													<th className="p-2 text-left">Customer</th>
													<th className="p-2 text-left">Date</th>
													<th className="p-2 text-left">Status</th>
													<th className="p-2 text-left">Total</th>
												</tr>
											</thead>
											<tbody>
												{recentOrders.length === 0 && (
													<tr><td colSpan={5} className="p-4 text-center text-gray-500">No recent orders</td></tr>
												)}
												{recentOrders.map((o) => (
													<tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50 text-gray-600">
														<td className="p-2 font-medium text-[#0B5351]">{o.id}</td>
														<td className="p-2">{o.customer}</td>
														<td className="p-2">{o.date}</td>
														<td className="p-2"><span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${o.status === 'Completed' ? 'bg-green-100 text-green-800' : o.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{o.status}</span></td>
														<td className="p-2">Rs {o.total.toFixed(2)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Recent Customers</CardTitle>
										<Link href="/customers" className="text-sm text-[#0B5351] underline">View all</Link>
									</div>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead className="text-xs text-gray-600 uppercase">
												<tr>
													<th className="p-2 text-left">ID</th>
													<th className="p-2 text-left">Name</th>
													<th className="p-2 text-left">Email</th>
												</tr>
											</thead>
											<tbody>
												{customers.slice(0, 6).map((c) => (
													<tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 text-gray-600">
														<td className="p-2 font-medium text-[#0B5351]">{c.id}</td>
														<td className="p-2">{c.name}</td>
														<td className="p-2">{c.email}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Employees</CardTitle>
										<Link href="/employee" className="text-sm text-[#0B5351] underline">View all</Link>
									</div>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead className="text-xs text-gray-600 uppercase">
												<tr>
													<th className="p-2 text-left">ID</th>
													<th className="p-2 text-left">Name</th>
													<th className="p-2 text-left">Role</th>
												</tr>
											</thead>
											<tbody>
												{employees.map((e) => (
													<tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50 text-gray-600">
														<td className="p-2 font-medium text-[#0B5351]">{e.id}</td>
														<td className="p-2">{e.name}</td>
														<td className="p-2">{e.role}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Quick actions */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm text-gray-500">Add New Order</div>
										<div className="mt-1 font-semibold text-gray-900">Create order quickly</div>
									</div>
									<button className="inline-flex items-center gap-2 px-3 py-2 bg-[#32ca56] text-white rounded-md"><PlusSquare size={16} /> New</button>
								</div>
							</Card>
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm text-gray-500">Add Customer</div>
										<div className="mt-1 font-semibold text-gray-900">Register new customer</div>
									</div>
									<button className="inline-flex items-center gap-2 px-3 py-2 bg-[#8CBCB9] text-white rounded-md"><Users size={16} /> Add</button>
								</div>
							</Card>
							<Card className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm text-gray-500">Generate Report</div>
										<div className="mt-1 font-semibold text-gray-900">Export CSV / PDF</div>
									</div>
									<Link href="/reports" className="inline-flex items-center gap-2 px-3 py-2 bg-[#0B5351] text-white rounded-md"><FileText size={16} /> Reports</Link>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

