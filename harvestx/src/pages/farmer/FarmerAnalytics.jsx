import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function FarmerAnalytics() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      const q = query(
        collection(db, "farms"),
        where("farmerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const farmList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFarms(farmList);
    };

    fetchFarms();
  }, [currentUser]);

  return (
    <DashboardLayout role="farmer">
      <h1 className="text-3xl font-bold mb-6">Revenue Analytics</h1>

      <div className="grid gap-6">
        {farms.map(farm => {
          const profit = (farm.totalRevenue || 0) - farm.fundingRequired;

          return (
            <div key={farm.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold">{farm.farmName}</h2>

              <p>Funding Required: ${farm.fundingRequired}</p>
              <p>Total Revenue: ${farm.totalRevenue || 0}</p>
              <p>Units Sold: {farm.actualQuantity - farm.availableQuantity || 0}</p>

              <p className="font-semibold mt-2">
                Profit: ${profit > 0 ? profit : 0}
              </p>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
