import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role
      });

      setPage("login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Create Account
        </h2>

        <input
          className="w-full mb-4 p-2 border rounded-lg"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded-lg"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <select
          className="w-full mb-4 p-2 border rounded-lg"
          onChange={e => setRole(e.target.value)}
        >
          <option value="farmer">Farmer</option>
          <option value="investor">Investor</option>
          <option value="buyer">Buyer</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Register
        </button>

        <p
          onClick={() => setPage("login")}
          className="text-sm text-center text-green-600 mt-4 cursor-pointer"
        >
          Already have account?
        </p>
      </div>
    </div>
  );
}

export default Register;
