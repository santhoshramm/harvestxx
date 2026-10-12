import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function MyInvestments() {
  const { currentUser } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        // Get investments for this investor
        const q = query(
          collection(db, "investments"),
          where("investorId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const invData = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          // Fetch farm info
          const farmDoc = await getDoc(doc(db, "farms", data.farmId));
          if (farmDoc.exists()) {
            const farmData = farmDoc.data();
            invData.push({
              id: docSnap.id,
              farmId: data.farmId,
              farmName: farmData.farmName,
              cropType: farmData.cropType,
              location: farmData.location,
              fundingRequired: farmData.fundingRequired,
              investedAmount: farmData.investedAmount,
              status: farmData.status,
              myInvestment: data.amount,
            });
          }
        }

        setInvestments(invData);
      } catch (error) {
        console.error("Error fetching investments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [currentUser]);

  if (loading) {
    return (
      <DashboardLayout role="investor">
        <div className="text-xl font-semibold">Loading investments...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="investor">
      <h1 className="text-3xl font-bold mb-8">My Investments</h1>

      {investments.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          You haven't invested in any farms yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investments.map((inv) => {
            const progress =
              (inv.investedAmount / inv.fundingRequired) * 100;

            return (
              <div
                key={inv.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold mb-2">{inv.farmName}</h2>

                <p className="text-gray-600 mb-1">
                  Location: {inv.location}
                </p>

                <p className="text-gray-600 mb-1">
                  Crop: {inv.cropType}
                </p>

                <p className="text-gray-600 mb-1">
                  Funding Required: ${inv.fundingRequired}
                </p>

                <p className="text-gray-600 mb-1">
                  Total Invested: ${inv.investedAmount} (
                  {progress.toFixed(1)}%)
                </p>

                <p className="text-gray-700 mb-2">
                  Your Investment: ${inv.myInvestment}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p
                className={`mt-2 font-semibold ${
                    inv.status === "funded"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
                >
                Status: {inv.status
                    ? inv.status.charAt(0).toUpperCase() + inv.status.slice(1)
                    : "Open"}
                </p>
                            </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
