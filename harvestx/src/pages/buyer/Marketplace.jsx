import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Marketplace() {
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchFarms = async () => {
      const q = query(
        collection(db, "farms"),
        where("status", "==", "selling")
      );

      const snapshot = await getDocs(q);

      const farmList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFarms(farmList);
    };

    fetchFarms();
  }, []);

  const handleBuy = async (farm) => {
    const quantity = Number(quantities[farm.id]);

    if (!quantity || quantity <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (quantity > farm.availableQuantity) {
      alert("Not enough quantity available");
      return;
    }

    const totalAmount = quantity * farm.pricePerUnit;

    try {
      // 1️⃣ Create sale record
      await addDoc(collection(db, "sales"), {
        farmId: farm.id,
        buyerId: currentUser.uid,
        quantity,
        pricePerUnit: farm.pricePerUnit,
        totalAmount,
        createdAt: new Date(),
      });

      // 2️⃣ Update farm
      const newAvailable = farm.availableQuantity - quantity;
      const newRevenue = (farm.totalRevenue || 0) + totalAmount;

      await updateDoc(doc(db, "farms", farm.id), {
        availableQuantity: newAvailable,
        totalRevenue: newRevenue,
        status: newAvailable === 0 ? "sold" : "selling",
      });

      alert("Purchase successful!");
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <DashboardLayout role="buyer">
      <h1 className="text-3xl font-bold mb-6">Buyer Marketplace</h1>

      {farms.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          No products available for sale.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {farms.map(farm => (
          <div key={farm.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">{farm.farmName}</h2>

            <p>Crop: {farm.cropType}</p>
            <p>Price per unit: ${farm.pricePerUnit}</p>
            <p>Available quantity: {farm.availableQuantity}</p>

            <input
              type="number"
              placeholder="Enter quantity"
              className="border p-2 rounded w-full my-3"
              onChange={(e) =>
                setQuantities({
                  ...quantities,
                  [farm.id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => handleBuy(farm)}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
