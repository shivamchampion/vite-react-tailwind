import React, { useRef } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Button, 
  Chip 
} from "@heroui/react";
import { 
  MapPin, 
  Star, 
  Facebook, 
  Twitter, 
  Instagram, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Store, 
  Lightbulb, 
  Users, 
  Globe, 
  Briefcase 
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Constants
const PLAN_COLORS = {
  "Premium": "bg-yellow-100 text-yellow-800 border-yellow-500",
  "Standard": "bg-blue-100 text-blue-800 border-blue-500",
  "Basic": "bg-green-100 text-green-800 border-green-500"
};

/**
 * Section Header Component
 * Displays the title and description of a carousel section
 */
const CategoryHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  accentColor = "#0031AC" 
}) => (
  <div className="text-center mb-16 max-w-4xl mx-auto">
    <div className="flex items-center justify-center mb-4">
      <div className={`h-1 w-12 mr-4`} style={{ backgroundColor: accentColor }}></div>
      <div className="flex items-center gap-2" style={{ color: accentColor }}>
        {Icon && <Icon className="w-6 h-6" />}
        <span className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className={`h-1 w-12 ml-4`} style={{ backgroundColor: accentColor }}></div>
    </div>
    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
      {description}
    </h2>
  </div>
);

/**
 * Opportunity Card Component
 * Displays details for a business, franchise, startup, or investment opportunity
 */
