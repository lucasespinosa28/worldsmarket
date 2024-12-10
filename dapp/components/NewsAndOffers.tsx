import CardNFT from "./CardNFT";
import CardSmartContract from "./CardSmartContract";

export default function NewsAndOffers() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Latest News & Offers</h2>
      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">New NFT Collection Launch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardNFT
              image="/placeholder.png"
              name="Cosmic Voyager #1"
              askPrice={0.5}
              createdAt={new Date('2023-06-01')}
              endTime={new Date('2023-06-08T23:59:59')}
            />
            <CardNFT
              image="/placeholder.png"
              name="Digital Dreamscape #42"
              askPrice={0.75}
              createdAt={new Date('2023-06-02')}
              endTime={new Date('2023-06-09T23:59:59')}
            />
            <CardNFT
              image="/placeholder.png"
              name="Neon Nightlife #7"
              askPrice={0.3}
              createdAt={new Date('2023-06-03')}
              endTime={new Date('2023-06-10T23:59:59')}
            />
            <CardNFT
              image="/placeholder.png"
              name="Ethereal Echo #23"
              askPrice={0.6}
              createdAt={new Date('2023-06-04')}
              endTime={new Date('2023-06-11T23:59:59')}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">New Contracts for Sellers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSmartContract
              image="/planet.png"
              name="AutoRoyalty"
              balance={10.5}
              transactions={1250}
              royalts={0.05}
            />
            <CardSmartContract
              image="/planet.png"
              name="MultiToken"
              balance={5.2}
              transactions={980}
              royalts={0.03}
            />
            <CardSmartContract
              image="/planet.png"
              name="SecureEscrow"
              balance={15.8}
              transactions={2100}
              royalts={0.04}
            />
            <CardSmartContract
              image="/planet.png"
              name="FlexibleMinting"
              balance={8.7}
              transactions={1500}
              royalts={0.02}
            />
          </div>
        </div>
      </div>
    </section>
  );
}