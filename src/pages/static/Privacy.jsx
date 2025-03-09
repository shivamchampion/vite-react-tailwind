// src/pages/static/Privacy.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';
import { 
  ArrowUp, 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Settings, 
  FileText, 
  Mail,
  User,
  Database,
  Share2,
  Cookie,
  Clock,
  Calendar,
  MessageCircle,
  Globe,
  RefreshCw,
  AlertCircle,
  // Replace Child with Baby icon or other appropriate alternative
  Baby, // Alternative to Child
  X
} from 'lucide-react';

function PrivacyPolicyPage() {
  // Last updated date
  const lastUpdated = "June 10, 2023";
  const [activeSection, setActiveSection] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Table of contents sections
  const sections = [
    { id: "information-collection", title: "Information We Collect", icon: <Database className="w-4 h-4" /> },
    { id: "data-usage", title: "How We Use Your Information", icon: <Eye className="w-4 h-4" /> },
    { id: "data-sharing", title: "Information Sharing", icon: <Share2 className="w-4 h-4" /> },
    { id: "data-security", title: "Data Security", icon: <Lock className="w-4 h-4" /> },
    { id: "privacy-controls", title: "Your Privacy Rights", icon: <Settings className="w-4 h-4" /> },
    { id: "cookies", title: "Cookies & Tracking", icon: <Cookie className="w-4 h-4" /> },
    { id: "children", title: "Children's Privacy", icon: <Baby className="w-4 h-4" /> },
    { id: "international", title: "International Transfers", icon: <Globe className="w-4 h-4" /> },
    { id: "policy-updates", title: "Policy Updates", icon: <RefreshCw className="w-4 h-4" /> },
    { id: "contact", title: "Contact Us", icon: <MessageCircle className="w-4 h-4" /> },
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
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <div className="flex items-center text-indigo-100">
            <Calendar className="w-4 h-4 mr-2" />
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Quick Links - Top navigation cards */}
      <div className="py-8 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {sections.slice(0, 5).map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2 text-[#0031AC] group-hover:bg-[#0031AC] group-hover:text-white transition-colors">
                  {section.icon}
                </div>
                <span className="text-xs text-center font-medium text-gray-700 group-hover:text-[#0031AC]">
                  {section.title}
                </span>
              </button>
            ))}
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
                  <Link to={APP_ROUTES.STATIC.TERMS} className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0031AC]">
                    <FileText className="w-4 h-4 mr-3 text-indigo-500" />
                    Terms of Service
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
                  At Business Options, we are committed to protecting your privacy and ensuring the security of your personal information.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg my-6 border-l-4 border-blue-500">
                  <p className="text-blue-800 font-medium">By using Business Options, you agree to the collection and use of information in accordance with this policy.</p>
                </div>

                <section id="information-collection" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">1</span>
                    Information We Collect
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-[#0031AC] mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">We may collect personally identifiable information, such as:</p>
                      <ul className="space-y-2 text-sm text-gray-700 list-inside list-disc">
                        <li>Name, email address, phone number, and business details</li>
                        <li>Billing information and transaction details</li>
                        <li>User credentials (username and password)</li>
                        <li>Business and investment preferences</li>
                        <li>Profile information and photos</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-3">
                        <Database className="w-5 h-5 text-[#0031AC] mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Non-Personal Information</h3>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">We may also collect non-personal information, including:</p>
                      <ul className="space-y-2 text-sm text-gray-700 list-inside list-disc">
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>IP address and device information</li>
                        <li>Referring website</li>
                        <li>Time spent on pages</li>
                        <li>Geographic location (country/city level)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="data-usage" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">2</span>
                    How We Use Your Information
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">1</div>
                        <span className="font-medium">Providing Services</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Operating and maintaining our platform and services</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">2</div>
                        <span className="font-medium">Personalization</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Improving and customizing your experience</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">3</div>
                        <span className="font-medium">Analytics</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Understanding how you use our services</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">4</div>
                        <span className="font-medium">Product Development</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Creating new features and functionality</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">5</div>
                        <span className="font-medium">Transactions</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Processing payments and sending related information</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">6</div>
                        <span className="font-medium">Communications</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Sending updates, alerts, and responding to requests</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">7</div>
                        <span className="font-medium">Security</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Preventing fraud and enhancing platform security</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-[#0031AC]">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-xs font-semibold">8</div>
                        <span className="font-medium">Marketing</span>
                      </div>
                      <p className="ml-8 mt-1 text-sm text-gray-600">Promotional purposes (with your consent)</p>
                    </div>
                  </div>
                </section>

                <section id="data-sharing" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">3</span>
                    Information Sharing and Disclosure
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    We may share your information in the following situations:
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 border-l-4 border-indigo-200 bg-indigo-50 rounded-r-md">
                      <h4 className="text-indigo-900 font-medium mb-1">With Service Providers</h4>
                      <p className="text-sm text-indigo-800">We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-indigo-200 bg-indigo-50 rounded-r-md">
                      <h4 className="text-indigo-900 font-medium mb-1">Business Transfers</h4>
                      <p className="text-sm text-indigo-800">If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-indigo-200 bg-indigo-50 rounded-r-md">
                      <h4 className="text-indigo-900 font-medium mb-1">Legal Requirements</h4>
                      <p className="text-sm text-indigo-800">We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-indigo-200 bg-indigo-50 rounded-r-md">
                      <h4 className="text-indigo-900 font-medium mb-1">With Your Consent</h4>
                      <p className="text-sm text-indigo-800">We may share your information with your consent or at your direction.</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-6">
                    <p className="text-yellow-800 font-medium flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" /> 
                      We do not sell your personal information to third parties for marketing purposes.
                    </p>
                  </div>
                </section>

                <section id="data-security" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">4</span>
                    Data Security
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    We implement appropriate technical and organizational measures to protect the security of your personal information. 
                    However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
                  </p>
                  
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
                    <div className="bg-indigo-50 p-3 border-b border-indigo-100">
                      <h4 className="font-medium text-indigo-900">Our Security Measures Include:</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-gray-200">
                      <div className="bg-white p-4">
                        <div className="flex items-center text-[#0031AC] mb-2">
                          <Lock className="w-4 h-4 mr-2" />
                          <span className="font-medium text-sm">Data Encryption</span>
                        </div>
                        <p className="text-xs text-gray-600">Encryption of sensitive data in transit and at rest</p>
                      </div>
                      <div className="bg-white p-4">
                        <div className="flex items-center text-[#0031AC] mb-2">
                          <Shield className="w-4 h-4 mr-2" />
                          <span className="font-medium text-sm">Security Assessments</span>
                        </div>
                        <p className="text-xs text-gray-600">Regular security and vulnerability testing</p>
                      </div>
                      <div className="bg-white p-4">
                        <div className="flex items-center text-[#0031AC] mb-2">
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-medium text-sm">Authentication</span>
                        </div>
                        <p className="text-xs text-gray-600">Secure authentication protocols</p>
                      </div>
                      <div className="bg-white p-4">
                        <div className="flex items-center text-[#0031AC] mb-2">
                          <Settings className="w-4 h-4 mr-2" />
                          <span className="font-medium text-sm">Access Controls</span>
                        </div>
                        <p className="text-xs text-gray-600">Limited access and continuous monitoring</p>
                      </div>
                      <div className="bg-white p-4">
                        <div className="flex items-center text-[#0031AC] mb-2">
                          <Database className="w-4 h-4 mr-2" />
                          <span className="font-medium text-sm">Backup Procedures</span>
                        </div>
                        <p className="text-xs text-gray-600">Regular and secure data backups</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="privacy-controls" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">5</span>
                    Your Privacy Rights and Controls
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Access</h4>
                          <p className="text-sm text-gray-600 mt-1">You can request access to the personal information we hold about you.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Correction</h4>
                          <p className="text-sm text-gray-600 mt-1">You can request correction of your personal information if it is inaccurate.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <X className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Deletion</h4>
                          <p className="text-sm text-gray-600 mt-1">You can request deletion of your personal information in certain circumstances.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Objection</h4>
                          <p className="text-sm text-gray-600 mt-1">You can object to our processing of your personal information.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <ArrowUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Withdrawal of Consent</h4>
                          <p className="text-sm text-gray-600 mt-1">You can withdraw any consent you previously provided.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 flex-shrink-0">
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Data Portability</h4>
                          <p className="text-sm text-gray-600 mt-1">You can request a copy of your data in a structured, machine-readable format.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                    <Mail className="w-5 h-5 text-indigo-600 mr-3" />
                    <p className="text-indigo-800">
                      To exercise these rights, please contact our Privacy Officer at <a href="mailto:privacy@businessoptions.in" className="font-medium underline">privacy@businessoptions.in</a>.
                    </p>
                  </div>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">6</span>
                    Cookies and Tracking Technologies
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                    Cookies are files with a small amount of data that may include an anonymous unique identifier.
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Types of Cookies We Use:</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#0031AC] mt-1.5 mr-2"></div>
                        <div>
                        <h5 className="font-medium text-[#0031AC]">Essential Cookies</h5>
                          <p className="text-sm text-gray-600">Required for the operation of our website.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#0031AC] mt-1.5 mr-2"></div>
                        <div>
                          <h5 className="font-medium text-[#0031AC]">Analytical/Performance Cookies</h5>
                          <p className="text-sm text-gray-600">Allow us to recognize and count the number of visitors and see how visitors move around our website.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#0031AC] mt-1.5 mr-2"></div>
                        <div>
                          <h5 className="font-medium text-[#0031AC]">Functionality Cookies</h5>
                          <p className="text-sm text-gray-600">Enable us to personalize content and remember your preferences.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#0031AC] mt-1.5 mr-2"></div>
                        <div>
                          <h5 className="font-medium text-[#0031AC]">Targeting Cookies</h5>
                          <p className="text-sm text-gray-600">Record your visit to our website, the pages you have visited, and the links you have followed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-0">
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                  </p>
                </section>

                <section id="children" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">7</span>
                    Children's Privacy
                  </h2>
                  
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 flex items-start mb-4">
                    <Baby className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 mb-2">
                        Our service is not directed to anyone under the age of 18 ("Children").
                      </p>
                      <p className="text-sm text-blue-700">
                        We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="international" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">8</span>
                    International Data Transfers
                  </h2>
                  
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-4">
                    <div className="flex items-start mb-4">
                      <Globe className="w-5 h-5 text-[#0031AC] mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">
                        Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
                      </p>
                    </div>
                    
                    <div className="flex items-start pl-8">
                      <p className="text-gray-700 text-sm">
                        If you are located outside India and choose to provide information to us, please note that we transfer the data, including personal data, to India and process it there.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="policy-updates" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">9</span>
                    Changes to This Privacy Policy
                  </h2>
                  
                  <div className="flex items-start mb-4">
                    <RefreshCw className="w-5 h-5 text-gray-700 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 mb-2">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
                      </p>
                      <p className="text-gray-700 text-sm">
                        You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="flex items-center text-2xl font-bold text-gray-800 my-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-[#0031AC] mr-3 text-sm">10</span>
                    Contact Us
                  </h2>
                  
                  <div className="bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden mb-6">
                    <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                      <h4 className="font-medium text-indigo-900 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        If you have any questions or concerns about this Privacy Policy, please contact us:
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <a href="mailto:privacy@businessoptions.in" className="text-[#0031AC] font-medium">privacy@businessoptions.in</a>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-700 font-medium">+91 89765 43210</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Mail</p>
                          <p className="text-gray-700 text-sm">Data Privacy Officer, Business Options, 123 Business Hub, 15th Floor, Lower Parel, Mumbai, 400013, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Acceptance banner */}
                <div className="mt-12 p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                  <p className="text-indigo-800">
                    By using Business Options, you consent to our Privacy Policy and agree to its terms. If you do not agree with this Policy, please do not use our service. This Privacy Policy works in conjunction with our{' '}
                    <Link to={APP_ROUTES.STATIC.TERMS} className="text-[#0031AC] font-medium hover:underline">
                      Terms of Service
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

export default PrivacyPolicyPage;