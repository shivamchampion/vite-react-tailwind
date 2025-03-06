import React, { useState } from 'react';
import { Users, Plus, ArrowRight, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ConnectsPage Component
 * Page for managing and purchasing connects (messaging credits)
 */
function ConnectsPage() {
  const { userProfile } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Connect packages
  const connectPackages = [
    {
      id: 'basic',
      name: 'Basic',
      connects: 10,
      price: 499,
      perConnect: 49.9,
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      connects: 25,
      price: 999,
      perConnect: 39.96,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      connects: 60,
      price: 1999,
      perConnect: 33.32,
      popular: false
    }
  ];
  
  // Connect usage history (placeholder data)
  const connectHistory = [
    {
      id: 1,
      entityName: 'Coffee Shop for Sale',
      type: 'Business',
      date: '2023-05-15',
      connects: 1
    },
    {
      id: 2,
      entityName: 'Tech Startup Seeking Investment',
      type: 'Startup',
      date: '2023-05-10',
      connects: 1
    },
    {
      id: 3,
      entityName: 'E-commerce Website',
      type: 'Digital Asset',
      date: '2023-05-05',
      connects: 1
    }
  ];
  
  // Handle package selection
  const handleSelectPackage = (packageId) => {
    setSelectedPackage(packageId);
  };
  
  // Handle payment modal
  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };
  
  // Handle payment
  const handlePayment = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      
      // Reset after a delay
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
        setSelectedPackage(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Connects</h1>
        <p className="text-gray-600 mt-1">
          Manage your connects to contact businesses and investors
        </p>
      </header>
      
      {/* Current Connects Balance */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Available Connects</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-blue-600">{userProfile?.connectsBalance || 15}</span>
              <span className="ml-2 text-gray-500">connects remaining</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-4">
          <p className="text-sm text-blue-800">
            Connects are used to contact business owners, investors, and sellers. Each message costs 1 connect.
          </p>
        </div>
      </div>
      
      {/* Connect Packages */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Buy More Connects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {connectPackages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
              selectedPackage === pkg.id ? 'border-blue-500 shadow-md' : ''
            } ${pkg.popular ? 'relative' : ''}`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs uppercase font-bold">
                Popular
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">{pkg.name} Package</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹{pkg.price}</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>{pkg.connects} connects</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>₹{pkg.perConnect.toFixed(2)} per connect</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Valid for 12 months</span>
                </li>
              </ul>
              
              <button
                type="button"
                onClick={() => handleSelectPackage(pkg.id)}
                className={`w-full py-2 px-4 rounded-md ${
                  selectedPackage === pkg.id
                    ? 'bg-blue-600 text-white'
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Proceed Button */}
      {selectedPackage && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-medium">
                Selected: {connectPackages.find(pkg => pkg.id === selectedPackage)?.name} Package
              </h3>
              <p className="text-gray-600 mt-1">
                {connectPackages.find(pkg => pkg.id === selectedPackage)?.connects} connects for ₹{connectPackages.find(pkg => pkg.id === selectedPackage)?.price}
              </p>
            </div>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="mt-4 md:mt-0 bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 flex items-center"
            >
              Proceed to Payment
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      
      {/* Connects History */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Usage History</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        {connectHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connects Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connectHistory.map((history) => (
                  <tr key={history.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {history.entityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {history.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(history.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {history.connects}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No usage history yet.</p>
          </div>
        )}
      </div>
      
      {/* FAQ */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y">
          <div className="p-6">
            <h3 className="font-medium text-lg mb-2">What are connects?</h3>
            <p className="text-gray-600">
              Connects are credits that allow you to contact business owners, investors, and sellers on our platform. Each message sent costs 1 connect.
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-medium text-lg mb-2">How long are connects valid?</h3>
            <p className="text-gray-600">
              Connects are valid for 12 months from the date of purchase.
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-medium text-lg mb-2">Do I get connects with my subscription?</h3>
            <p className="text-gray-600">
              Yes, each subscription plan includes a certain number of connects every month. Basic plan includes 15 connects, Advanced includes 30 connects, Premium includes 60 connects, and Platinum includes 150 connects.
            </p>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {paymentSuccess ? (
                <div className="bg-white p-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 text-center">
                      Your connects have been added to your account.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Complete Your Purchase
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You are purchasing {connectPackages.find(pkg => pkg.id === selectedPackage)?.connects} connects for ₹{connectPackages.find(pkg => pkg.id === selectedPackage)?.price}.
                          </p>
                        </div>
                        
                        <div className="mt-4 border rounded-md p-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">Payment Method</span>
                            <div className="flex space-x-2">
                              <div className="h-6 w-10 bg-gray-200 rounded"></div>
                              <div className="h-6 w-10 bg-gray-200 rounded"></div>
                              <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowPaymentModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectsPage;