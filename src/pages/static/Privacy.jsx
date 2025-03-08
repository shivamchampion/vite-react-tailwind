// src/pages/static/Privacy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';
import { Shield, Lock, Eye, Users, Settings, FileText, Mail } from 'lucide-react';

function PrivacyPolicyPage() {
  // Last updated date
  const lastUpdated = "June 10, 2023";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-indigo-100">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Information We Collect", href: "#information-collection" },
              { icon: Eye, label: "How We Use Your Data", href: "#data-usage" },
              { icon: Lock, label: "Data Security", href: "#data-security" },
              { icon: Settings, label: "Your Privacy Controls", href: "#privacy-controls" },
              { icon: FileText, label: "Policy Updates", href: "#policy-updates" },
              { icon: Mail, label: "Contact Us", href: "#contact" }
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.href}
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <item.icon className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-indigo lg:prose-lg">
            <p>
              At Business Options, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg my-6">
              <p className="text-blue-800 font-medium">By using Business Options, you agree to the collection and use of information in accordance with this policy.</p>
            </div>

            <h2 id="information-collection">1. Information We Collect</h2>
            
            <h3>1.1 Personal Information</h3>
            <p>
              We may collect personally identifiable information, such as:
            </p>
            <ul>
              <li>Name, email address, phone number, and business details</li>
              <li>Billing information and transaction details</li>
              <li>User credentials (username and password)</li>
              <li>Business and investment preferences</li>
              <li>Profile information and photos</li>
            </ul>
            
            <h3>1.2 Non-Personal Information</h3>
            <p>
              We may also collect non-personal information, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address and device information</li>
              <li>Referring website</li>
              <li>Time spent on pages</li>
              <li>Geographic location (country/city level)</li>
            </ul>

            <h2 id="data-usage">2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing, operating, and maintaining our services</li>
              <li>Improving, personalizing, and expanding our services</li>
              <li>Understanding and analyzing how you use our services</li>
              <li>Developing new products, services, features, and functionality</li>
              <li>Processing transactions and sending related information</li>
              <li>Sending administrative messages, updates, and security alerts</li>
              <li>Responding to comments, questions, and requests</li>
              <li>Preventing fraudulent activities and enhancing security</li>
              <li>Marketing and promotional purposes (with your consent)</li>
            </ul>

            <h2 id="data-sharing">3. Information Sharing and Disclosure</h2>
            <p>
              We may share your information in the following situations:
            </p>
            <ul>
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
              <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction.</li>
            </ul>
            
            <div className="bg-yellow-50 p-4 rounded-lg my-6">
              <p className="text-yellow-800 font-medium">We do not sell your personal information to third parties for marketing purposes.</p>
            </div>

            <h2 id="data-security">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. 
              However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
            
            <p>
              Our security measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Secure authentication protocols</li>
              <li>Access controls and monitoring</li>
              <li>Regular backup procedures</li>
            </ul>

            <h2 id="privacy-controls">5. Your Privacy Rights and Controls</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> You can request correction of your personal information if it is inaccurate.</li>
              <li><strong>Deletion:</strong> You can request deletion of your personal information in certain circumstances.</li>
              <li><strong>Objection:</strong> You can object to our processing of your personal information.</li>
              <li><strong>Withdrawal of Consent:</strong> You can withdraw any consent you previously provided.</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format.</li>
            </ul>
            
            <p>
              To exercise these rights, please contact our Privacy Officer at privacy@businessoptions.in.
            </p>

            <h2 id="cookies">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            
            <p>
              We use the following types of cookies:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the operation of our website.</li>
              <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
              <li><strong>Functionality Cookies:</strong> Enable us to personalize content.</li>
              <li><strong>Targeting Cookies:</strong> Record your visit to our website, the pages you have visited, and the links you have followed.</li>
            </ul>
            
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>

            <h2 id="children">7. Children's Privacy</h2>
            <p>
              Our service is not directed to anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>

            <h2 id="international">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
            </p>
            
            <p>
              If you are located outside India and choose to provide information to us, please note that we transfer the data, including personal data, to India and process it there.
            </p>

            <h2 id="policy-updates">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
            </p>
            
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 id="contact">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: privacy@businessoptions.in</li>
              <li>By phone: +91 89765 43210</li>
              <li>By mail: Data Privacy Officer, Business Options, 123 Business Hub, 15th Floor, Lower Parel, Mumbai, 400013, India</li>
            </ul>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                By using Business Options, you consent to our Privacy Policy and agree to its terms. If you do not agree with this Policy, please do not use our service. This Privacy Policy works in conjunction with our{' '}
                <Link to={APP_ROUTES.STATIC.TERMS} className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;