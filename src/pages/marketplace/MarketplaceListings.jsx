import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Switch,
  Tabs,
  Tab,
  Tooltip
} from "@heroui/react";
import {
  MapPin,
  Star,
  Facebook,
  Twitter,
  Instagram,
  CheckCircle2,
  Search,
  Filter,
  TrendingUp,
  Store,
  Lightbulb,
  ArrowRight,
  Users,
  Globe,
  IndianRupee,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  Percent,
  Award,
  Building,
  ChevronRight,
  ChevronLeft,
  Lock
} from "lucide-react";

// Plan Colors for Chips
const planColors = {
  "Premium": "bg-yellow-100 text-yellow-800 border-yellow-500",
  "Featured": "bg-blue-100 text-blue-800 border-blue-500",
  "Standard": "bg-green-100 text-green-800 border-green-500",
  "Basic": "bg-gray-100 text-gray-800 border-gray-500"
};

// Entity Types
const entityTypes = [
  { id: 'business', label: 'Business', icon: <Building className="w-4 h-4" /> },
  { id: 'franchise', label: 'Franchise', icon: <Store className="w-4 h-4" /> },
  { id: 'startup', label: 'Startup', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'investor', label: 'Investor', icon: <Users className="w-4 h-4" /> },
  { id: 'digitalAsset', label: 'Digital Asset', icon: <Globe className="w-4 h-4" /> }
];

