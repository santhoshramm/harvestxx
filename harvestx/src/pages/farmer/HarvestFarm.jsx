import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function HarvestFarm() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});

  useEffect(() => {
    const fetchFarms = async () => {
      const q = query(
        collection(db, "farms"),
        where("farmerId", "==", currentUser.uid),
        where("status", "==", "funded")
      );

      const snapshot = await getDocs(q);

      const farmList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFarms(farmList);
    };

    fetchFarms();
  }, [currentUser]);

  const handleHarvest = async (farm) => {
    const actualQuantity = Number(quantityInputs[farm.id]);

    if (!actualQuantity || actualQuantity <= 0) {
      alert("Enter valid harvest quantity");
      return;
    }

    await updateDoc(doc(db, "farms", farm.id), {
      actualQuantity: actualQuantity,
      availableQuantity: actualQuantity,
      status: "selling",
    });

    alert("Harvest recorded. Farm is now live in marketplace!");
    window.location.reload();
  };

  return (
    <DashboardLayout role="farmer">
      <h1 className="text-3xl font-bold mb-6">Harvest Farms</h1>

      {farms.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          No funded farms ready for harvest.
        </div>
      )}

      <div className="grid gap-6">
        {farms.map((farm) => (
          <div key={farm.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-2">{farm.farmName}</h2>

            <p>Expected Quantity: {farm.expectedQuantity}</p>

            <input
              type="number"
              placeholder="Enter actual harvested quantity"
              className="border p-2 rounded w-full my-3"
              onChange={(e) =>
                setQuantityInputs({
                  ...quantityInputs,
                  [farm.id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => handleHarvest(farm)}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Confirm Harvest
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
