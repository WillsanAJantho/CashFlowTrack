// // src/pages/ManualInput.jsx
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useAuth } from "@/context/AuthContext";

// export default function ManualInput() {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     receiver: "",
//     category: "",
//     source: "",
//     amount: "",
//     date: "",
//   });
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // Helpers
//   const formatRupiah = (amount) =>
//     `Rp${Number(amount).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("id-ID", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     if (!user?.access_token) return;
//     try {
//       const res = await fetch("http://localhost:8000/transactions/", {
//         headers: { Authorization: `Bearer ${user.access_token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch transactions");
//       const data = await res.json();
//       setRecords(data);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     }
//   };
//   useEffect(() => {
//     fetchTransactions();
//   }, [user]);

//   // Save or Update
//   const handleSave = async () => {
//     if (
//       !formData.receiver.trim() ||
//       !formData.category.trim() ||
//       !formData.source.trim() ||
//       formData.amount === "" ||
//       formData.date === ""
//     ) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const token = user?.access_token;
//     if (!token) {
//       alert("You must log in first");
//       return;
//     }

//     try {
//       setLoading(true);

//       const url = editingId
//         ? `http://localhost:8000/transactions/${editingId}`
//         : "http://localhost:8000/transactions/";
//       const method = editingId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           receiver: formData.receiver.trim(),
//           category: formData.category.trim(),
//           source: formData.source.trim(),
//           amount: parseInt(formData.amount, 10),
//           date: formData.date,
//         }),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.detail || "Failed to save transaction");
//       }

//       await fetchTransactions();
//       handleCancel(); // reset form after save/update
//     } catch (err) {
//       console.error("Error saving transaction:", err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this transaction?")) return;

//     try {
//       const res = await fetch(`http://localhost:8000/transactions/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${user.access_token}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete transaction");
//       setRecords(records.filter((r) => r.id !== id));
//     } catch (err) {
//       console.error("Error deleting transaction:", err);
//       alert(err.message);
//     }
//   };

//   // Start editing
//   const handleEdit = (record) => {
//     setFormData({
//       receiver: record.receiver,
//       category: record.category,
//       source: record.source,
//       amount: record.amount,
//       date: record.date.split("T")[0],
//     });
//     setEditingId(record.id);
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setFormData({ receiver: "", category: "", source: "", amount: "", date: "" });
//     setEditingId(null);
//   };

//   return (
//     <main className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
//       {/* Add/Edit Form */}
//       <Card className="w-full max-w-xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
//             {editingId ? "Edit Expense" : "Add Expense"}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <Input
//             placeholder="Receiver"
//             value={formData.receiver}
//             onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
//           />
//           <Input
//             placeholder="Category"
//             value={formData.category}
//             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//           />
//           <Input
//             placeholder="Payment Method"
//             value={formData.source}
//             onChange={(e) => setFormData({ ...formData, source: e.target.value })}
//           />
//           <Input
//             placeholder="Amount"
//             type="number"
//             value={formData.amount}
//             onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//           />
//           <Input
//             type="date"
//             value={formData.date}
//             onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//           />

//           <div className="flex gap-2">
//             <Button
//               onClick={handleSave}
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 
//                          hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl
//                          shadow-md shadow-cyan-400/40 transform transition-all duration-300 
//                          hover:scale-105 active:scale-95"
//             >
//               {loading ? "Saving..." : editingId ? "Update Expense" : "Save Expense"}
//             </Button>