// Listing Card Component with fixed width and height
const ListingCard = ({ listingData }) => {
  return (
    <Card
      className="w-full border-b-2 border-b-[#0031AC] hover:shadow-lg transition-all duration-300 h-[460px]"
      radius="lg"
      shadow="sm"
    >
      <div className="relative">
        <img
          src={`https://picsum.photos/seed/${listingData.name.replace(/\s+/g, '')}/600/200`}
          alt={listingData.name}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://picsum.photos/600/200"; // Fallback
          }}
        />
        <Chip
          className={`${planColors[listingData.plan]} absolute top-3 right-3 font-medium text-xs`}
          size="sm"
          variant="flat"
        >
          {listingData.plan}
        </Chip>
      </div>

      <CardBody className="p-4 overflow-hidden">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-1">
              {listingData.entityType === "Business" && <Building className="w-4 h-4 text-gray-600" />}
              {listingData.entityType === "Franchise" && <Store className="w-4 h-4 text-gray-600" />}
              {listingData.entityType === "Startup" && <Lightbulb className="w-4 h-4 text-gray-600" />}
              {listingData.entityType === "Investor" && <Users className="w-4 h-4 text-gray-600" />}
              {listingData.entityType === "Digital Asset" && <Globe className="w-4 h-4 text-gray-600" />}
              <span className="text-xs text-gray-500 font-medium">{listingData.entityType}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-1 mt-1">{listingData.name}</h3>
            <p className="text-xs text-gray-500">{listingData.type}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-gray-800">{listingData.rating}/5</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span className="line-clamp-1">{listingData.location}</span>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{listingData.description}</p>

        <div className="flex justify-between items-center mb-3">
          <div className="bg-green-50 px-2 py-1 rounded flex items-center">
            <IndianRupee className="w-3.5 h-3.5 text-green-600 mr-1" />
            <p className="text-xs font-semibold text-green-700 whitespace-nowrap">{listingData.investment}</p>
          </div>

          {listingData.established && (
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              <span>Est. {listingData.established}</span>
            </div>
          )}
        </div>

        {listingData.industries && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listingData.industries.slice(0, 3).map((industry, index) => (
              <Chip
                key={index}
                className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs py-0.5 h-5 min-h-0"
                size="sm"
                variant="flat"
              >
                {industry}
              </Chip>
            ))}
            {listingData.industries.length > 3 && (
              <span className="text-xs text-gray-500 self-center">+{listingData.industries.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex flex-wrap text-xs gap-x-3 gap-y-1 mb-2">
          {listingData.financials && (
            <div className="flex items-center">
              <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
              <span className="text-gray-700">{listingData.financials}</span>
            </div>
          )}
          {listingData.additionalInfo?.roi && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 text-orange-500 mr-1" />
              <span className="text-gray-700">ROI: {listingData.additionalInfo.roi}</span>
            </div>
          )}
          {listingData.additionalInfo?.profitMargin && (
            <div className="flex items-center">
              <Percent className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-gray-700">Margin: {listingData.additionalInfo.profitMargin}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap text-xs gap-x-3 gap-y-1">
          {listingData.additionalInfo?.employees && (
            <div className="flex items-center">
              <Users className="w-3 h-3 text-indigo-500 mr-1" />
              <span className="text-gray-700">{listingData.additionalInfo.employees} staff</span>
            </div>
          )}
          {listingData.relocatable && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 text-purple-500 mr-1" />
              <span className="text-gray-700">Relocatable</span>
            </div>
          )}
          {listingData.homeBasedBusiness && (
            <div className="flex items-center">
              <Building className="w-3 h-3 text-teal-500 mr-1" />
              <span className="text-gray-700">Home-Based</span>
            </div>
          )}
          {listingData.exclusiveDeals && (
            <div className="flex items-center">
              <Award className="w-3 h-3 text-amber-500 mr-1" />
              <span className="text-gray-700">Exclusive</span>
            </div>
          )}
        </div>

        {/* Social Media Section */}
        {listingData.socialMedia && (
          <div className="flex gap-2 mt-3">
            {Object.entries(listingData.socialMedia).map(([platform, details]) => (
              <div
                key={platform}
                className={`flex-1 flex items-center gap-1 p-1 rounded-lg ${details.verified ? 'bg-blue-50' : 'bg-gray-50'}`}
              >
                {platform === "facebook" && <Facebook className={`w-3 h-3 ${details.verified ? 'text-blue-600' : 'text-gray-400'}`} />}
                {platform === "twitter" && <Twitter className={`w-3 h-3 ${details.verified ? 'text-blue-400' : 'text-gray-400'}`} />}
                {platform === "instagram" && <Instagram className={`w-3 h-3 ${details.verified ? 'text-pink-600' : 'text-gray-400'}`} />}
                {details.verified && <CheckCircle2 className="w-2 h-2 text-green-500 ml-auto" />}
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter className="bg-gray-50 p-3 absolute bottom-0 w-full">
        <Button
          className="w-full bg-[#0031AC] text-white hover:bg-[#002590] transition-all duration-200 py-1.5 text-sm"
        >
          Contact {listingData.entityType}
        </Button>
      </CardFooter>
    </Card>
  );
};

// CategoryPill Component
const CategoryPill = ({ category, selectedCategories, onToggleCategory, isFixedByRoute = false }) => {
  const isSelected = selectedCategories.includes(category.id);

  return (
    <Tooltip content={isFixedByRoute && isSelected ? "This filter is set by your current page" : ""} isDisabled={!(isFixedByRoute && isSelected)}>
      <Button
        size="sm"
        variant="flat"
        className={`${isSelected
            ? 'bg-[#0031AC] text-white hover:bg-[#002590]'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          } transition-all duration-200 ${isFixedByRoute && isSelected ? 'opacity-90' : ''}`}
        startContent={category.icon}
        endContent={isSelected && (isFixedByRoute ? <Lock className="w-3.5 h-3.5 ml-1" /> : <Check className="w-3.5 h-3.5 ml-1" />)}
        onClick={() => onToggleCategory(category.id)}
        isDisabled={isFixedByRoute && isSelected}
      >
        {category.label}
      </Button>
    </Tooltip>
  );
};

// Main MarketplaceListingsPage Component
const MarketplaceListingsPage = ({ type }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get entity type from URL if available, or from props
  const urlEntityType = params.type || '';

  // Map URL param to entity type format
  const mapUrlToEntityType = (urlType) => {
    if (!urlType) return '';

    // Make sure we handle all possible formats of the type
    const mapping = {
      'business': 'business',
      'franchise': 'franchise',
      'startup': 'startup',
      'investor': 'investor',
      'digital_asset': 'digitalAsset',
      'digital-asset': 'digitalAsset',
    };
    return mapping[urlType.toLowerCase()] || '';
  };

  // Get default selected category based on URL OR type prop
  const getDefaultSelectedCategories = () => {
    // First check if we have a type prop (this comes from the router)
    if (type) {
      const entityType = mapUrlToEntityType(type);
      return entityType ? [entityType] : [];
    }

    // Otherwise check URL params
    const entityType = mapUrlToEntityType(urlEntityType);
    return entityType ? [entityType] : [];
  };

  // Sample Listings Data - MOVED UP BEFORE ITS USAGE
  const allListings = [
    // Same sample data as before
    {
      id: 1,
      name: "Cloud Kitchen Network",
      type: "Franchise Opportunity",
      entityType: "Franchise",
      description: "Multi-brand cloud kitchen network with established delivery partnerships and central operations.",
      location: "Mumbai, Maharashtra",
      rating: 4.7,
      investment: "₹50 Lakh - ₹1 Crore",
      established: "2020",
      plan: "Premium",
      industries: ["Food & Beverage", "Technology", "Delivery"],
      financials: "₹1.5 Cr Annual Revenue",
      relocatable: true,
      homeBasedBusiness: false,
      exclusiveDeals: true,
      franchiseOpportunities: true,
      includingProperty: false,
      additionalInfo: {
        roi: "18-24 months",
        profitMargin: "25%",
        employees: "15-20"
      },
      socialMedia: {
        facebook: { name: "CloudKitchenFB", verified: true, link: "#" },
        twitter: { name: "@CloudKitchenTwitter", verified: true, link: "#" },
        instagram: { name: "@CloudKitchenInsta", verified: false, link: "#" }
      }
    },
    {
      id: 2,
      name: "Premium Café Chain",
      type: "Business for Sale",
      entityType: "Business",
      description: "Established café chain with 5 locations and strong brand presence in premium shopping malls.",
      location: "Delhi, NCR",
      rating: 4.5,
      investment: "₹2 Crore - ₹2.5 Crore",
      established: "2017",
      plan: "Featured",
      industries: ["Food & Beverage", "Retail", "Hospitality"],
      financials: "₹3.5 Cr Annual Revenue",
      relocatable: false,
      homeBasedBusiness: false,
      exclusiveDeals: false,
      franchiseOpportunities: false,
      includingProperty: true,
      additionalInfo: {
        roi: "2-3 years",
        profitMargin: "18%",
        employees: "30-40"
      },
      socialMedia: {
        facebook: { name: "PremiumCafeFB", verified: true, link: "#" },
        twitter: { name: "@PremiumCafeTwitter", verified: false, link: "#" },
        instagram: { name: "@PremiumCafeInsta", verified: true, link: "#" }
      }
    },
    // More listings...
    {
      id: 3,
      name: "EdTech Platform",
      type: "Startup Investment",
      entityType: "Startup",
      description: "Fast-growing education technology platform with 50,000+ active users and proprietary learning algorithms.",
      location: "Bangalore, Karnataka",
      rating: 4.8,
      investment: "₹75 Lakh - ₹1.5 Crore",
      established: "2021",
      plan: "Premium",
      industries: ["Education", "Technology", "SaaS"],
      financials: "₹80L Annual Revenue",
      relocatable: true,
      homeBasedBusiness: true,
      exclusiveDeals: true,
      franchiseOpportunities: false,
      includingProperty: false,
      additionalInfo: {
        roi: "3-4 years",
        profitMargin: "42%",
        employees: "10-15"
      },
      socialMedia: {
        facebook: { name: "EdTechFB", verified: true, link: "#" },
        twitter: { name: "@EdTechTwitter", verified: true, link: "#" },
        instagram: { name: "@EdTechInsta", verified: true, link: "#" }
      }
    },
    {
      id: 4,
      name: "Organic Food Marketplace",
      type: "Digital Asset",
      entityType: "Digital Asset",
      description: "Established online marketplace connecting organic farmers directly with consumers across major cities.",
      location: "Pune, Maharashtra",
      rating: 4.3,
      investment: "₹80 Lakh - ₹1.2 Crore",
      established: "2019",
      plan: "Standard",
      industries: ["Agriculture", "E-commerce", "Food & Beverage"],
      financials: "₹1.2 Cr Annual Revenue",
      relocatable: true,
      homeBasedBusiness: true,
      exclusiveDeals: false,
      franchiseOpportunities: false,
      includingProperty: false,
      additionalInfo: {
        roi: "8-12 months",
        profitMargin: "15%",
        employees: "5-10"
      },
      socialMedia: {
        facebook: { name: "OrganicFoodFB", verified: false, link: "#" },
        twitter: { name: "@OrganicFoodTwitter", verified: false, link: "#" },
        instagram: { name: "@OrganicFoodInsta", verified: true, link: "#" }
      }
    },
    {
      id: 5,
      name: "Boutique Hotel Chain",
      type: "Investment Opportunity",
      entityType: "Business",
      description: "Luxurious boutique hotel chain with properties in prime tourist destinations across India.",
      location: "Goa, India",
      rating: 4.9,
      investment: "₹5 Crore - ₹8 Crore",
      established: "2015",
      plan: "Premium",
      industries: ["Hospitality", "Tourism", "Real Estate"],
      financials: "₹6.8 Cr Annual Revenue",
      relocatable: false,
      homeBasedBusiness: false,
      exclusiveDeals: true,
      franchiseOpportunities: true,
      includingProperty: true,
      additionalInfo: {
        roi: "4-5 years",
        profitMargin: "32%",
        employees: "45-60"
      },
      socialMedia: {
        facebook: { name: "BoutiqueHotelFB", verified: true, link: "#" },
        twitter: { name: "@BoutiqueHotelTwitter", verified: true, link: "#" },
        instagram: { name: "@BoutiqueHotelInsta", verified: true, link: "#" }
      }
    },
    {
      id: 6,
      name: "EV Charging Network",
      type: "Franchise Opportunity",
      entityType: "Franchise",
      description: "Rapidly expanding electric vehicle charging station network with proprietary fast-charging technology.",
      location: "Multiple Locations, India",
      rating: 4.6,
      investment: "₹30 Lakh - ₹50 Lakh",
      established: "2022",
      plan: "Featured",
      industries: ["Automotive", "Technology", "Green Energy"],
      financials: "₹60L Annual Revenue per Station",
      relocatable: true,
      homeBasedBusiness: false,
      exclusiveDeals: false,
      franchiseOpportunities: true,
      includingProperty: false,
      additionalInfo: {
        roi: "18-30 months",
        profitMargin: "38%",
        employees: "3-5"
      },
      socialMedia: {
        facebook: { name: "EVChargingFB", verified: true, link: "#" },
        twitter: { name: "@EVChargingTwitter", verified: false, link: "#" },
        instagram: { name: "@EVChargingInsta", verified: true, link: "#" }
      }
    }
  ];

  // Initial Filter State
  const initialFilterState = {
    selectedCategories: getDefaultSelectedCategories(),
    industries: [],
    locations: [],
    investmentMin: '',
    investmentMax: '',
    investmentMinUnit: 'Lakh',
    investmentMaxUnit: 'Lakh',
    presetRange: '',
    profitMargin: '',
    roiPeriod: '',
    revenueRange: '',
    establishedYears: '',
    employeeCount: '',
    sellerType: '',
    relocatable: false,
    homeBasedBusiness: false,
    exclusiveDeals: false,
    franchiseOpportunities: false,
    includingProperty: false,
    sortBy: 'newest',
    search: ''
  };

  // State Hooks
  const [activeFilters, setActiveFilters] = useState(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    industries: true,
    locations: true,
    investmentRange: true,
    profitMargin: false,
    roiPeriod: false,
    revenueRange: false,
    establishedYears: false,
    employeeCount: false,
    sellerType: false,
    listingFeatures: false
  });

  // Store the fixed entity type from the route
  const [fixedEntityType, setFixedEntityType] = useState(
    type ? mapUrlToEntityType(type) : ''
  );

  // Update the fixed entity type if the type prop changes
  useEffect(() => {
    console.log('Type prop received:', type);
    const entityType = mapUrlToEntityType(type);
    console.log('Mapped to entity type:', entityType);
    setFixedEntityType(entityType);

    // If we have a valid entity type, make sure it's in the selected categories
    if (entityType) {
      setActiveFilters(prev => {
        // Check if it's already included
        if (prev.selectedCategories.includes(entityType)) {
          return prev; // No change needed
        }

        // Otherwise add it to the selected categories
        return {
          ...prev,
          selectedCategories: [entityType]
        };
      });
    }
  }, [type]);

  // Handle Screen Size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to the top of the listings section
    document.getElementById('listings-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if a category is fixed by the route
  const isCategoryFixedByRoute = (categoryId) => {
    return fixedEntityType && categoryId === fixedEntityType;
  };

  // Handle toggling a category, with special handling for fixed categories
  const handleToggleCategory = (categoryId) => {
    // If this category is fixed by the route, don't allow toggling it off
    if (isCategoryFixedByRoute(categoryId)) {
      return; // Do nothing - the category should stay selected
    }

    setActiveFilters(prev => {
      const currentCategories = [...prev.selectedCategories];
      const index = currentCategories.indexOf(categoryId);

      if (index === -1) {
        // Add the category
        currentCategories.push(categoryId);
      } else {
        // Remove the category
        currentCategories.splice(index, 1);
      }

      // Make sure the fixed category is still included if it exists
      if (fixedEntityType && !currentCategories.includes(fixedEntityType)) {
        currentCategories.push(fixedEntityType);
      }

      return {
        ...prev,
        selectedCategories: currentCategories
      };
    });
    setCurrentPage(1);
  };

  // Handle clearing all filters with special handling for fixed categories
  const handleClearAllFilters = () => {
    setActiveFilters(prev => {
      const newState = {
        ...initialFilterState,
        sortBy: prev.sortBy,
        search: prev.search
      };

      // If we have a fixed entity type, make sure it stays selected
      if (fixedEntityType) {
        newState.selectedCategories = [fixedEntityType];
      }

      return newState;
    });
    setCurrentPage(1);
  };

  // Handle removing a specific filter with special handling for fixed categories
  const handleRemoveFilter = (filterName, filterValue) => {
    if (filterName === 'clearAll') {
      handleClearAllFilters();
      return;
    }

    setActiveFilters(prev => {
      // Special handling for the selectedCategories array
      if (filterName === 'selectedCategories') {
        // If we're removing a fixed category, don't allow it
        if (filterValue === fixedEntityType) {
          return prev; // Return unchanged
        }

        // Otherwise remove the category normally
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(cat => cat !== filterValue)
        };
      }

      // For other array filters
      if (Array.isArray(prev[filterName]) && filterValue) {
        return {
          ...prev,
          [filterName]: prev[filterName].filter(value => value !== filterValue)
        };
      }

      // For scalar/boolean filters
      return {
        ...prev,
        [filterName]: typeof prev[filterName] === 'boolean' ? false : ''
      };
    });
    setCurrentPage(1);
  };

  // Filter Listings - unchanged except for logging
  const filterListings = useCallback(() => {
    console.log('Filtering with categories:', activeFilters.selectedCategories);

    return allListings.filter(listing => {
      // Search Filter
      if (activeFilters.search) {
        const searchTerm = activeFilters.search.toLowerCase();
        const searchFields = [
          listing.name,
          listing.description,
          listing.location,
          listing.type,
          ...(listing.industries || [])
        ];

        if (!searchFields.some(field =>
          field && field.toLowerCase().includes(searchTerm)
        )) {
          return false;
        }
      }

      // Category Filter
      if (activeFilters.selectedCategories.length > 0) {
        const categoryMapping = {
          business: 'Business',
          franchise: 'Franchise',
          startup: 'Startup',
          investor: 'Investor',
          digitalAsset: 'Digital Asset'
        };

        const selectedEntityTypes = activeFilters.selectedCategories
          .map(id => categoryMapping[id]);

        if (!selectedEntityTypes.includes(listing.entityType)) {
          return false;
        }
      }

      // Industry Filter
      if (activeFilters.industries.length > 0) {
        if (!listing.industries || !activeFilters.industries.some(industry =>
          listing.industries.includes(industry)
        )) {
          return false;
        }
      }

      // Location Filter
      if (activeFilters.locations.length > 0) {
        if (!listing.location || !activeFilters.locations.some(location =>
          listing.location.includes(location)
        )) {
          return false;
        }
      }

      // Investment Range Filter
      if (activeFilters.presetRange) {
        // This is a simplified version. In a real app, you'd parse the investment range properly
        const investmentText = listing.investment.toLowerCase();
        const range = activeFilters.presetRange;

        if (range === 'under10L' && (!investmentText.includes('lakh') || parseInt(investmentText.match(/\d+/)[0]) >= 10)) {
          return false;
        } else if (range === '10L-50L' && (!investmentText.includes('10 lakh') && !investmentText.includes('50 lakh'))) {
          return false;
        } else if (range === '50L-1Cr' && (!investmentText.includes('50 lakh') && !investmentText.includes('1 crore'))) {
          return false;
        } else if (range === '1Cr-3Cr' && (!investmentText.includes('1 crore') && !investmentText.includes('3 crore'))) {
          return false;
        } else if (range === '3Cr-5Cr' && (!investmentText.includes('3 crore') && !investmentText.includes('5 crore'))) {
          return false;
        } else if (range === '5Cr-10Cr' && (!investmentText.includes('5 crore') && !investmentText.includes('10 crore'))) {
          return false;
        } else if (range === 'over10Cr' && !investmentText.includes('crore')) {
          return false;
        }
      }

      // Profit Margin Filter
      if (activeFilters.profitMargin && listing.additionalInfo?.profitMargin) {
        const margin = parseInt(listing.additionalInfo.profitMargin.replace('%', ''));
        const filter = activeFilters.profitMargin;

        // Apply proper filtering based on the selected profit margin range
        if ((filter === 'under10' && margin >= 10) ||
          (filter === '10to20' && (margin < 10 || margin > 20)) ||
          (filter === '20to30' && (margin < 20 || margin > 30)) ||
          (filter === '30to40' && (margin < 30 || margin > 40)) ||
          (filter === 'over40' && margin <= 40)) {
          return false;
        }
      } else if (activeFilters.profitMargin) {
        return false;
      }

      // ROI Period Filter
      if (activeFilters.roiPeriod && listing.additionalInfo?.roi) {
        const roiText = listing.additionalInfo.roi.toLowerCase();
        const filter = activeFilters.roiPeriod;

        // More specific matching for ROI periods
        const monthsMatch = roiText.match(/(\d+)-?(\d+)?\s*(month|months|mo)/i);
        const yearsMatch = roiText.match(/(\d+)-?(\d+)?\s*(year|years|yr)/i);

        let roiMonths = 0;

        if (monthsMatch) {
          roiMonths = parseInt(monthsMatch[2] ? (parseInt(monthsMatch[1]) + parseInt(monthsMatch[2])) / 2 : monthsMatch[1]);
        } else if (yearsMatch) {
          roiMonths = parseInt(yearsMatch[2] ? (parseInt(yearsMatch[1]) + parseInt(yearsMatch[2])) / 2 : yearsMatch[1]) * 12;
        }

        if ((filter === 'under1year' && roiMonths >= 12) ||
          (filter === '1to2years' && (roiMonths < 12 || roiMonths > 24)) ||
          (filter === '2to3years' && (roiMonths < 24 || roiMonths > 36)) ||
          (filter === '3to5years' && (roiMonths < 36 || roiMonths > 60)) ||
          (filter === 'over5years' && roiMonths <= 60)) {
          return false;
        }
      } else if (activeFilters.roiPeriod) {
        return false;
      }

      // Established Years Filter
      if (activeFilters.establishedYears && listing.established) {
        const establishedYear = parseInt(listing.established);
        const currentYear = new Date().getFullYear();
        const yearsInBusiness = currentYear - establishedYear;
        const filter = activeFilters.establishedYears;

        if ((filter === 'lessThan2' && yearsInBusiness >= 2) ||
          (filter === '2to5' && (yearsInBusiness < 2 || yearsInBusiness > 5)) ||
          (filter === '5to10' && (yearsInBusiness < 5 || yearsInBusiness > 10)) ||
          (filter === 'over10' && yearsInBusiness <= 10)) {
          return false;
        }
      } else if (activeFilters.establishedYears) {
        return false;
      }

      // Boolean Filters
      const booleanFilters = [
        'relocatable',
        'homeBasedBusiness',
        'exclusiveDeals',
        'franchiseOpportunities',
        'includingProperty'
      ];

      for (let filter of booleanFilters) {
        if (activeFilters[filter] && !listing[filter]) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilters, allListings]);

  // Memoized Filtered Listings with Sorting
  const filteredListings = useMemo(() => {
    const filtered = filterListings();

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (activeFilters.sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (activeFilters.sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (activeFilters.sortBy === 'investmentLow') {
        return a.investment.localeCompare(b.investment);
      } else if (activeFilters.sortBy === 'investmentHigh') {
        return b.investment.localeCompare(a.investment);
      } else {
        // Default to newest (by ID in our case)
        return b.id - a.id;
      }
    });
  }, [filterListings, activeFilters.sortBy]);

  // Pagination settings and calculations
  const listingsPerPage = 6;
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  // Event Handlers
  const handleSearch = () => {
    setActiveFilters(prev => ({
      ...prev,
      search: searchInput
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  // These handlers are unchanged from the original component

  const handleToggleIndustry = (industry) => {
    setActiveFilters(prev => {
      const currentIndustries = [...prev.industries];
      const index = currentIndustries.indexOf(industry);

      if (index === -1) {
        currentIndustries.push(industry);
      } else {
        currentIndustries.splice(index, 1);
      }

      return {
        ...prev,
        industries: currentIndustries
      };
    });
    setCurrentPage(1);
  };

  const handleToggleLocation = (location) => {
    setActiveFilters(prev => {
      const currentLocations = [...prev.locations];
      const index = currentLocations.indexOf(location);

      if (index === -1) {
        currentLocations.push(location);
      } else {
        currentLocations.splice(index, 1);
      }

      return {
        ...prev,
        locations: currentLocations
      };
    });
    setCurrentPage(1);
  };

  const handleToggleAttribute = (attribute) => {
    setActiveFilters(prev => ({
      ...prev,
      [attribute]: !prev[attribute]
    }));
    setCurrentPage(1);
  };

  // Generate section title based on selected categories or URL
  const getSectionTitle = () => {
    if (activeFilters.selectedCategories.length === 1) {
      const categoryId = activeFilters.selectedCategories[0];
      const category = entityTypes.find(type => type.id === categoryId);
      if (category) {
        return `${category.label} Listings`;
      }
    }

    // Default title
    return "Marketplace Listings";
  };

  // Get entity icon for section header
  const getEntityIcon = () => {
    if (activeFilters.selectedCategories.length === 1) {
      const categoryId = activeFilters.selectedCategories[0];
      switch (categoryId) {
        case 'business': return Building;
        case 'franchise': return Store;
        case 'startup': return Lightbulb;
        case 'investor': return Users;
        case 'digitalAsset': return Globe;
        default: return Store;
      }
    }
    return Store;
  };

  // Get description for section header
  const getSectionDescription = () => {
    if (activeFilters.selectedCategories.length === 1) {
      const categoryId = activeFilters.selectedCategories[0];
      switch (categoryId) {
        case 'business':
          return "Explore verified and established businesses for sale across various industries";
        case 'franchise':
          return "Discover franchise opportunities with proven business models and support systems";
        case 'startup':
          return "Find innovative startups with growth potential across technology and other sectors";
        case 'investor':
          return "Connect with verified investors looking for opportunities across multiple industries";
        case 'digitalAsset':
          return "Browse digital assets including websites, apps, and online businesses for sale";
        default:
          return "Explore verified and promising opportunities across all sectors";
      }
    }
    return "Explore verified and promising opportunities across all sectors";
  };

  // Section Header Component
  const SectionHeader = ({ title, description, icon: Icon }) => (
    <div className="py-8 bg-gray-50">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-4">
            {Icon && <Icon className="w-8 h-8 text-[#0031AC]" />}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">{description}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search by name, location, industry, or keyword..."
                startContent={<Search className="w-5 h-5 text-gray-400" />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="bg-white border border-gray-300 text-gray-700"
                    endContent={<ChevronDown className="w-4 h-4" />}
                  >
                    Sort: {activeFilters.sortBy === 'newest' && 'Newest'}
                    {activeFilters.sortBy === 'alphabetical' && 'A-Z'}
                    {activeFilters.sortBy === 'rating' && 'Rating'}
                    {activeFilters.sortBy === 'investmentLow' && 'Investment (Low)'}
                    {activeFilters.sortBy === 'investmentHigh' && 'Investment (High)'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => handleFilterChange('sortBy', key.toString())}
                >
                  <DropdownItem key="newest">Newest</DropdownItem>
                  <DropdownItem key="alphabetical">Alphabetical (A-Z)</DropdownItem>
                  <DropdownItem key="rating">Rating (High to Low)</DropdownItem>
                  <DropdownItem key="investmentLow">Investment (Low to High)</DropdownItem>
                  <DropdownItem key="investmentHigh">Investment (High to Low)</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {!isDesktop && (
                <Button
                  variant="flat"
                  className="bg-indigo-100 text-indigo-800 border border-indigo-200"
                  startContent={<Filter className="w-4 h-4" />}
                  onClick={() => setShowMobileFilters(true)}
                >
                  Filters
                </Button>
              )}

              <Button
                className="bg-[#0031AC] text-white hover:bg-[#002590]"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {/* If we have a fixed entity type from URL, only show that entity type */}
            {fixedEntityType ? (
              // Only show the fixed category with the lock icon
              entityTypes
                .filter(entityType => entityType.id === fixedEntityType)
                .map(entityType => (
                  <CategoryPill
                    key={entityType.id}
                    category={entityType}
                    selectedCategories={activeFilters.selectedCategories}
                    onToggleCategory={handleToggleCategory}
                    isFixedByRoute={true}
                  />
                ))
            ) : (
              // On regular pages (no fixed type), show all category options
              <>
                <CategoryPill
                  category={{ id: 'all', label: 'All Categories', icon: null }}
                  selectedCategories={
                    activeFilters.selectedCategories.length === 0 ? ['all'] : []
                  }
                  onToggleCategory={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      selectedCategories: []
                    }));
                  }}
                  isFixedByRoute={false}
                />
                {entityTypes.map(entityType => (
                  <CategoryPill
                    key={entityType.id}
                    category={entityType}
                    selectedCategories={activeFilters.selectedCategories}
                    onToggleCategory={handleToggleCategory}
                    isFixedByRoute={false}
                  />
                ))}
              </>
            )}
          </div>

          {/* Selected Filters */}
          <SelectedFiltersBar
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            entityTypes={entityTypes}
            fixedEntityType={fixedEntityType}
          />
        </div>
      </div>
    </div>
  );

  // SelectedFiltersBar Component with fixed category support
  const SelectedFiltersBar = ({ activeFilters, onRemoveFilter, entityTypes, fixedEntityType }) => {
    // Helper function to get label for entity type ID
    const getEntityTypeLabel = (id) => {
      const entity = entityTypes.find(type => type.id === id);
      return entity ? entity.label : id;
    };

    // Generate filter chips
    const getFilterChips = () => {
      const chips = [];

      // Entity Types
      if (activeFilters.selectedCategories && activeFilters.selectedCategories.length) {
        activeFilters.selectedCategories.forEach(category => {
          const isFixed = category === fixedEntityType;
          chips.push({
            key: `category-${category}`,
            label: `Type: ${getEntityTypeLabel(category)}`,
            onRemove: () => onRemoveFilter('selectedCategories', category),
            isFixed: isFixed
          });
        });
      }

      // Industries
      if (activeFilters.industries && activeFilters.industries.length) {
        activeFilters.industries.forEach(industry => {
          chips.push({
            key: `industry-${industry}`,
            label: `Industry: ${industry}`,
            onRemove: () => onRemoveFilter('industries', industry),
            isFixed: false
          });
        });
      }

      // Locations
      if (activeFilters.locations && activeFilters.locations.length) {
        activeFilters.locations.forEach(location => {
          chips.push({
            key: `location-${location}`,
            label: `Location: ${location}`,
            onRemove: () => onRemoveFilter('locations', location),
            isFixed: false
          });
        });
      }

      // Preset Investment Range
      if (activeFilters.presetRange) {
        const ranges = {
          'under10L': 'Under ₹10 Lakh',
          '10L-50L': '₹10 Lakh - ₹50 Lakh',
          '50L-1Cr': '₹50 Lakh - ₹1 Crore',
          '1Cr-3Cr': '₹1 Crore - ₹3 Crore',
          '3Cr-5Cr': '₹3 Crore - ₹5 Crore',
          '5Cr-10Cr': '₹5 Crore - ₹10 Crore',
          'over10Cr': 'Over ₹10 Crore'
        };

        chips.push({
          key: 'investment-range',
          label: `Investment: ${ranges[activeFilters.presetRange] || activeFilters.presetRange}`,
          onRemove: () => {
            onRemoveFilter('presetRange');
            onRemoveFilter('investmentMin');
            onRemoveFilter('investmentMax');
            onRemoveFilter('investmentMinUnit');
            onRemoveFilter('investmentMaxUnit');
          },
          isFixed: false
        });
      }

      // Profit Margin
      if (activeFilters.profitMargin) {
        const margins = {
          'under10': 'Under 10%',
          '10to20': '10% - 20%',
          '20to30': '20% - 30%',
          '30to40': '30% - 40%',
          'over40': 'Over 40%'
        };

        chips.push({
          key: 'profit-margin',
          label: `Profit Margin: ${margins[activeFilters.profitMargin]}`,
          onRemove: () => onRemoveFilter('profitMargin'),
          isFixed: false
        });
      }

      // ROI Period
      if (activeFilters.roiPeriod) {
        const periods = {
          'under1year': 'Under 1 year',
          '1to2years': '1 - 2 years',
          '2to3years': '2 - 3 years',
          '3to5years': '3 - 5 years',
          'over5years': 'Over 5 years'
        };

        chips.push({
          key: 'roi-period',
          label: `ROI Period: ${periods[activeFilters.roiPeriod]}`,
          onRemove: () => onRemoveFilter('roiPeriod'),
          isFixed: false
        });
      }

      // Established Years
      if (activeFilters.establishedYears) {
        const years = {
          'lessThan2': 'Less than 2 years',
          '2to5': '2 - 5 years',
          '5to10': '5 - 10 years',
          'over10': 'Over 10 years'
        };

        chips.push({
          key: 'established-years',
          label: `Established: ${years[activeFilters.establishedYears]}`,
          onRemove: () => onRemoveFilter('establishedYears'),
          isFixed: false
        });
      }

      // Boolean attributes
      const booleanAttributes = [
        { key: 'relocatable', label: 'Relocatable' },
        { key: 'homeBasedBusiness', label: 'Home-Based' },
        { key: 'exclusiveDeals', label: 'Exclusive' },
        { key: 'franchiseOpportunities', label: 'Franchise Opportunity' },
        { key: 'includingProperty', label: 'Including Property' }
      ];

      booleanAttributes.forEach(attr => {
        if (activeFilters[attr.key]) {
          chips.push({
            key: attr.key,
            label: attr.label,
            onRemove: () => onRemoveFilter(attr.key),
            isFixed: false
          });
        }
      });

      return chips;
    };

    const filterChips = getFilterChips();

    if (filterChips.length === 0) return null;

    return (
      <div className="flex items-center flex-wrap gap-2 py-2">
        <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
        {filterChips.map(chip => (
          <Chip
            key={chip.key}
            onClose={chip.isFixed ? undefined : () => chip.onRemove()}
            variant="flat"
            className={`${chip.isFixed ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-50 text-indigo-800 border-indigo-200'}`}
            size="sm"
            endContent={chip.isFixed && <Lock className="w-3 h-3 text-indigo-600 ml-1" />}
          >
            {chip.label}
          </Chip>
        ))}
        <Button
          className="text-xs text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 border border-gray-200"
          variant="flat"
          size="sm"
          onClick={() => onRemoveFilter('clearAll')}
        >
          Clear All
        </Button>
      </div>
    );
  };

  // Define any missing filter components that were referenced
  const InvestmentRangePills = ({ selectedRange, onSelectRange }) => {
    // Sample implementation
    const ranges = [
      { id: 'under10L', label: 'Under ₹10L', min: '0', max: '10', minUnit: 'Lakh', maxUnit: 'Lakh' },
      { id: '10L-50L', label: '₹10L - ₹50L', min: '10', max: '50', minUnit: 'Lakh', maxUnit: 'Lakh' },
      { id: '50L-1Cr', label: '₹50L - ₹1Cr', min: '50', max: '1', minUnit: 'Lakh', maxUnit: 'Crore' },
      { id: '1Cr-3Cr', label: '₹1Cr - ₹3Cr', min: '1', max: '3', minUnit: 'Crore', maxUnit: 'Crore' },
      { id: '3Cr-5Cr', label: '₹3Cr - ₹5Cr', min: '3', max: '5', minUnit: 'Crore', maxUnit: 'Crore' },
      { id: '5Cr-10Cr', label: '₹5Cr - ₹10Cr', min: '5', max: '10', minUnit: 'Crore', maxUnit: 'Crore' },
      { id: 'over10Cr', label: 'Over ₹10Cr', min: '10', max: '', minUnit: 'Crore', maxUnit: '' }
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {ranges.map(range => (
          <Chip
            key={range.id}
            variant="flat"
            className={`${selectedRange === range.id ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            size="sm"
            onClick={() => onSelectRange(range)}
          >
            {range.label}
          </Chip>
        ))}
      </div>
    );
  };

  const IndustryFilter = ({ selectedIndustries, onToggleIndustry }) => {
    // Sample implementation
    const industries = [
      "Food & Beverage",
      "Technology",
      "Retail",
      "Hospitality",
      "Education",
      "Healthcare",
      "Real Estate",
      "Automotive",
      "Green Energy",
      "E-commerce"
    ];

    return (
      <div className="space-y-2">
        {industries.map(industry => (
          <div key={industry} className="flex items-center">
            <Checkbox
              checked={selectedIndustries.includes(industry)}
              onChange={() => onToggleIndustry(industry)}
              size="sm"
            />
            <span className="text-sm text-gray-700 ml-2">{industry}</span>
          </div>
        ))}
      </div>
    );
  };

  const LocationFilter = ({ selectedLocations, onToggleLocation }) => {
    // Sample implementation
    const locations = [
      "Mumbai, Maharashtra",
      "Delhi, NCR",
      "Bangalore, Karnataka",
      "Pune, Maharashtra",
      "Goa, India",
      "Multiple Locations, India"
    ];

    return (
      <div className="space-y-2">
        {locations.map(location => (
          <div key={location} className="flex items-center">
            <Checkbox
              checked={selectedLocations.includes(location)}
              onChange={() => onToggleLocation(location)}
              size="sm"
            />
            <span className="text-sm text-gray-700 ml-2">{location}</span>
          </div>
        ))}
      </div>
    );
  };

  const FilterSection = ({ title, children, isExpanded, onToggle }) => {
    return (
      <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <h4 className="font-medium text-gray-800">{title}</h4>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
        {isExpanded && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Now render the component with all the pieces
  return (
    <div className="min-h-screen bg-white">
      <SectionHeader
        title={getSectionTitle()}
        description={getSectionDescription()}
        icon={getEntityIcon()}
      />

      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 pb-12 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {isDesktop && (
            <div className="lg:w-1/4 xl:w-1/5 order-2 lg:order-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4">Refine Results</h3>

                {/* Investment Range */}
                <FilterSection
                  title="Investment Range"
                  isExpanded={expandedSections.investmentRange}
                  onToggle={() => toggleSection('investmentRange')}
                >
                  <InvestmentRangePills
                    selectedRange={activeFilters.presetRange}
                    onSelectRange={(range) => {
                      handleFilterChange('investmentMin', range.min);
                      handleFilterChange('investmentMax', range.max);
                      handleFilterChange('investmentMinUnit', range.minUnit);
                      handleFilterChange('investmentMaxUnit', range.maxUnit);
                      handleFilterChange('presetRange', range.id);
                    }}
                  />
                </FilterSection>

                {/* Industries */}
                <FilterSection
                  title="Industries"
                  isExpanded={expandedSections.industries}
                  onToggle={() => toggleSection('industries')}
                >
                  <IndustryFilter
                    selectedIndustries={activeFilters.industries}
                    onToggleIndustry={handleToggleIndustry}
                  />
                </FilterSection>

                {/* Locations */}
                <FilterSection
                  title="Locations"
                  isExpanded={expandedSections.locations}
                  onToggle={() => toggleSection('locations')}
                >
                  <LocationFilter
                    selectedLocations={activeFilters.locations}
                    onToggleLocation={handleToggleLocation}
                  />
                </FilterSection>

                {/* Additional filter sections can be added here */}
              </div>
            </div>
          )}

          {/* Main Listings Grid */}
          <div id="listings-section" className={`order-1 lg:order-2 ${isDesktop ? 'lg:w-3/4 xl:w-4/5' : 'w-full'}`}>
            {/* Listing count and pagination info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4 z-10 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-800 flex items-center">
                    <span className="text-indigo-600 font-bold mr-1.5">
                      {filteredListings.length}
                    </span>
                    {filteredListings.length === 1 ? 'Listing' : 'Listings'} Found
                  </h2>
                  {filteredListings.length > 0 && currentPage > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {Math.min(indexOfFirstListing + 1, filteredListings.length)} to {Math.min(indexOfLastListing, filteredListings.length)} of {filteredListings.length}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {filteredListings.length > 0 ? `Page ${currentPage} of ${totalPages}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
                {currentListings.map(listing => (
                  <ListingCard key={listing.id} listingData={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No listings found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria to find what you're looking for.
                  </p>
                  <Button
                    className="bg-[#0031AC] text-white hover:bg-[#002590]"
                    onClick={() => handleClearAllFilters()}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredListings.length > listingsPerPage && (
              <div className="flex justify-center items-center mt-8">
                <div className="flex gap-1">
                  <Button
                    variant="flat"
                    size="sm"
                    className="border border-gray-200 bg-white text-gray-700"
                    isDisabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="flat"
                        size="sm"
                        className="border bg-white text-gray-700"
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <Button
                          variant="flat"
                          size="sm"
                          className="border border-gray-200 bg-white text-gray-700"
                          isDisabled
                        >
                          ...
                        </Button>
                      )}
                    </>
                  )}

                  {/* Generate page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    // Only show pages near current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant="flat"
                          size="sm"
                          className={`border ${pageNumber === currentPage
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              : 'bg-white text-gray-700 border-gray-200'
                            }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    }

                    // Show ellipsis for breaks in page numbers
                    if (
                      (pageNumber === currentPage - 2 && pageNumber > 2) ||
                      (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
                    ) {
                      return (
                        <Button
                          key={`ellipsis-${pageNumber}`}
                          variant="flat"
                          size="sm"
                          className="border border-gray-200 bg-white text-gray-700"
                          isDisabled
                        >
                          ...
                        </Button>
                      );
                    }

                    return null;
                  })}

                  <Button
                    variant="flat"
                    size="sm"
                    className="border border-gray-200 bg-white text-gray-700"
                    isDisabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl flex flex-col animate-slideInRight">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button
                className="p-1 rounded-full bg-gray-100"
                size="sm"
                variant="flat"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Tabs
                selectedKey="filters"
                className="w-full"
                variant="underlined"
              >
                <Tab key="filters" title="Filters">
                  <div className="pt-4 space-y-4">
                    {/* Mobile filter sections */}
                    <FilterSection
                      title="Investment Range"
                      isExpanded={expandedSections.investmentRange}
                      onToggle={() => toggleSection('investmentRange')}
                    >
                      <InvestmentRangePills
                        selectedRange={activeFilters.presetRange}
                        onSelectRange={(range) => {
                          handleFilterChange('investmentMin', range.min);
                          handleFilterChange('investmentMax', range.max);
                          handleFilterChange('investmentMinUnit', range.minUnit);
                          handleFilterChange('investmentMaxUnit', range.maxUnit);
                          handleFilterChange('presetRange', range.id);
                        }}
                      />
                    </FilterSection>

                    <FilterSection
                      title="Industries"
                      isExpanded={expandedSections.industries}
                      onToggle={() => toggleSection('industries')}
                    >
                      <IndustryFilter
                        selectedIndustries={activeFilters.industries}
                        onToggleIndustry={handleToggleIndustry}
                      />
                    </FilterSection>

                    <FilterSection
                      title="Locations"
                      isExpanded={expandedSections.locations}
                      onToggle={() => toggleSection('locations')}
                    >
                      <LocationFilter
                        selectedLocations={activeFilters.locations}
                        onToggleLocation={handleToggleLocation}
                      />
                    </FilterSection>

                    {/* Additional mobile filter sections */}
                  </div>
                </Tab>
              </Tabs>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Button
                className="w-full bg-[#0031AC] text-white hover:bg-[#002590]"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters ({filteredListings.length} results)
              </Button>
              <Button
                className="w-full mt-2 bg-white border border-gray-300 text-gray-700"
                variant="flat"
                onClick={() => {
                  handleClearAllFilters();
                  setShowMobileFilters(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListingsPage;