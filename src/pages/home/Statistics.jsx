import React from 'react';
import { Building, CheckCircle, Users, DollarSign } from "lucide-react";

/**
 * Statistics Component
 * Displays key platform statistics
 */
const Statistics = () => {
  const stats = [
    { label: "Businesses Listed", value: "12,500+", icon: <Building className="w-6 h-6 text-indigo-600" /> },
    { label: "Successful Deals", value: "3,700+", icon: <CheckCircle className="w-6 h-6 text-indigo-600" /> },
    { label: "Active Investors", value: "8,200+", icon: <Users className="w-6 h-6 text-indigo-600" /> },
    { label: "Total Investment", value: "₹2000+ Cr", icon: <DollarSign className="w-6 h-6 text-indigo-600" /> }
  ];

  return (
    <section className="py-12 bg-white border-t border-b border-gray-200">
      <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">{stat.value}</p>
              <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;