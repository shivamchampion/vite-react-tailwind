import { Card, CardHeader, CardBody, CardFooter, Button, Divider } from "@heroui/react";
import { MapPin, Star, Facebook, Twitter, Instagram, CheckCircle2 } from "lucide-react";
import { Chip } from "@heroui/react";

const BusinessCard = () => {
  const businessData = {
    name: "Tech Innovations Pvt Ltd",
    type: "Technology Startup",
    location: "Bangalore, India",
    rating: "8.5 / 10",
    interests: "Expansion in AI and ML",
    investment: "₹50 Lakh - 2 Crore",
    industries: ["Technology", "Software", "AI/ML"],
    socialMedia: {
      facebook: { verified: true, link: "#" },
      twitter: { verified: false, link: "#" },
      instagram: { verified: true, link: "#" }
    }
  };

  return (
    <Card 
      className="max-w-[380px] border-t-4 border-t-blue-600 hover:shadow-lg transition-shadow duration-200"
      radius="lg"
      shadow="sm"
    >
      <CardHeader className="flex gap-4 pb-2">
        <img
          alt="Business Logo"
          className="w-14 h-14 rounded-lg border border-gray-200 p-1"
          src="/placeholder-logo.png"
        />
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-gray-800">{businessData.name}</p>
          <p className="text-sm text-gray-500">{businessData.type}</p>
        </div>
      </CardHeader>
      
      <CardBody className="py-3">
        <div className="space-y-5">
          {/* Location and Rating */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{businessData.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-800">{businessData.rating}</span>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Interests</p>
            <p className="text-sm font-medium text-gray-800 bg-blue-50 p-3 rounded-lg">
              {businessData.interests}
            </p>
          </div>

          {/* Investment Range */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Investment Range</p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-base font-semibold text-green-700">{businessData.investment}</p>
            </div>
          </div>

          {/* Industries */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Industries</p>
            <div className="flex flex-wrap gap-2">
              {businessData.industries.map((industry) => (
                <Chip
                  key={industry}
                  className="bg-blue-100 text-blue-800 font-medium"
                  size="sm"
                  variant="flat"
                >
                  {industry}
                </Chip>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3 pt-2">
            <Divider className="my-3" />
            <div className="space-y-2">
              {/* Facebook */}
              <div className={`flex items-center gap-3 p-2 rounded ${
                businessData.socialMedia.facebook.verified ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <Facebook className="w-5 h-5" />
                <span className="text-sm font-medium">Facebook</span>
                {businessData.socialMedia.facebook.verified && (
                  <CheckCircle2 className="w-4 h-4 ml-auto" />
                )}
              </div>

              {/* Twitter */}
              <div className={`flex items-center gap-3 p-2 rounded ${
                businessData.socialMedia.twitter.verified ? 'text-blue-400' : 'text-gray-400'
              }`}>
                <Twitter className="w-5 h-5" />
                <span className="text-sm font-medium">Twitter</span>
                {businessData.socialMedia.twitter.verified && (
                  <CheckCircle2 className="w-4 h-4 ml-auto" />
                )}
              </div>

              {/* Instagram */}
              <div className={`flex items-center gap-3 p-2 rounded ${
                businessData.socialMedia.instagram.verified ? 'text-pink-600' : 'text-gray-400'
              }`}>
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-medium">Instagram</span>
                {businessData.socialMedia.instagram.verified && (
                  <CheckCircle2 className="w-4 h-4 ml-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-2">
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          size="lg"
          radius="lg"
        >
          Contact Business
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessCard;
