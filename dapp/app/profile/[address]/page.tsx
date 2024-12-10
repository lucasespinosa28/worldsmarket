interface PageProps {
  params: {
    address: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex flex-col items-center py-4 px-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-lg">
        Address: <span className="font-mono">{params.address}</span>
      </p>
    </div>
  );
}