const OpportunityCard = ({ 
  itemData, 
  ctaText = "Contact Now" 
}) => {
  return (
    <Card 
      className="w-full max-w-[460px] mx-auto border-b-2 border-b-[#0031AC] hover:shadow-md transition-shadow duration-200" 
      radius="lg" 
      shadow="sm"
    >
      <CardHeader className="flex gap-4 pb-2">
        <img 
          alt={`${itemData.name} Logo`}
          className="w-16 h-16 rounded-lg border border-gray-200 p-1" 
          src={`https://picsum.photos/seed/${itemData.id}/200/200`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://picsum.photos/200/200";
          }}
        />
        <div className="flex flex-col items-start">
          <p className="text-lg font-semibold text-gray-800">{itemData.name}</p>
          <p className="text-sm text-gray-500">{itemData.type}</p>
          <Chip 
            className={`${PLAN_COLORS[itemData.plan]} font-medium px-3 py-1 rounded-md border`} 
            size="sm" 
            variant="flat"
          >
            {itemData.plan}
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="py-2">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{itemData.description}</p>
          
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium">{itemData.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-800">{itemData.rating}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Investment Range</p>
            <div className="bg-green-50 p-2 rounded-lg">
              <p className="text-base font-semibold text-green-700">{itemData.investment}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Industries</p>
            <div className="flex flex-wrap gap-2">
              {itemData.industries.map((industry) => (
                <Chip 
                  key={industry} 
                  className="bg-gray-100 text-gray-800 font-medium" 
                  size="sm" 
                  variant="flat"
                >
                  {industry}
                </Chip>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Social Media</p>
            <div className="flex gap-2">
              {Object.entries(itemData.socialMedia).map(([platform, details]) => (
                <div 
                  key={platform} 
                  className={`flex-1 flex items-center gap-2 p-2 rounded-lg ${details.verified ? 'bg-blue-50' : 'bg-gray-50'}`}
                >
                  {platform === "facebook" && (
                    <Facebook 
                      className={`w-4 h-4 ${details.verified ? 'text-blue-600' : 'text-gray-400'}`} 
                    />
                  )}
                  {platform === "twitter" && (
                    <Twitter 
                      className={`w-4 h-4 ${details.verified ? 'text-blue-400' : 'text-gray-400'}`} 
                    />
                  )}
                  {platform === "instagram" && (
                    <Instagram 
                      className={`w-4 h-4 ${details.verified ? 'text-pink-600' : 'text-gray-400'}`} 
                    />
                  )}
                  <span 
                    className={`text-xs ${details.verified ? 'text-gray-800' : 'text-gray-500'}`}
                  >
                    {details.name}
                  </span>
                  {details.verified && (
                    <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-2">
        <Button 
          className="w-full bg-gradient-to-r from-[#0031AC] to-[#0032AD] text-white font-medium py-3 hover:from-[#002A99] hover:to-[#002B9A] transition-all duration-200 shadow-md hover:shadow-lg" 
          size="lg" 
          radius="lg"
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Category Carousel Component
 * Displays a carousel of opportunities for a specific category (Business, Franchise, etc.)
 */
const CategoryCarousel = ({ 
  items, 
  categoryTitle, 
  categoryDescription, 
  icon: Icon, 
  accentColor,
  ctaText
}) => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const CustomCarouselNavigation = () => (
    <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
      <div className="w-full relative">
        <CarouselPrevious 
          className="pointer-events-auto absolute left-0 -translate-x-1/2 bg-white shadow-md hover:bg-gray-50 border border-gray-200" 
          variant="outline"
        />
        <CarouselNext 
          className="pointer-events-auto absolute right-0 translate-x-1/2 bg-white shadow-md hover:bg-gray-50 border border-gray-200" 
          variant="outline"
        />
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12">
        <CategoryHeader 
          title={categoryTitle}
          description={categoryDescription}
          icon={Icon}
          accentColor={accentColor}
        />

        <div className="relative">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              slidesToScroll: 1,
              loop: true,
            }}
          >
            <div className="relative">
              <CarouselContent className="flex">
                {items.map((item) => (
                  <CarouselItem 
                    key={item.id} 
                    className="basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pl-4"
                  >
                    <div className="h-full flex items-center justify-center">
                      <OpportunityCard 
                        itemData={item} 
                        ctaText={ctaText}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CustomCarouselNavigation />
            </div>
          </Carousel>

          <div className="md:hidden flex justify-center space-x-4 mt-6">
            <button 
              className="bg-white shadow-md hover:bg-gray-50 border border-gray-200 rounded-full p-2"
              onClick={() => {
                const api = document.querySelector('.embla__carousel')?.embla;
                if (api) api.scrollPrev();
              }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              className="bg-white shadow-md hover:bg-gray-50 border border-gray-200 rounded-full p-2"
              onClick={() => {
                const api = document.querySelector('.embla__carousel')?.embla;
                if (api) api.scrollNext();
              }}
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-b-4 border-blue-100 mt-16"></div>
    </section>
  );
};

/**
 * Generate sample data for each category
 * @param {number} count - Number of items to generate
 * @param {string} categoryType - Type of category (Business, Franchise, etc.)
 * @returns {Array} Array of sample opportunity data
 */
const generateCategoryData = (count, categoryType) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryType.toLowerCase()}-${i}`,
    name: `${categoryType} ${i + 1}`,
    type: `${categoryType} Opportunity`,
    plan: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Standard" : "Basic",
    description: `Innovative ${categoryType.toLowerCase()} transforming the business landscape with cutting-edge solutions and strategic vision.`,
    location: "Global Market",
    rating: "4.5",
    investment: "₹50 Lakh - 2 Crore",
    industries: ["Technology", "Innovation", "Growth"],
    socialMedia: {
      facebook: { name: "BusinessFB", verified: true },
      twitter: { name: "@businessTwitter", verified: false },
      instagram: { name: "@businessInsta", verified: true }
    }
  }));
};

/**
 * Category configuration for different opportunity types
 */
const CATEGORY_CONFIG = [
  {
    categoryTitle: "Businesses",
    categoryDescription: "Explore Diverse and Promising Business Opportunities",
    icon: Briefcase,
    accentColor: "#0031AC",
    ctaText: "Contact Business"
  },
  {
    categoryTitle: "Franchises",
    categoryDescription: "Explore Proven Business Models with Franchise Opportunities",
    icon: Store,
    accentColor: "#FF6B6B",
    ctaText: "Contact Franchise"
  },
  {
    categoryTitle: "Startups",
    categoryDescription: "Discover Innovative Startups Revolutionizing Industries",
    icon: Lightbulb,
    accentColor: "#4ECDC4",
    ctaText: "Contact Startup"
  },
  {
    categoryTitle: "Investors",
    categoryDescription: "Connect with Visionary Investors Driving Growth",
    icon: Users,
    accentColor: "#45B7D1",
    ctaText: "Send Proposal"
  },
  {
    categoryTitle: "Digital Assets",
    categoryDescription: "Unlock Potential in Cutting-Edge Digital Opportunities",
    icon: Globe,
    accentColor: "#FF8A5B",
    ctaText: "Explore Now"
  }
];

/**
 * MarketplaceCarousels Component
 * Main component that renders carousels for different categories of marketplace items
 */
const MarketplaceCarousels = () => {
  return (
    <>
      {CATEGORY_CONFIG.map((category, index) => (
        <CategoryCarousel 
          key={index}
          items={generateCategoryData(12, category.categoryTitle)}
          categoryTitle={category.categoryTitle}
          categoryDescription={category.categoryDescription}
          icon={category.icon}
          accentColor={category.accentColor}
          ctaText={category.ctaText}
        />
      ))}
    </>
  );
};

export default MarketplaceCarousels;