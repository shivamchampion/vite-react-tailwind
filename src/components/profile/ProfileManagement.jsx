import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PhoneVerification from '../auth/PhoneVerification';
import toast from 'react-hot-toast';

const ProfileManagement = () => {
  const { userProfile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with existing profile data
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        location: userProfile.location || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPEG, PNG, or GIF.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }

      // Create preview and set file
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage({
          file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!profileData.displayName) {
        throw new Error('Display name is required');
      }

      // Prepare update data
      const updateData = {
        ...profileData
      };

      // Upload profile image if exists
      if (profileImage) {
        // In a real app, you'd upload to Firebase Storage
        updateData.photoURL = profileImage.preview;
      }

      // Update profile
      await updateProfile(updateData);

      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle phone verification completion
  const handlePhoneVerification = async (verifiedUser) => {
    try {
      // Update profile with verified phone number
      await updateProfile({
        phoneNumber: verifiedUser.phoneNumber
      });
      
      setShowPhoneVerification(false);
      toast.success('Phone number verified successfully');
    } catch (err) {
      toast.error('Failed to update phone number');
    }
  };

  // Render phone verification modal
  const renderPhoneVerification = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={() => setShowPhoneVerification(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <PhoneVerification 
          onVerificationComplete={handlePhoneVerification} 
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo Placeholder */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Profile Image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              {profileImage?.preview || userProfile?.photoURL ? (
                <img 
                  src={profileImage?.preview || userProfile.photoURL} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )}
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <Camera size={16} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 p-6">
        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-4">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={profileData.displayName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ) : (
              <p className="text-lg font-semibold">{profileData.displayName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            {editing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            ) : (
              <p className="text-gray-600">{profileData.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {editing ? (
              <div className="flex items-center">
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowPhoneVerification(true)}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            ) : (
              <p className="text-gray-600">{profileData.phoneNumber || 'Not verified'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            {editing ? (
              <input
                type="text"
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{profileData.location || 'Not specified'}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            {editing ? (
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={profileData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself"
              ></textarea>
            ) : (
              <p className="text-gray-600">{profileData.bio || 'No bio yet'}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-white ${
                    loading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Phone Verification Modal */}
      {showPhoneVerification && renderPhoneVerification()}
    </div>
  );
};

export default ProfileManagement;