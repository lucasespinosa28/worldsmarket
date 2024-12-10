import Image from 'next/image';

interface CardNFTProps {
  name: string;
  image: string;
  askPrice: number;
  createdAt: Date;
  endTime: Date;
}

export default function CardNFT({ name, image, askPrice, createdAt, endTime }: CardNFTProps) {
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
      <p className="text-gray-600 mb-2">Ask Price: {askPrice} ETH</p>
      <p className="text-sm text-gray-500 mb-1">Created: {createdAt.toLocaleDateString()}</p>
      <p className="text-sm text-gray-500">Ends: {endTime.toLocaleDateString()} {endTime.toLocaleTimeString()}</p>
    </div>
  );
}