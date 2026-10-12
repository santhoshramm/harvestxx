import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function MyFarms() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const q = query(
          collection(db, "farms"),
          where("ownerId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const farmsData = [];

        querySnapshot.forEach((doc) => {
          farmsData.push({ id: doc.id, ...doc.data() });
        });

        setFarms(farmsData);
      } catch (error) {
        console.error("Error fetching farms:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFarms();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <DashboardLayout role="farmer">
        <div className="text-xl font-semibold">Loading farms...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farmer">
      <h1 className="text-3xl font-bold mb-8">My Farms</h1>

      {farms.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          You haven't created any farms yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farms.map((farm) => {
            const progress =
              (farm.investedAmount / farm.fundingRequired) * 100;

            const isFunded =
              farm.investedAmount >= farm.fundingRequired;

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

                <p className="text-gray-600 mb-3">
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

                <p className="text-sm text-gray-700">
                  Invested: ${farm.investedAmount} (
                  {progress.toFixed(1)}%)
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    isFunded ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  Status: {isFunded ? "Funded" : "Open"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
