// src/pages/static/Terms.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';

function TermsPage() {
  // Last updated date
  const lastUpdated = "May 15, 2023";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-indigo-100">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-indigo lg:prose-lg">
            <p>
              Welcome to Business Options. These Terms of Service ("Terms") govern your access to and use of our website, 
              products, and services. Please read these Terms carefully before using our platform.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Business Options, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, you may not access or use our services.
            </p>

            <h2>2. Definitions</h2>
            <p>
              <strong>"Business Options,"</strong> "we," "our," or "us" refers to the Business Options platform, its owners, and operators.
            </p>
            <p>
              <strong>"User,"</strong> "you," or "your" refers to any individual or entity that accesses or uses our platform.
            </p>
            <p>
              <strong>"Platform"</strong> refers to our website, applications, and services collectively.
            </p>
            <p>
              <strong>"Content"</strong> refers to any information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on our Platform.
            </p>

            <h2>3. Eligibility</h2>
            <p>
              To use our services, you must be at least 18 years old and capable of forming legally binding contracts. 
              By using our Platform, you represent and warrant that you meet these requirements.
            </p>

            <h2>4. Account Registration</h2>
            <p>
              To access certain features of our Platform, you may be required to register for an account. When registering, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account.
            </p>

            <h2>5. User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Attempt to access, tamper with, or use non-public areas of the Platform</li>
              <li>Probe, scan, or test the vulnerability of our systems</li>
              <li>Interfere with the access of any user, host, or network</li>
              <li>Send unsolicited communications, promotions, or advertisements</li>
              <li>Impersonate any person or entity</li>
            </ul>

            <h2>6. Listing and Verification Policies</h2>
            <p>
              Business Options strives to provide accurate and verified listings. However, we do not guarantee the accuracy, completeness, or reliability of any listings. You are responsible for conducting due diligence before engaging in any transaction.
            </p>
            <p>
              All listings are subject to our verification process, which may include requesting additional documentation. 
              We reserve the right to remove any listing that does not comply with our policies or appears fraudulent.
            </p>

            <h2>7. Fees and Payment</h2>
            <p>
              Certain services on our Platform require payment. By purchasing these services, you agree to pay all fees and charges associated with your account on the terms applicable at the time of purchase. All fees are non-refundable except as expressly provided in our Refund Policy.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by Business Options and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Platform without our express written consent.
            </p>

            <h2>9. User Content</h2>
            <p>
              By posting Content on our Platform, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content for the purpose of providing our services. You represent and warrant that you have all rights necessary to grant these rights to us.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUSINESS OPTIONS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ol>
              <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE PLATFORM;</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM;</li>
              <li>ANY CONTENT OBTAINED FROM THE PLATFORM; OR</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
            </ol>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Business Options and its officers, directors, employees, agents, and successors from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Platform, your violation of these Terms, or your violation of any rights of another.
            </p>

            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by posting the revised Terms on our Platform. Your continued use of our Platform after such modifications will constitute your acknowledgment of the modified Terms.
            </p>

            <h2>13. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Platform, us, or third parties, or for any other reason.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Platform shall be instituted exclusively in the courts located in Mumbai, India.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@businessoptions.in<br />
              Address: 123 Business Hub, 15th Floor, Lower Parel, Mumbai, 400013
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                By using Business Options, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{' '}
                <Link to={APP_ROUTES.STATIC.PRIVACY} className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;