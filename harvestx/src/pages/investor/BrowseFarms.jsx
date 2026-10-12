import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function BrowseFarms() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investAmounts, setInvestAmounts] = useState({});

  useEffect(() => {
    const fetchFarms = async () => {
      const querySnapshot = await getDocs(collection(db, "farms"));
      const farmsData = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === "open") {
          farmsData.push({ id: docSnap.id, ...data });
        }
      });

      setFarms(farmsData);
      setLoading(false);
    };

    fetchFarms();
  }, []);

  const handleInvest = async (farm) => {
    const amount = Number(investAmounts[farm.id]);

    if (!amount || amount <= 0) {
      alert("Enter valid investment amount");
      return;
    }

    const newInvestedAmount = farm.investedAmount + amount;

    // Update farm funding
    await updateDoc(doc(db, "farms", farm.id), {
      investedAmount: newInvestedAmount,
      status:
        newInvestedAmount >= farm.fundingRequired
          ? "funded"
          : "open",
    });

    // Store investment record
    await addDoc(collection(db, "investments"), {
      farmId: farm.id,
      investorId: currentUser.uid,
      investorEmail: currentUser.email,
      amount: amount,
      createdAt: new Date(),
    });

    alert("Investment successful!");

    // Refresh page data
    window.location.reload();
  };

  if (loading) {
    return (
      <DashboardLayout role="investor">
        <div className="text-xl font-semibold">
          Loading farms...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="investor">
      <h1 className="text-3xl font-bold mb-8">
        Browse Investment Opportunities
      </h1>

      {farms.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No farms available for investment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farms.map((farm) => {
            const progress =
              (farm.investedAmount / farm.fundingRequired) * 100;

            return (
              <div
                key={farm.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold mb-2">
                  {farm.farmName}
                </h2>

                <p className="text-gray-600 mb-1">
                  Location: {farm.location}
                </p>

                <p className="text-gray-600 mb-1">
                  Crop: {farm.cropType}
                </p>

                <p className="text-gray-600 mb-1">
                  Funding Required: ${farm.fundingRequired}
                </p>

                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  Invested: ${farm.investedAmount} (
                  {progress.toFixed(1)}%)
                </p>

                <input
                  type="number"
                  placeholder="Investment Amount ($)"
                  className="w-full p-2 border rounded mb-3"
                  value={investAmounts[farm.id] || ""}
                  onChange={(e) =>
                    setInvestAmounts({
                      ...investAmounts,
                      [farm.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => handleInvest(farm)}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Invest
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
