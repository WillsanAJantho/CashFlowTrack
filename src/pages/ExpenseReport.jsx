// // src/pages/ExpenseReport.jsx
// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
// import { useAuth } from "@/context/AuthContext";

// export default function ExpenseReport() {
//   const { user } = useAuth();
//   const [records, setRecords] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedMethod, setSelectedMethod] = useState("All");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const symbol = "Rp";

//   const formatRupiah = (amount) =>
//     `${symbol}${amount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("id-ID", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // 🔹 Fetch transactions from backend
//   useEffect(() => {
//     if (!user?.access_token) return;
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/transactions/", {
//           headers: { Authorization: `Bearer ${user.access_token}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch transactions");
//         const data = await res.json();
//         setRecords(data);
//       } catch (err) {
//         console.error("Error fetching transactions:", err);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const categories = ["All", ...new Set(records.map((r) => r.category))];
//   const paymentMethods = ["All", "Cash", "Debit Card", "Credit Card", "QRIS"];

//   // 🔹 Apply filters
//   const filteredRecords = records.filter((r) => {
//     const matchCategory = selectedCategory === "All" || r.category === selectedCategory;
//     const matchMethod = selectedMethod === "All" || r.source === selectedMethod;

//     const recordDate = new Date(r.date);
//     const matchFrom = fromDate ? recordDate >= new Date(fromDate) : true;
//     const matchTo = toDate ? recordDate <= new Date(toDate) : true;

//     return matchCategory && matchMethod && matchFrom && matchTo;
//   });

//   // 🔹 Compute category totals from filtered data
//   const pieData = Object.entries(
//     filteredRecords.reduce((acc, rec) => {
//       acc[rec.category] = (acc[rec.category] || 0) + rec.amount;
//       return acc;
//     }, {})
//   ).map(([category, total]) => ({
//     name: category,
//     value: total,
//   }));

//   const COLORS = ["#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#f43f5e"];
//   const totalSpent = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

//   return (
//     <div className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
//       <Card className="w-full max-w-6xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-b-2xl">
//         {/* Header */}
//         <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
//             Expense Report
//           </CardTitle>

//           {/* Filters */}
//           <div className="flex flex-wrap gap-4">
//             {/* Category */}
//             <div className="flex flex-col text-sm">
//               <label className="font-medium text-gray-700 mb-1">Category</label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Payment Method */}
//             <div className="flex flex-col text-sm">
//               <label className="font-medium text-gray-700 mb-1">Payment Method</label>
//               <select
//                 value={selectedMethod}
//                 onChange={(e) => setSelectedMethod(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
//               >
//                 {paymentMethods.map((method) => (
//                   <option key={method} value={method}>
//                     {method}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date Range */}
//             <div className="flex flex-col text-sm">
//               <label className="font-medium text-gray-700 mb-1">From</label>
//               <input
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
//               />
//             </div>
//             <div className="flex flex-col text-sm">
//               <label className="font-medium text-gray-700 mb-1">To</label>
//               <input
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
//               />
//             </div>
//           </div>
//         </CardHeader>

//         {/* Content */}
//         <CardContent className="flex flex-col gap-10">
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse text-sm md:text-base">
//               <thead>
//                 <tr className="border-b bg-gray-100/40">
//                   <th className="p-3 font-semibold">Receiver</th>
//                   <th className="p-3 font-semibold">Category</th>
//                   <th className="p-3 font-semibold">Method</th>
//                   <th className="p-3 font-semibold">Amount</th>
//                   <th className="p-3 font-semibold">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRecords.map((r, i) => (
//                   <tr key={i} className="border-b hover:bg-gray-50/60 transition">
//                     <td className="p-3">{r.receiver}</td>
//                     <td className="p-3">{r.category}</td>
//                     <td className="p-3">{r.source}</td>
//                     <td className="p-3 font-medium text-teal-700">
//                       {formatRupiah(r.amount)}
//                     </td>
//                     <td className="p-3">{formatDate(r.date)}</td>
//                   </tr>
//                 ))}
//                 <tr className="bg-gray-100 font-bold">
//                   <td className="p-3">Total</td>
//                   <td></td>
//                   <td></td>
//                   <td className="p-3 text-teal-700">{formatRupiah(totalSpent)}</td>
//                   <td></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Pie Chart */}
//           <div className="w-full h-[300px] sm:h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={window.innerWidth < 640 ? "60%" : "70%"}
//                   label={({ name, value }) =>
//                     window.innerWidth > 640 ? `${name}: ${formatRupiah(value)}` : null
//                   }
//                 >
//                   {pieData.map((_, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => formatRupiah(value)} />
//                 <Legend verticalAlign="bottom" height={36} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// src/pages/ExpenseReport.jsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/context/AuthContext";

