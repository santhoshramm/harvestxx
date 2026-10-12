function AgreementModal({ farm, close }) {
  const handleConfirm = () => {
    alert("Smart Contract Executed (Simulated via Blockchain)");
    close();
  };

  return (
    <div className="card">
      <h3>Investment Agreement</h3>
      <p>You are investing in {farm.crop} farm.</p>
      <p>Profit split: {farm.profitShare}</p>
      <button onClick={handleConfirm}>Confirm Investment</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
}

export default AgreementModal;
