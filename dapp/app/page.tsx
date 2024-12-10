import CallToAction from '@/components/CallToAction';
import Header from '@/components/Header';
import NewsAndOffers from '@/components/NewsAndOffers';
import TrendingProjects from '@/components/TrendingProjects';
import React from 'react';
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <TrendingProjects />
      <NewsAndOffers />
      <CallToAction />
    </div>
  );
}
