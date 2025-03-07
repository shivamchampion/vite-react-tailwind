import { SocialIcon } from 'react-social-icons';
import { Phone } from 'lucide-react';

export const FacebookIcon = ({ className }) => <SocialIcon network="facebook" className={className} />;
export const TwitterIcon = ({ className }) => <SocialIcon network="twitter" className={className} />;
export const InstagramIcon = ({ className }) => <SocialIcon network="instagram" className={className} />;
export const LinkedInIcon = ({ className }) => <SocialIcon network="linkedin" className={className} />;
export const WhatsAppIcon = ({ className }) => <SocialIcon network="whatsapp" className={className} />;
export const EmailIcon = ({ className }) => <SocialIcon network="email" className={className} />;
export const GoogleIcon = ({ className }) => <SocialIcon network="google" className={className} />;
export const PhoneIcon = ({ className }) => <Phone className={className} />;

export default {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  EmailIcon,
  GoogleIcon,
  PhoneIcon,
};
