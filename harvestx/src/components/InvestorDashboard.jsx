import { farms } from "../data/farms";
import FarmCard from "./FarmCard";
import { useState } from "react";
import AgreementModal from "./AgreementModal";

function InvestorDashboard() {
  const [selectedFarm, setSelectedFarm] = useState(null);

  return (
    <div>
      <h2 style={{ marginLeft: "15px" }}>Available Farms</h2>

      {farms.map(farm => (
        <FarmCard
          key={farm.id}
          farm={farm}
          onInvest={setSelectedFarm}
        />
      ))}

      {selectedFarm && (
        <AgreementModal
          farm={selectedFarm}
          close={() => setSelectedFarm(null)}
        />
      )}
    </div>
  );
}

export default InvestorDashboard;
