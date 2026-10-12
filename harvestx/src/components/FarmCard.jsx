function FarmCard({ farm, onInvest }) {
  return (
    <div className="card">
      <h3>{farm.crop} Farm</h3>
      <p>Farmer: {farm.farmer}</p>
      <p>Land Size: {farm.landSize}</p>
      <p>Yield History: {farm.yieldHistory}</p>
      <p>Funding Needed: ₹{farm.fundingNeeded}</p>
      <p>Profit Share: {farm.profitShare}</p>
      {onInvest && (
        <button onClick={() => onInvest(farm)}>
          Invest
        </button>
      )}
    </div>
  );
}

export default FarmCard;
