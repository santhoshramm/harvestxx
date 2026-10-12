function Navbar({ setRole }) {
  return (
    <div className="navbar">
      <h2>HarvestX</h2>
      <div>
        <button onClick={() => setRole("investor")}>Investor</button>
        <button onClick={() => setRole("farmer")}>Farmer</button>
        <button onClick={() => setRole("buyer")}>Buyer</button>
      </div>
    </div>
  );
}

export default Navbar;
