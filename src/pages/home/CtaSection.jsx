import React from 'react';
import { Button, Input } from "@heroui/react";

/**
 * CtaSection Component
 * Call to Action section to prompt user registration and newsletter subscription
 */
const CtaSection = () => (
  <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
    <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-indigo-200 max-w-2xl">
            Join thousands of entrepreneurs and investors connecting every day. 
            Register now to get full access to our business marketplace.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button 
              className="bg-white text-indigo-700 hover:bg-gray-100 transition-all duration-200 shadow-md px-6 font-medium"
              size="lg"
            >
              Register Now
            </Button>
            <Button 
              className="bg-transparent text-white border border-white hover:bg-white/10 transition-all duration-200 px-6 font-medium"
              variant="flat"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm w-full lg:w-auto">
          <h3 className="text-xl font-semibold mb-4">Get Early Access to New Listings</h3>
          <div className="flex gap-3 flex-col sm:flex-row">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="bg-white/20 text-white placeholder:text-white/70 border-white/30 focus:border-white"
            />
            <Button 
              className="bg-white text-indigo-700 hover:bg-gray-100 transition-all duration-200"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-indigo-200 mt-3">
            We'll send you a weekly digest of new high-potential opportunities
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;