//             {editingId && (
//               <Button
//                 onClick={handleCancel}
//                 type="button"
//                 className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-xl"
//               >
//                 Cancel
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Saved Records Table */}
//       <Card className="w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
//             Saved Records
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {records.length === 0 ? (
//             <p className="text-gray-600 text-center">No records yet</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse text-sm sm:text-base">
//                 <thead>
//                   <tr className="border-b bg-gray-100/40">
//                     <th className="p-3 font-semibold">Receiver</th>
//                     <th className="p-3 font-semibold">Category</th>
//                     <th className="p-3 font-semibold">Payment Method</th>
//                     <th className="p-3 font-semibold">Amount</th>
//                     <th className="p-3 font-semibold">Date</th>
//                     <th className="p-3 font-semibold text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {records.map((r) => (
//                     <tr key={r.id} className="border-b hover:bg-gray-50/60">
//                       <td className="p-3">{r.receiver}</td>
//                       <td className="p-3">{r.category}</td>
//                       <td className="p-3">{r.source}</td>
//                       <td className="p-3 font-medium text-teal-700">
//                         {formatRupiah(r.amount)}
//                       </td>
//                       <td className="p-3">{formatDate(r.date)}</td>
//                       <td className="p-3 flex gap-2 justify-center">
//                         <Button
//                           size="sm"
//                           onClick={() => handleEdit(r)}
//                           className="bg-yellow-400 hover:bg-yellow-500 text-black"
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleDelete(r.id)}
//                           className="bg-red-500 hover:bg-red-600 text-white"
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

// src/pages/ManualInput.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function ManualInput() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    receiver: "",
    category: "",
    source: "",
    amount: "",
    date: "",
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Helpers
  const formatRupiah = (amount) =>
    `Rp${Number(amount).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user?.access_token) return;
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
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Save or Update
  const handleSave = async () => {
    if (
      !formData.receiver.trim() ||
      !formData.category.trim() ||
      !formData.source.trim() ||
      formData.amount === "" ||
      formData.date === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    const token = user?.access_token;
    if (!token) {
      alert("You must log in first");
      return;
    }

    try {
      setLoading(true);

      const url = editingId
        ? `http://localhost:8000/transactions/${editingId}`
        : "http://localhost:8000/transactions/";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: formData.receiver.trim(),
          category: formData.category.trim(),
          source: formData.source.trim(),
          amount: parseInt(formData.amount, 10),
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to save transaction");
      }

      await fetchTransactions();
      handleCancel();
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`http://localhost:8000/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.access_token}` },
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert(err.message);
    }
  };

  // Edit
  const handleEdit = (record) => {
    setFormData({
      receiver: record.receiver,
      category: record.category,
      source: record.source,
      amount: record.amount,
      date: record.date.split("T")[0],
    });
    setEditingId(record.id);
  };

  const handleCancel = () => {
    setFormData({ receiver: "", category: "", source: "", amount: "", date: "" });
    setEditingId(null);
  };

  return (
    <main className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
      {/* Add/Edit Form */}
      <Card className="w-full max-w-xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
            {editingId ? "Edit Expense" : "Add Expense"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Receiver"
            value={formData.receiver}
            onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
          />

          {/* Category Dropdown */}
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-9 rounded-lg border border-black px-3 text-sm sm:text-base 
                      focus:ring-2 focus:ring-black-300 focus:border-black"
          >
            <option value="">Select Category</option>
            <option value="Payment">Payment</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>

          {/* Payment Method Dropdown */}
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full h-9 rounded-lg border border-black px-3 text-sm sm:text-base 
                      focus:ring-2 focus:ring-black-300 focus:border-black"
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="QRIS">QRIS</option>
          </select>

          <Input
            placeholder="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 
                         hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl
                         shadow-md shadow-cyan-400/40 transform transition-all duration-300 
                         hover:scale-105 active:scale-95"
            >
              {loading ? "Saving..." : editingId ? "Update Expense" : "Save Expense"}
            </Button>
            {editingId && (
              <Button
                onClick={handleCancel}
                type="button"
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-xl"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Records Table */}
      <Card className="w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
            Saved Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          {records.length === 0 ? (
            <p className="text-gray-600 text-center">No records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b bg-gray-100/40">
                    <th className="p-3 font-semibold">Receiver</th>
                    <th className="p-3 font-semibold">Category</th>
                    <th className="p-3 font-semibold">Payment Method</th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50/60">
                      <td className="p-3">{r.receiver}</td>
                      <td className="p-3">{r.category}</td>
                      <td className="p-3">{r.source}</td>
                      <td className="p-3 font-medium text-teal-700">
                        {formatRupiah(r.amount)}
                      </td>
                      <td className="p-3">{formatDate(r.date)}</td>
                      <td className="p-3 flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(r)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
