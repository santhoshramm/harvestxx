import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateFarm() {
  const { currentUser } = useAuth();

  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [fundingRequired, setFundingRequired] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmName || !location || !cropType || !fundingRequired) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "farms"), {
        // Farmer info
        farmerId: currentUser.uid,
        farmerEmail: currentUser.email,

        // Farm info
        farmName,
        location,
        cropType,

        // Funding system
        fundingRequired: Number(fundingRequired),
        investedAmount: 0,
        status: "open", // open | funded | completed

        // Harvest system
        harvestRevenue: 0,
        isHarvested: false,

        // Metadata
        createdAt: serverTimestamp(),
      });

      alert("Farm created successfully!");

      // Reset form
      setFarmName("");
      setLocation("");
      setCropType("");
      setFundingRequired("");
    } catch (error) {
      console.error("Error creating farm:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="farmer">
      <h1 className="text-3xl font-bold mb-6">Create New Farm</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg"
      >
        <input
          type="text"
          placeholder="Farm Name"
          className="w-full p-2 border rounded"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Crop Type"
          className="w-full p-2 border rounded"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Funding Required ($)"
          className="w-full p-2 border rounded"
          value={fundingRequired}
          onChange={(e) => setFundingRequired(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating..." : "Create Farm"}
        </button>
      </form>
    </DashboardLayout>
  );
}
