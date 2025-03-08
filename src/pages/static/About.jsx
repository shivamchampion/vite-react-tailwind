// src/pages/static/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, ChevronRight, Award, Globe } from 'lucide-react';
import { APP_ROUTES } from '../../utils/constants';

function AboutPage() {
  // Team member data
  const teamMembers = [
    {
      name: 'Rahul Sharma',
      position: 'CEO & Founder',
      bio: 'Former investment banker with 15+ years of experience in business acquisitions.',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Priya Patel',
      position: 'COO',
      bio: 'Experienced operations leader with expertise in scaling marketplace platforms.',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Vikram Malhotra',
      position: 'CTO',
      bio: 'Tech veteran with multiple successful exits in the startup ecosystem.',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      name: 'Anjali Gupta',
      position: 'Head of Business Relations',
      bio: 'Former franchise consultant helping businesses scale across India.',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Business Options</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Connecting entrepreneurs, investors, and business opportunities across India
            to foster growth and create success stories.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to revolutionize how businesses are bought, sold, and invested in across India. 
              By creating a transparent and efficient marketplace, we help entrepreneurs find the right opportunities 
              and investors discover promising ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
            <div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">Our Story</h3>
              <p className="text-gray-700 mb-6">
                Business Options was founded in 2020 by a team of entrepreneurs and investment professionals 
                who experienced firsthand the challenges of buying and selling businesses in India.
              </p>
              <p className="text-gray-700 mb-6">
                What started as a small platform for local businesses has grown into India's leading 
                marketplace for business transactions, spanning across all major cities and industries.
              </p>
              <p className="text-gray-700">
                Today, we help thousands of entrepreneurs find their perfect business match every month, 
                facilitating over ₹500 crores in business transactions annually.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">Why Choose Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Award className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Verified Listings:</span> Every business on our platform undergoes thorough verification.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <Building className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Extensive Network:</span> Access to 10,000+ businesses across 20+ industries.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <Globe className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Pan-India Presence:</span> Opportunities from all major cities and regions.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Expert Advisors:</span> Connect with skilled business advisors who guide you through the process.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of entrepreneurs, investors, and industry experts passionate about 
              fostering business growth in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 mb-2">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join thousands of entrepreneurs and investors connecting every day on our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={APP_ROUTES.HOME} 
              className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Explore Opportunities
            </Link>
            <Link 
              to={APP_ROUTES.STATIC.CONTACT} 
              className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-indigo-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;