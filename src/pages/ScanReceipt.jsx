// // src/pages/ScanReceipt.jsx
// import { useState, useEffect, useRef } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Camera } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export default function ScanReceipt() {
//   const { user } = useAuth();
//   const [records, setRecords] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef(null);

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

//   // Fetch Transactions
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

//   // File Handling
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const handleCameraAccess = () => {
//     alert("Camera access feature coming soon!");
//   };

//   // Process Receipt
//   const handleProcessReceipt = async () => {
//     if (!user?.access_token) {
//       alert("You must log in first");
//       return;
//     }
//     if (!fileInputRef.current?.files[0]) {
//       alert("Please upload a receipt image first");
//       return;
//     }
//     if (!paymentMethod) {
//       alert("Please select a payment method");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", fileInputRef.current.files[0]);

//     try {
//       setLoading(true);

//       // Step 1: Send image to OCR backend
//       const ocrRes = await fetch("http://localhost:8000/ocr/receipt", {
//          method: "POST",
//          headers: { Authorization: `Bearer ${user.access_token}` },
//          body: formData,   // or the JSON body if you're sending metadata
//       });
//       if (!ocrRes.ok) throw new Error("Failed to process receipt");
//       const parsed = await ocrRes.json();

//       // Step 2: Combine with manual inputs
//       const recordToSave = {
//         receiver: parsed.receiver || "Unknown Store",
//         category: parsed.category || "Shopping",
//         source: paymentMethod,
//         amount: parsed.amount || 0,
//         date: selectedDate,
//       };

//       // Step 3: Save transaction
//       const saveRes = await fetch("http://localhost:8000/transactions/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.access_token}`,
//         },
//         body: JSON.stringify(recordToSave),
//       });
//       if (!saveRes.ok) throw new Error("Failed to save transaction");

//       const saved = await saveRes.json();
//       setRecords([...records, saved]);
//       setPreview(null);
//       setPaymentMethod("");
//       alert("Receipt processed and saved!");
//     } catch (err) {
//       console.error("Error saving transaction:", err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
//       {/* Upload / Camera Box */}
//       <Card className="w-full max-w-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl flex flex-col items-center p-4 sm:p-6">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
//             Scan Receipt
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="flex flex-col items-center space-y-6 w-full">
//           {/* Preview Box */}
//           <div className="w-full h-48 sm:h-64 bg-white rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden">
//             {preview ? (
//               <img src={preview} alt="Receipt Preview" className="object-contain max-h-full" />
//             ) : (
//               <span className="text-gray-500 text-sm sm:text-base">No image selected</span>
//             )}
//           </div>

//           {/* Upload + Camera */}
//           <div className="flex items-center justify-between w-full flex-col sm:flex-row gap-4">
//             <label className="w-full sm:w-auto flex-1">
//               <Input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//               <Button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 
//                            hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-base sm:text-lg py-3 rounded-xl
//                            shadow-md shadow-cyan-400/40 transform transition-all duration-300 
//                            hover:scale-105 active:scale-95"
//               >
//                 Upload Image
//               </Button>
//             </label>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full hover:bg-gray-100 transform transition-all duration-300 hover:scale-125"
//               onClick={handleCameraAccess}
//             >
//               <Camera className="w-8 h-8 text-teal-600" />
//             </Button>
//           </div>

//           {/* Date Picker */}
//           <div className="w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Transaction Date
//             </label>
//             <Input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-full rounded-lg border border-black px-3 py-2 text-sm sm:text-base 
//                          focus:ring-2 focus:ring-teal-300 focus:border-black"
//             />
//           </div>

//           {/* Payment Method Dropdown */}
//           <div className="w-full">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Payment Method
//             </label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full h-9 rounded-lg border border-black px-3 text-sm sm:text-base 
//                          focus:ring-2 focus:ring-black-300 focus:border-black"
//             >
//               <option value="">Select Payment Method</option>
//               <option value="Cash">Cash</option>
//               <option value="Debit Card">Debit Card</option>
//               <option value="Credit Card">Credit Card</option>
//               <option value="QRIS">QRIS</option>
//             </select>
//           </div>

//           {/* Process Button */}
//           <Button
//             className="mt-2 w-full bg-gradient-to-r from-green-500 to-emerald-500 
//                        hover:from-green-600 hover:to-emerald-600 
//                        text-white font-semibold text-base sm:text-lg py-3 rounded-xl
//                        shadow-md shadow-green-400/40 transform transition-all duration-300 
//                        hover:scale-105 active:scale-95"
//             onClick={handleProcessReceipt}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Process Receipt"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Results Table */}
//       <Card className="w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
//             Extracted Records
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
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {records.map((r, i) => (
//                     <tr key={i} className="border-b hover:bg-gray-50/60 transition">
//                       <td className="p-3">{r.receiver}</td>
//                       <td className="p-3">{r.category}</td>
//                       <td className="p-3">{r.source}</td>
//                       <td className="p-3 font-medium text-teal-700">
//                         {formatRupiah(r.amount)}
//                       </td>
//                       <td className="p-3">{formatDate(r.date)}</td>
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

// //part2
// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Camera } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// export default function ScanReceipt() {
//   const { user } = useAuth();
//   const [records, setRecords] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [ocrData, setOcrData] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [loading, setLoading] = useState(false);

//   const formatRupiah = (amount) =>
//     `Rp${Number(amount).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

//   // Upload preview
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       setLoading(true);
//       const res = await fetch("http://localhost:8000/ocr/receipt", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) throw new Error("OCR failed");
//       const data = await res.json();
//       setOcrData(data);
//     } catch (err) {
//       console.error("OCR error:", err);
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!user?.access_token) {
//       alert("Please login first");
//       return;
//     }

//     const record = {
//       receiver: ocrData?.receiver || "Unknown",
//       category: ocrData?.category || "Others",
//       source: ocrData?.source || paymentMethod || "Cash",
//       amount: ocrData?.amount || 0,
//       date: ocrData?.date || new Date().toISOString().split("T")[0],
//     };

//     try {
//       const res = await fetch("http://localhost:8000/transactions/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.access_token}`,
//         },
//         body: JSON.stringify(record),
//       });
//       if (!res.ok) throw new Error("Failed to save record");
//       const saved = await res.json();
//       setRecords([...records, saved]);
//       setPreview(null);
//       setOcrData(null);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <main className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
//       <Card className="w-full max-w-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-4 sm:p-6">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-gray-900 text-center">
//             Scan Receipt
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="w-full h-56 bg-white rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden">
//             {preview ? (
//               <img src={preview} alt="Preview" className="object-contain max-h-full" />
//             ) : (
//               <span className="text-gray-500">No image selected</span>
//             )}
//           </div>

//           <label className="w-full flex flex-col items-center">
//             <Input type="file" accept="image/*" onChange={handleFileChange} />
//           </label>

//           {loading && <p className="text-teal-600 text-center">Processing OCR...</p>}

//           {ocrData && (
//             <div className="bg-gray-50 rounded-lg p-4 shadow-inner space-y-2">
//               <p><b>Receiver:</b> {ocrData.receiver || "Not found"}</p>
//               <p><b>Amount:</b> {ocrData.amount ? formatRupiah(ocrData.amount) : "Not found"}</p>
//               <p><b>Date:</b> {ocrData.date || "Not found"}</p>
//               <p><b>Payment Method:</b> {ocrData.source || "Not found"}</p>
//             </div>
//           )}

//           <Button
//             onClick={handleSave}
//             disabled={!ocrData || loading}
//             className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all"
//           >
//             Save to Records
//           </Button>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

// src/pages/ScanReceipt.jsx
import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ScanReceipt() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [preview, setPreview] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const formatRupiah = (amount) =>
    `Rp${Number(amount).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;

  // Upload preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await fetch("http://localhost:8000/ocr/receipt", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("OCR failed");
      const data = await res.json();
      setOcrData(data);
    } catch (err) {
      console.error("OCR error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.access_token) {
      alert("Please login first");
      return;
    }

    const record = {
      receiver: ocrData?.receiver || "Unknown",
      category: ocrData?.category || "Others",
      source: ocrData?.source || paymentMethod || "Cash",
      amount: ocrData?.amount || 0,
      date: ocrData?.date || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:8000/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error("Failed to save record");
      const saved = await res.json();
      setRecords([...records, saved]);
      setPreview(null);
      setOcrData(null);
      setPaymentMethod("");
      alert("Receipt saved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="w-full flex flex-col items-center p-4 sm:p-6 md:p-8 space-y-8">
      <Card className="w-full max-w-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Scan Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-56 bg-white rounded-xl border border-gray-300 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="object-contain max-h-full" />
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}
          </div>

          {/* Upload button */}
          <label className="w-full flex flex-col items-center">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 
                         hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-base sm:text-lg py-3 rounded-xl
                         shadow-md shadow-cyan-400/40 transform transition-all duration-300 
                         hover:scale-105 active:scale-95"
            >
              Upload Image
            </Button>
          </label>

          {loading && <p className="text-teal-600 text-center">Processing OCR...</p>}

          {ocrData && (
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner space-y-2">
              <p><b>Receiver:</b> {ocrData.receiver || "Not found"}</p>
              <p><b>Amount:</b> {ocrData.amount ? formatRupiah(ocrData.amount) : "Not found"}</p>
              <p><b>Date:</b> {ocrData.date || "Not found"}</p>
              <p><b>Payment Method:</b> {ocrData.source || "Not found"}</p>
            </div>
          )}

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!ocrData || loading}
            className="mt-2 w-full bg-gradient-to-r from-green-500 to-emerald-500 
                       hover:from-green-600 hover:to-emerald-600 
                       text-white font-semibold text-base sm:text-lg py-3 rounded-xl
                       shadow-md shadow-green-400/40 transform transition-all duration-300 
                       hover:scale-105 active:scale-95"
          >
            {loading ? "Processing..." : "Save to Records"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
