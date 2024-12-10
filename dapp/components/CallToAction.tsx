import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Ready to dive in?</h2>
      <Link href="/collections" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
        Explore Marketplace
      </Link>
    </section>
  );
}