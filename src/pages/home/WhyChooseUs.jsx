import React from 'react';
import FeatureCard from './FeatureCard';
import { Shield, Briefcase, BarChart3, Users } from "lucide-react";

const WhyChooseUs = () => (
  <section className="py-16 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
    <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We provide the most comprehensive marketplace for buying, selling, and investing in businesses across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Shield className="w-6 h-6 text-indigo-600" />}
          title="Verified Listings"
          description="Every business on our platform is thoroughly verified for authenticity and transparency"
        />
        <FeatureCard
          icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
          title="Extensive Network"
          description="Access to over 10,000+ businesses, franchises, and startups across 20+ industries"
        />
        <FeatureCard
          icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
          title="Market Intelligence"
          description="Get detailed analytics and market insights to make informed investment decisions"
        />
        <FeatureCard
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          title="Expert Advisors"
          description="Connect with skilled business advisors who can guide you through the entire process"
        />
      </div>
    </div>
  </section>
);

export default WhyChooseUs;