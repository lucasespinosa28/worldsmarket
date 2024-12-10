import Image from 'next/image';

interface CardSmartContractProps {
  image: string;
  name: string;
  balance: number;
  transactions: number;
  royalts:number;
}

export default function CardSmartContract({ image, name, balance, transactions,royalts }: CardSmartContractProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
     <div className="relative w-full pb-[100%] mb-4">
        <Image 
          src={image} 
          alt={name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded absolute top-0 left-0"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-1">Balance: {balance} ETH</p>
      <p className="text-sm text-gray-600 mb-1">royalts: {royalts} ETH</p>
      <p className="text-sm text-gray-600">Transactions: {transactions}</p>
    </div>
  );
}