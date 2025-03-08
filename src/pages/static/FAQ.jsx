// src/pages/static/FAQ.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Categories
  const categories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'listings', name: 'Business Listings' },
    { id: 'connects', name: 'Connects & Messaging' },
    { id: 'payment', name: 'Payments & Billing' }
  ];

  // FAQ Data
  const faqData = {
    general: [
      {
        id: 'what-is-business-options',
        question: 'What is Business Options?',
        answer: 'Business Options is India\'s leading marketplace for buying, selling, and investing in businesses, franchises, startups, and digital assets. We connect entrepreneurs, investors, and business owners to help them find the right opportunities.'
      },
      {
        id: 'how-does-it-work',
        question: 'How does the platform work?',
        answer: 'Our platform works on a simple principle: we verify and list business opportunities, and you can browse, filter, and connect with the ones that interest you. After creating an account, you can either list your own business/opportunity or browse existing listings. When you find something interesting, you can use our secure messaging system to connect with the owner/investor.'
      },
      {
        id: 'is-it-free',
        question: 'Is it free to use Business Options?',
        answer: 'We offer both free and premium plans. You can browse listings for free, but connecting with business owners requires "connects" which are included in our subscription plans or can be purchased separately. Listing a business also comes with different pricing tiers depending on your needs.'
      }
    ],
    account: [
      {
        id: 'create-account',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Register" button in the top right corner of any page. You can sign up using your email, Google account, Facebook, or phone number. Follow the prompts to complete your profile for the best experience.'
      },
      {
        id: 'verify-account',
        question: 'Why should I verify my account?',
        answer: 'Verifying your account helps build trust with other users on the platform. Verified accounts receive more responses and are more likely to complete successful transactions. You can verify your email, phone number, and business documents for maximum credibility.'
      },
      {
        id: 'delete-account',
        question: 'How can I delete my account?',
        answer: 'To delete your account, go to Settings > Security > Danger Zone > Delete Account. Please note that this action is irreversible and will remove all your listings and messages from our platform.'
      }
    ],
    listings: [
      {
        id: 'create-listing',
        question: 'How do I create a business listing?',
        answer: 'To create a listing, log in to your account and go to the Dashboard. Click on "Add New Entity" and follow the step-by-step process. You\'ll need to provide details about your business, including financials, location, industry, and asking price.'
      },
      {
        id: 'listing-types',
        question: 'What types of listings can I create?',
        answer: 'You can create several types of listings: Business for Sale, Franchise Opportunity, Startup Seeking Investment, Investor Looking for Opportunities, and Digital Assets for Sale. Each type has specific fields relevant to that category.'
      },
      {
        id: 'verification',
        question: 'How are listings verified?',
        answer: 'Our team reviews each listing for authenticity and completeness. We may request additional documentation for higher-value listings. Verified listings receive a badge and are promoted more prominently in search results.'
      }
    ],
    connects: [
      {
        id: 'what-are-connects',
        question: 'What are connects and how do they work?',
        answer: 'Connects are our platform\'s currency for initiating conversations with business owners or investors. Each new conversation costs 1 connect. You receive connects with subscription plans and can also purchase them separately in bundles.'
      },
      {
        id: 'buy-connects',
        question: 'How do I buy connects?',
        answer: 'To purchase connects, go to Dashboard > Connects and select one of the available packages. You can pay using credit/debit cards, UPI, or net banking. Connects are valid for 12 months from the date of purchase.'
      },
      {
        id: 'messaging',
        question: 'How does the messaging system work?',
        answer: 'Our secure messaging system allows you to communicate directly with business owners or investors. Initial contact costs 1 connect, but all subsequent messages in that conversation are free. You can share documents, ask questions, and negotiate terms.'
      }
    ],
    payment: [
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards, UPI payments, net banking, and select digital wallets. All payments are processed securely through our payment partners with industry-standard encryption.'
      },
      {
        id: 'refund-policy',
        question: 'What is your refund policy?',
        answer: 'We offer refunds for subscription plans within 7 days of purchase if you haven\'t used any connects. Connect packages are non-refundable once purchased. Please contact our support team for specific refund requests.'
      },
      {
        id: 'subscription-plans',
        question: 'How do the subscription plans work?',
        answer: 'We offer four subscription tiers: Basic, Advanced, Premium, and Platinum. Each plan includes a certain number of connects, listing features, and other benefits. Plans are billed monthly or annually with significant savings on annual plans.'
      }
    ]
  };

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Filter questions based on search query
  const getFilteredQuestions = () => {
    if (!searchQuery.trim()) {
      return faqData[activeCategory] || [];
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    
    // Search across all categories
    return Object.values(faqData)
      .flat()
      .filter(item => 
        item.question.toLowerCase().includes(lowerCaseQuery) || 
        item.answer.toLowerCase().includes(lowerCaseQuery)
      );
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Find answers to common questions about using Business Options
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-indigo-300/30 rounded-md text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Search for questions..."
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Categories Navigation */}
          {!searchQuery && (
            <div className="mb-12 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions and Answers */}
          <div className="space-y-6">
            {searchQuery && filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any questions matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                {searchQuery ? (
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Search Results for "{searchQuery}"
                  </h2>
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                )}

                {filteredQuestions.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                      {expandedQuestions[item.id] ? (
                        <ChevronUp className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-indigo-600" />
                      )}
                    </button>
                    
                    {expandedQuestions[item.id] && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Still Have Questions */}
          <div className="mt-16 bg-indigo-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly team is here to help.
              Contact us for personalized assistance.
            </p>
            <Link
              to={APP_ROUTES.STATIC.CONTACT}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;