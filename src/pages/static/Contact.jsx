// src/pages/static/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Building } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiry: 'general'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData);
    // Show success message
    setSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiry: 'general'
      });
      setSubmitted(false);
    }, 5000);
  };

  // Office locations
  const officeLocations = [
    {
      city: 'Mumbai',
      address: '123 Business Park, Andheri East',
      phone: '+91 98765 43210',
      email: 'mumbai@businessoptions.in'
    },
    {
      city: 'Bangalore',
      address: '456 Tech Hub, Koramangala',
      phone: '+91 87654 32109',
      email: 'bangalore@businessoptions.in'
    },
    {
      city: 'Delhi',
      address: '789 Corporate Tower, Connaught Place',
      phone: '+91 76543 21098',
      email: 'delhi@businessoptions.in'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Have questions or need assistance? Our team is here to help you navigate 
            your business journey.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-6 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-800">Message Sent!</h3>
                      <p className="mt-2 text-green-700">
                        Thank you for contacting us. Our team will get back to you shortly.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Inquiry Type
                    </label>
                    <select
                      id="inquiry"
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="business">Business Listing Help</option>
                      <option value="investor">Investor Relations</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Headquarters</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Business Options HQ</p>
                      <p className="text-gray-600">123 Business Hub, 15th Floor</p>
                      <p className="text-gray-600">Lower Parel, Mumbai, 400013</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:info@businessoptions.in" className="text-indigo-600 hover:text-indigo-800">
                        info@businessoptions.in
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a href="tel:+918976543210" className="text-indigo-600 hover:text-indigo-800">
                        +91 89765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Regional Offices</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {officeLocations.map((office, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium text-indigo-600 mb-2">{office.city}</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">{office.address}</p>
                        <p className="text-gray-600">{office.phone}</p>
                        <p className="text-gray-600">{office.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Support</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Live Chat Support</p>
                      <p className="text-gray-600">Available Monday-Saturday, 9 AM - 7 PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Advisor Connect</p>
                      <p className="text-gray-600">Schedule a call with our business advisors</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Partner Support</p>
                      <p className="text-gray-600">Dedicated support for our business partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Google Maps Integration</p>
          <p className="text-sm">(This would be an actual map in production)</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;