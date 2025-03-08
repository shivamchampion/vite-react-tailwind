import React from 'react';
import { Button } from "@heroui/react";
import { ArrowRight, ChevronRight } from "lucide-react";

const HowItWorks = ({ onGetStartedClick }) => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and complete your investor or business owner profile to get started"
    },
    {
      number: "02",
      title: "Explore Opportunities",
      description: "Browse through verified business listings and apply advanced filters to find matches"
    },
    {
      number: "03",
      title: "Connect Directly",
      description: "Contact business owners or investors directly through our secure platform"
    },
    {
      number: "04",
      title: "Complete the Deal",
      description: "Finalize your transaction with support from our network of business advisors"
    }
  ];

  return (
    <section className="py-16 bg-indigo-900 text-white">
      <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Our streamlined process makes buying, selling, or investing in businesses simpler than ever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-indigo-800 bg-opacity-50 rounded-xl p-6 h-full">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <span className="font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-indigo-200">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-indigo-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-white text-indigo-700 hover:bg-gray-100 transition-all duration-200 shadow-md px-6 py-3 font-medium"
            endContent={<ChevronRight className="w-4 h-4" />}
            onClick={onGetStartedClick}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;