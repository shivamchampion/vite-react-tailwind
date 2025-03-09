// src/pages/static/Terms.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';
import { 
  ArrowUp, 
  Shield, 
  FileText, 
  User, 
  DollarSign, 
  BookOpen, 
  AlertTriangle, 
  Lock, 
  Calendar
} from 'lucide-react';

function TermsPage() {
  // Last updated date
  const lastUpdated = "May 15, 2023";
  const [activeSection, setActiveSection] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Table of contents sections
  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: <FileText className="w-4 h-4" /> },
    { id: "definitions", title: "Definitions", icon: <BookOpen className="w-4 h-4" /> },
    { id: "eligibility", title: "Eligibility", icon: <User className="w-4 h-4" /> },
    { id: "account", title: "Account Registration", icon: <Lock className="w-4 h-4" /> },
    { id: "conduct", title: "User Conduct", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "listings", title: "Listing & Verification", icon: <Shield className="w-4 h-4" /> },
    { id: "fees", title: "Fees and Payments", icon: <DollarSign className="w-4 h-4" /> },
  ];

  // Handle scroll event to update active section and show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll-to-top button
      setShowScrollTop(window.scrollY > 300);
      
      // Find current active section based on scroll position
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean);
      
      if (sectionElements.length > 0) {
        const currentSection = sectionElements.reduce((nearest, section) => {
          const distance = Math.abs(section.getBoundingClientRect().top - 100);
          return distance < Math.abs(nearest.getBoundingClientRect().top - 100) ? section : nearest;
        }, sectionElements[0]);
        
        setActiveSection(currentSection.id);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#0031AC] py-16 px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-white rounded-full -mr-16 -mb-16"></div>
          <div className="absolute left-0 top-0 w-64 h-64 bg-white rounded-full -ml-10 -mt-10"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center mb-4 text-indigo-200">
            <Link to={APP_ROUTES.HOME} className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Terms of Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <div className="flex items-center text-indigo-100">
            <Calendar className="w-4 h-4 mr-2" />
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content with sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Table of contents */}
          <aside className="md:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Table of Contents</h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                        activeSection === section.id
                          ? 'bg-indigo-50 text-[#0031AC] font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-3 text-indigo-500">{section.icon}</span>
                      <span className="text-sm">{section.title}</span>
                    </button>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-100 mt-4">
                  <Link to={APP_ROUTES.STATIC.PRIVACY} className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0031AC]">
                    <Shield className="w-4 h-4 mr-3 text-indigo-500" />
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="prose prose-indigo max-w-none">
                <p className="lead text-lg text-gray-600">
                  Welcome to Business Options. These Terms of Service govern your access to and use of our website, 
                  products, and services. Please read these Terms carefully before using our platform.
                </p>

                <section id="acceptance" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">1</span>
                    Acceptance of Terms
                  </h2>
                  <p>
                    By accessing or using Business Options, you agree to be bound by these Terms and our Privacy Policy. 
                    If you do not agree to these Terms, you may not access or use our services.
                  </p>
                </section>

                <section id="definitions" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">2</span>
                    Definitions
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <p className="flex items-start">
                      <span className="font-semibold mr-2 text-gray-900 min-w-[120px]">"Business Options,"</span>
                      <span className="text-gray-700">"we," "our," or "us" refers to the Business Options platform, its owners, and operators.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-semibold mr-2 text-gray-900 min-w-[120px]">"User,"</span>
                      <span className="text-gray-700">"you," or "your" refers to any individual or entity that accesses or uses our platform.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-semibold mr-2 text-gray-900 min-w-[120px]">"Platform"</span>
                      <span className="text-gray-700">refers to our website, applications, and services collectively.</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-semibold mr-2 text-gray-900 min-w-[120px]">"Content"</span>
                      <span className="text-gray-700">refers to any information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on our Platform.</span>
                    </p>
                  </div>
                </section>

                <section id="eligibility" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">3</span>
                    Eligibility
                  </h2>
                  <p>
                    To use our services, you must be at least 18 years old and capable of forming legally binding contracts. 
                    By using our Platform, you represent and warrant that you meet these requirements.
                  </p>
                </section>

                <section id="account" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">4</span>
                    Account Registration
                  </h2>
                  <p>
                    To access certain features of our Platform, you may be required to register for an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account.
                  </p>
                </section>

                <section id="conduct" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">5</span>
                    User Conduct
                  </h2>
                  <p>
                    You agree not to:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Violate any applicable laws or regulations
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Infringe upon the rights of others
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Post false, misleading, or fraudulent content
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Tamper with or access non-public areas
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Test the vulnerability of our systems
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Interfere with any user, host, or network
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Send unsolicited communications
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
                      <span className="font-medium">•</span> Impersonate any person or entity
                    </div>
                  </div>
                </section>

                <section id="listings" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">6</span>
                    Listing and Verification Policies
                  </h2>
                  <div className="flex gap-6 flex-col md:flex-row">
                    <div className="bg-indigo-50 p-4 rounded-lg flex-1">
                      <h4 className="font-medium text-indigo-900 mb-2">Accuracy</h4>
                      <p className="text-sm text-indigo-800">
                        Business Options strives to provide accurate and verified listings. However, we do not guarantee the accuracy, completeness, or reliability of any listings. You are responsible for conducting due diligence before engaging in any transaction.
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg flex-1">
                      <h4 className="font-medium text-indigo-900 mb-2">Verification</h4>
                      <p className="text-sm text-indigo-800">
                        All listings are subject to our verification process, which may include requesting additional documentation. 
                        We reserve the right to remove any listing that does not comply with our policies or appears fraudulent.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="fees" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">7</span>
                    Fees and Payment
                  </h2>
                  <p>
                    Certain services on our Platform require payment. By purchasing these services, you agree to pay all fees and charges associated with your account on the terms applicable at the time of purchase. All fees are non-refundable except as expressly provided in our Refund Policy.
                  </p>
                </section>

                <section id="intellectual" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">8</span>
                    Intellectual Property
                  </h2>
                  <p>
                    The Platform and its original content, features, and functionality are owned by Business Options and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Platform without our express written consent.
                  </p>
                </section>

                <section id="content" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">9</span>
                    User Content
                  </h2>
                  <p>
                    By posting Content on our Platform, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content for the purpose of providing our services. You represent and warrant that you have all rights necessary to grant these rights to us.
                  </p>
                </section>

                <section id="liability" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">10</span>
                    Limitation of Liability
                  </h2>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-gray-300">
                    <p className="text-sm uppercase font-semibold text-gray-500 mb-2">IMPORTANT NOTICE:</p>
                    <p className="font-medium text-gray-700">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUSINESS OPTIONS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                    </p>
                    <ol className="mt-3 space-y-2 list-decimal pl-5 text-gray-700">
                      <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE PLATFORM;</li>
                      <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM;</li>
                      <li>ANY CONTENT OBTAINED FROM THE PLATFORM; OR</li>
                      <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
                    </ol>
                  </div>
                </section>

                {/* More sections continued... */}
                <section id="indemnification" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">11</span>
                    Indemnification
                  </h2>
                  <p>
                    You agree to indemnify, defend, and hold harmless Business Options and its officers, directors, employees, agents, and successors from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Platform, your violation of these Terms, or your violation of any rights of another.
                  </p>
                </section>

                <section id="modifications" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">12</span>
                    Modifications to Terms
                  </h2>
                  <p>
                    We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by posting the revised Terms on our Platform. Your continued use of our Platform after such modifications will constitute your acknowledgment of the modified Terms.
                  </p>
                </section>

                <section id="termination" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">13</span>
                    Termination
                  </h2>
                  <p>
                    We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Platform, us, or third parties, or for any other reason.
                  </p>
                </section>

                <section id="governing-law" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">14</span>
                    Governing Law
                  </h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Platform shall be instituted exclusively in the courts located in Mumbai, India.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">15</span>
                    Contact Information
                  </h2>
                  <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
                    <p className="mb-3">
                      If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="flex flex-col md:flex-row md:gap-8">
                      <span className="font-medium text-[#0031AC]">Email: legal@businessoptions.in</span>
                      <span className="font-medium text-[#0031AC]">Address: 123 Business Hub, 15th Floor, Lower Parel, Mumbai, 400013</span>
                    </p>
                  </div>
                </section>

                {/* Acceptance banner */}
                <div className="mt-12 p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                  <p className="text-indigo-800">
                    By using Business Options, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{' '}
                    <Link to={APP_ROUTES.STATIC.PRIVACY} className="text-[#0031AC] font-medium hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#0031AC] text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default TermsPage;