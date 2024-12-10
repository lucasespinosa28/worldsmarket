export default function Header() {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to WorldsMarket</h1>
      <p className="text-xl text-gray-600 mb-6">
        Your premier marketplace for smart contract NFTs and coins
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Smart Contracts</h2>
          <p>Buy and sell innovative smart contracts for various blockchain applications.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">NFTs</h2>
          <p>Explore unique digital assets and trade NFTs from top creators and collections.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Coins</h2>
          <p>Trade a wide range of cryptocurrencies and tokens with ease and security.</p>
        </div>
      </div>
    </header>
  );
}