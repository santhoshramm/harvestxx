import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

function Earnings() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "investments"),
        where("investorId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      let results = [];

      for (let investmentDoc of snapshot.docs) {
        const investment = investmentDoc.data();

        const farmRef = doc(db, "farms", investment.farmId);
        const farmSnap = await getDoc(farmRef);

        if (farmSnap.exists()) {
          const farm = farmSnap.data();

          results.push({
            farmName: farm.farmName,
            investedAmount: investment.amount,
            totalRevenue: farm.totalRevenue || 0,
            status: farm.status
          });
        }
      }

      setFarms(results);
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Investments Overview
      </h1>

      {farms.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        farms.map((farm, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h2 className="font-semibold text-lg">
              {farm.farmName}
            </h2>

            <p>Invested: ${farm.investedAmount}</p>
            <p>Total Farm Revenue: ${farm.totalRevenue}</p>
            <p>Status: {farm.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Earnings;