import React, { useState } from 'react';
import { Button } from "@heroui/react";
import toast from 'react-hot-toast';

const CtaSection = ({
  onRegisterClick,
  onLearnMoreClick
}) => {
  const [email, setEmail] = useState('');
  
  const handleNewsletterSubscribe = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Simulated newsletter subscription 
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };
  
  return (
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
                onClick={onRegisterClick}
              >
                Register Now
              </Button>
              <Button
                className="bg-transparent text-white border border-white hover:bg-white/10 transition-all duration-200 px-6 font-medium"
                variant="flat"
                size="lg"
                onClick={onLearnMoreClick}
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm w-full lg:w-auto">
            <h3 className="text-xl font-semibold mb-4">Get Early Access to New Listings</h3>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:outline-none cursor-text w-full"
              />
              <Button
                className="bg-white text-indigo-700 hover:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-white"
                onClick={handleNewsletterSubscribe}
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
};

export default CtaSection;