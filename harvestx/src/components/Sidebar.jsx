import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10 text-green-400">
        HarvestX
      </h2>

      {role === "farmer" && (
        <div className="space-y-4">
          <Link to="/dashboard" className="block hover:text-green-400">
            Dashboard
          </Link>
          <Link to="/create-farm" className="block hover:text-green-400">
            Create Farm
          </Link>
          <Link to="/my-farms" className="block hover:text-green-400">
            My Farms
          </Link>
          <Link to="/harvest" className="block hover:text-green-400">
            Harvest & Revenue
          </Link>
          <Link to="/farmer-analytics" className="block hover:text-green-400">
            Revenue Analytics
          </Link>


        </div>
      )}

      {role === "investor" && (
        <div className="space-y-4">
            <Link to="/dashboard" className="block hover:text-green-400">
            Dashboard
            </Link>
            <Link to="/browse-farms" className="block hover:text-green-400">
            Browse Farms
            </Link>
            <Link to="/my-investments" className="block hover:text-green-400">
            My Investments
            </Link>
            <Link to="/earnings" className="block hover:text-green-400">
              My Earnings
            </Link>

        </div>
      )}

      {role === "buyer" && (
        <div className="space-y-4">
          <Link to="/dashboard" className="block hover:text-green-400">
            Dashboard
          </Link>
          <Link to="/marketplace" className="block hover:text-green-400">
            Marketplace
          </Link>
          
        </div>
      )}
    </div>
  );
}