export default function ExpenseReport() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const symbol = "Rp";

  const formatRupiah = (amount) =>
    `${symbol}${amount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🔹 Fetch transactions from backend
  useEffect(() => {
    if (!user?.access_token) return;
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/transactions/", {
          headers: { Authorization: `Bearer ${user.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchData();
  }, [user]);

  const categories = ["All", ...new Set(records.map((r) => r.category))];
  const paymentMethods = ["All", "Cash", "Debit Card", "Credit Card", "QRIS"];

  // 🔹 Apply filters for table
  const filteredRecords = records.filter((r) => {
    const matchCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchMethod = selectedMethod === "All" || r.source === selectedMethod;
    const recordDate = new Date(r.date);
    const matchFrom = fromDate ? recordDate >= new Date(fromDate) : true;
    const matchTo = toDate ? recordDate <= new Date(toDate) : true;
    return matchCategory && matchMethod && matchFrom && matchTo;
  });

  // 🔹 Pie Chart should only respect Payment Method + Date Range
  const chartFilteredRecords = records.filter((r) => {
    const matchMethod = selectedMethod === "All" || r.source === selectedMethod;
    const recordDate = new Date(r.date);
    const matchFrom = fromDate ? recordDate >= new Date(fromDate) : true;
    const matchTo = toDate ? recordDate <= new Date(toDate) : true;
    return matchMethod && matchFrom && matchTo;
  });

  const pieData = Object.entries(
    chartFilteredRecords.reduce((acc, rec) => {
      acc[rec.category] = (acc[rec.category] || 0) + rec.amount;
      return acc;
    }, {})
  ).map(([category, total]) => ({
    name: category,
    value: total,
  }));

  const COLORS = ["#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#f43f5e"];
  const totalSpent = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
      <Card className="w-full max-w-6xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-b-2xl">
        {/* Header */}
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
            Expense Report
          </CardTitle>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category */}
            <div className="flex flex-col text-sm">
              <label className="font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col text-sm">
              <label className="font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col text-sm">
              <label className="font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
              />
            </div>
            <div className="flex flex-col text-sm">
              <label className="font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium shadow-sm text-sm md:text-base"
              />
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-col gap-10">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm md:text-base">
              <thead>
                <tr className="border-b bg-gray-100/40">
                  <th className="p-3 font-semibold">Receiver</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Method</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50/60 transition">
                    <td className="p-3">{r.receiver}</td>
                    <td className="p-3">{r.category}</td>
                    <td className="p-3">{r.source}</td>
                    <td className="p-3 font-medium text-teal-700">
                      {formatRupiah(r.amount)}
                    </td>
                    <td className="p-3">{formatDate(r.date)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="p-3">Total</td>
                  <td></td>
                  <td></td>
                  <td className="p-3 text-teal-700">{formatRupiah(totalSpent)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pie Chart */}
          <div className="w-full h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 640 ? "60%" : "70%"}
                  label={({ name, value }) =>
                    window.innerWidth > 640 ? `${name}: ${formatRupiah(value)}` : null
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatRupiah(value)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
