import React, { useState, useEffect } from 'react';
import { Button, Select, SelectItem } from "@heroui/react";
import { Search, MapPin, Building, TrendingUp, Lightbulb, Users, Globe, Filter, ChevronRight, Info, X, ArrowRight } from "lucide-react";

function SearchSection() {
  const [activeTab, setActiveTab] = useState("businesses");
  const [activeFilter, setActiveFilter] = useState("category");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedMinInvestment, setSelectedMinInvestment] = useState("");
  const [selectedMaxInvestment, setSelectedMaxInvestment] = useState("");
  const [screenSize, setScreenSize] = useState("large");
  
  // Check viewport size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 480) {
        setScreenSize("xsmall");
      } else if (window.innerWidth < 768) {
        setScreenSize("small");
      } else if (window.innerWidth < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Enhanced filter options
  const industries = [
    "Technology", "Food & Beverage", "Real Estate", "Healthcare", 
    "Education", "Retail", "Manufacturing", "Financial Services", 
    "Entertainment", "Hospitality", "Agriculture", "Logistics"
  ];
  
  const sectors = ["B2B", "B2C", "D2C", "SaaS", "E-commerce", "Fintech", "Edtech", "Healthtech", "Marketplace"];
  
  const states = [
    "Maharashtra", "Karnataka", "Delhi", "Telangana", "Tamil Nadu", 
    "Gujarat", "Uttar Pradesh", "Haryana", "West Bengal", "Rajasthan"
  ];
  
  const investmentRanges = [
    "Below ₹10 Lakh", "₹10-50 Lakh", "₹50 Lakh-1 Crore", 
    "₹1-5 Crore", "₹5-10 Crore", "Above ₹10 Crore"
  ];
  
  function handleTabChange(key) {
    setActiveTab(key);
  }
  
  function handleFilterChange(filterType) {
    setActiveFilter(filterType);
  }
  
  function clearAllFilters() {
    setSelectedIndustry("");
    setSelectedSector("");
    setSelectedState("");
    setSelectedMinInvestment("");
    setSelectedMaxInvestment("");
  }

  // Get count of active filters per section
  const getCategoryFilterCount = () => {
    return (selectedIndustry ? 1 : 0) + (selectedSector ? 1 : 0);
  };
  
  const getLocationFilterCount = () => {
    return (selectedState ? 1 : 0);
  };
  
  const getInvestmentFilterCount = () => {
    return (selectedMinInvestment ? 1 : 0) + (selectedMaxInvestment ? 1 : 0);
  };
  
  // Vertical tab component for small screens
  function VerticalTab({ title, icon, isActive, onClick }) {
    return (
      <button
        onClick={onClick}
        aria-selected={isActive}
        role="tab"
        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-300 text-sm w-full text-left ${
          isActive 
            ? 'bg-white text-indigo-700 border-l-4 border-indigo-700 shadow-sm' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
        }`}
      >
        {icon}
        <span>{title}</span>
      </button>
    );
  }
  
  // Horizontal tab component for larger screens
  function HorizontalTab({ title, icon, isActive, onClick }) {
    return (
      <button
        onClick={onClick}
        aria-selected={isActive}
        role="tab"
        className={`flex items-center gap-2 px-5 py-4 font-medium transition-all duration-300 text-sm whitespace-nowrap ${
          isActive 
            ? 'bg-white text-indigo-700 border-t-2 border-indigo-700 rounded-t-lg shadow-sm' 
            : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
        }`}
      >
        <span className="flex items-center justify-center w-8 h-8 bg-opacity-10 rounded-full mr-2">
          {icon}
        </span>
        <span>{title}</span>
      </button>
    );
  }
  
  
  // Filter tab for side filters
  function FilterTab({ title, count, isActive, onClick }) {
    return (
      <button 
        className={`relative px-4 py-3 font-medium text-sm transition-colors w-full text-left ${
          isActive ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600'
        }`}
        onClick={onClick}
      >
        {title}
        {count > 0 && 
          <span className="absolute top-1 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
            {count}
          </span>
        }
      </button>
    );
  }
  
  // Render active filters summary
  function renderActiveFiltersSummary() {
    const activeFilters = [];
    
    if (selectedIndustry) activeFilters.push(`Industry: ${selectedIndustry}`);
    if (selectedSector) activeFilters.push(`Sector: ${selectedSector}`);
    if (selectedState) activeFilters.push(`State: ${selectedState}`);
    if (selectedMinInvestment) activeFilters.push(`Min: ${selectedMinInvestment}`);
    if (selectedMaxInvestment) activeFilters.push(`Max: ${selectedMaxInvestment}`);
    
    if (activeFilters.length === 0) return null;
    
    return (
      <div className="mb-4 flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
            {filter}
            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={clearAllFilters} />
          </div>
        ))}
      </div>
    );
  }
  
  // Improved filter content with better mobile adaptability
  function renderActiveFilter() {
    switch(activeFilter) {
      case 'category':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md border border-indigo-100">
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Category filters</span> help you find opportunities by industry and sector type</p>
              <p className="text-xs text-indigo-600">Start with an industry and then narrow down to a specific sector</p>
            </div>
            {renderActiveFiltersSummary()}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <Select 
                  placeholder="Select Industry"
                  className="w-full"
                  size="sm"
                  value={selectedIndustry}
                  onChange={(e) => {
                    setSelectedIndustry(e.target.value);
                    if (e.target.value === "") {
                      setSelectedSector("");
                    }
                  }}
                >
                  <SelectItem value="">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <Select 
                  placeholder="Select Sector"
                  className="w-full"
                  size="sm"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  disabled={!selectedIndustry}
                >
                  <SelectItem value="">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </Select>
                {!selectedIndustry && 
                  <p className="text-xs text-orange-500 mt-1">Select an industry first</p>
                }
              </div>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md border border-indigo-100">
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Location filters</span> help you find opportunities in specific geographical areas</p>
              <p className="text-xs text-indigo-600">Combine with industry filters for more targeted results</p>
            </div>
            {renderActiveFiltersSummary()}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <Select 
                  placeholder="Select State"
                  className="w-full"
                  size="sm"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <SelectItem value="">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <Select 
                  placeholder="Select Industry"
                  className="w-full"
                  size="sm"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <SelectItem value="">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 'investment':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md border border-indigo-100">
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Investment filters</span> help you find opportunities matching your budget</p>
              <p className="text-xs text-indigo-600">Set both minimum and maximum values for the best results</p>
            </div>
            {renderActiveFiltersSummary()}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Investment</label>
                <Select 
                  placeholder="Select Min"
                  className="w-full"
                  size="sm"
                  value={selectedMinInvestment}
                  onChange={(e) => {
                    setSelectedMinInvestment(e.target.value);
                    // Reset max if min is higher than max
                    if (e.target.value && selectedMaxInvestment && 
                        investmentRanges.indexOf(e.target.value) > investmentRanges.indexOf(selectedMaxInvestment)) {
                      setSelectedMaxInvestment("");
                    }
                  }}
                >
                  <SelectItem value="">No Minimum</SelectItem>
                  {investmentRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Investment</label>
                <Select 
                  placeholder="Select Max"
                  className="w-full"
                  size="sm"
                  value={selectedMaxInvestment}
                  onChange={(e) => setSelectedMaxInvestment(e.target.value)}
                  disabled={!selectedMinInvestment}
                >
                  <SelectItem value="">No Maximum</SelectItem>
                  {selectedMinInvestment ? 
                    investmentRanges
                      .filter((_, index) => index >= investmentRanges.indexOf(selectedMinInvestment))
                      .map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))
                    : 
                    investmentRanges.map((range) => (
                      <SelectItem key={range} value={range} disabled>
                        {range}
                      </SelectItem>
                    ))
                  }
                </Select>
                {!selectedMinInvestment && 
                  <p className="text-xs text-orange-500 mt-1">Select min investment first</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <Select 
                  placeholder="Select Industry"
                  className="w-full"
                  size="sm"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <SelectItem value="">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }
  
  // Enhanced tab icons with consistent styling
  const tabIcons = {
    businesses: <Building className="w-5 h-5 text-indigo-600" />,
    franchises: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    startups: <Lightbulb className="w-5 h-5 text-indigo-600" />,
    investors: <Users className="w-5 h-5 text-indigo-600" />,
    digitalAssets: <Globe className="w-5 h-5 text-indigo-600" />
  };

  // Full tab labels
  const tabLabels = {
    businesses: "Businesses for Sale",
    franchises: "Franchise Opportunities",
    startups: "Startups",
    investors: "Investors",
    digitalAssets: "Digital Assets"
  };
  
  // Render the side filter tabs
  function renderFilterTabs() {
    return (
      <div className="flex sm:hidden mb-4">
        <FilterTab 
          title="Category" 
          count={getCategoryFilterCount()} 
          isActive={activeFilter === 'category'} 
          onClick={() => handleFilterChange('category')} 
        />
        <FilterTab 
          title="Location" 
          count={getLocationFilterCount()} 
          isActive={activeFilter === 'location'} 
          onClick={() => handleFilterChange('location')} 
        />
        <FilterTab 
          title="Investment" 
          count={getInvestmentFilterCount()} 
          isActive={activeFilter === 'investment'} 
          onClick={() => handleFilterChange('investment')} 
        />
      </div>
    );
  }
  
  // Render tabs based on screen size
  function renderTabsAndFilters() {
    // For small screens - vertical tabs on left, filters on right
    if (screenSize === "xsmall" || screenSize === "small") {
      return (
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 border-r border-gray-200">
            <div className="flex flex-col w-full">
              {Object.keys(tabIcons).map(tab => (
                <VerticalTab 
                  key={tab}
                  title={tabLabels[tab]} 
                  icon={tabIcons[tab]} 
                  isActive={activeTab === tab}
                  onClick={() => handleTabChange(tab)}
                />
              ))}
            </div>
          </div>
          
          <div className="w-full sm:w-2/3 p-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
                {tabIcons[activeTab]}
                <span className="ml-2">{tabLabels[activeTab]}</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'businesses' && "Find established businesses with proven track records and revenue."}
                {activeTab === 'franchises' && "Discover franchise opportunities from trusted brands across India."}
                {activeTab === 'startups' && "Invest in promising startups with high growth potential."}
                {activeTab === 'investors' && "Connect with investors looking for business opportunities."}
                {activeTab === 'digitalAssets' && "Explore digital businesses, websites, and online platforms for sale."}
              </p>
            </div>
            
            <div className="flex flex-col border-b border-gray-200 mb-4">
              <div className="flex items-center mb-2">
                <Filter className="w-4 h-4 text-indigo-600 mr-2" />
                <p className="text-sm font-medium text-gray-700">Find by:</p>
              </div>
              <div className="flex mb-2">
                <button 
                  className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'category' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => handleFilterChange('category')}
                >
                  Category
                  {getCategoryFilterCount() > 0 && 
                    <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                      {getCategoryFilterCount()}
                    </span>
                  }
                </button>
                <button 
                  className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'location' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => handleFilterChange('location')}
                >
                  Location
                  {getLocationFilterCount() > 0 && 
                    <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                      {getLocationFilterCount()}
                    </span>
                  }
                </button>
                <button 
                  className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'investment' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                  onClick={() => handleFilterChange('investment')}
                >
                  Investment
                  {getInvestmentFilterCount() > 0 && 
                    <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                      {getInvestmentFilterCount()}
                    </span>
                  }
                </button>
              </div>
            </div>
            
            {renderActiveFilter()}
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={clearAllFilters}
                className="text-indigo-600 text-xs hover:underline flex items-center"
              >
                <Filter className="w-3 h-3 mr-1" />
                Clear all filters
              </button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 flex items-center text-sm rounded-full">
                <Search className="w-4 h-4 mr-2" />
                <span>Search</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // For medium and large screens - horizontal tabs with filters below
    return (
      <div>
        <div className="px-4 pt-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 overflow-x-auto">
          <div className="flex w-full">
            {Object.keys(tabIcons).map(tab => (
              <HorizontalTab 
                key={tab}
                title={tabLabels[tab]} 
                icon={tabIcons[tab]} 
                isActive={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              />
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
              {tabIcons[activeTab]}
              <span className="ml-2">{tabLabels[activeTab]}</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {activeTab === 'businesses' && "Find established businesses with proven track records and revenue."}
              {activeTab === 'franchises' && "Discover franchise opportunities from trusted brands across India."}
              {activeTab === 'startups' && "Invest in promising startups with high growth potential."}
              {activeTab === 'investors' && "Connect with active investors looking for business opportunities."}
              {activeTab === 'digitalAssets' && "Explore digital businesses, websites, and online platforms for sale."}
            </p>
          </div>
          
          <div className="mb-5">
            <div className="flex flex-row items-center justify-between mb-3">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-indigo-600 mr-2" />
                <p className="text-sm font-medium text-gray-700">Find by:</p>
              </div>
              <div className="flex items-center">
                <Info className="w-4 h-4 text-indigo-400 mr-1" />
                <p className="text-xs text-indigo-600">Select multiple filters for more specific results</p>
              </div>
            </div>
            <div className="flex border-b border-gray-200">
              <button 
                className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'category' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                onClick={() => handleFilterChange('category')}
              >
                Category
                {getCategoryFilterCount() > 0 && 
                  <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                    {getCategoryFilterCount()}
                  </span>
                }
              </button>
              <button 
                className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'location' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                onClick={() => handleFilterChange('location')}
              >
                Location
                {getLocationFilterCount() > 0 && 
                  <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                    {getLocationFilterCount()}
                  </span>
                }
              </button>
              <button 
                className={`relative px-4 py-2 font-medium text-sm transition-colors flex-1 ${activeFilter === 'investment' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}
                onClick={() => handleFilterChange('investment')}
              >
                Investment Size
                {getInvestmentFilterCount() > 0 && 
                  <span className="absolute top-0 -right-1 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full">
                    {getInvestmentFilterCount()}
                  </span>
                }
              </button>
            </div>
          </div>
          
          {renderActiveFilter()}
        </div>
        
        <div className="px-6 pb-6 flex justify-between items-center">
          <button 
            onClick={clearAllFilters}
            className="text-indigo-600 text-sm hover:underline flex items-center"
          >
            <Filter className="w-4 h-4 mr-1" />
            Clear all filters
          </button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center rounded-full">
            <Search className="w-4 h-4 mr-2" />
            <span>Search</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 py-6 sm:py-16 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-purple-500 opacity-10"></div>
        <div className="absolute right-5 top-20 w-64 h-64 rounded-full bg-indigo-500 opacity-10"></div>
        <div className="absolute -right-20 bottom-0 w-80 h-80 rounded-full bg-purple-600 opacity-10"></div>
        <div className="absolute left-1/4 bottom-10 w-40 h-40 rounded-full bg-indigo-400 opacity-10"></div>
      </div>
      
      <div className="max-w-[95%] sm:max-w-[90%] xl:max-w-[80%] mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 tracking-tight">Find Your Perfect Business Opportunity</h1>
          <p className="text-indigo-100 text-sm sm:text-base md:text-lg">Explore thousands of verified businesses, franchises, and startups</p>
        </div>
        
        <div className="w-full">
          {/* Enhanced guided search steps */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 shadow-xl border border-white border-opacity-20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-md">1</div>
                <div className="ml-3 sm:ml-4">
                  <p className="font-medium text-white text-sm sm:text-base">First, select what you're looking for</p>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-0.5 sm:mt-1">Choose one of the options below</p>
                </div>
              </div>
              
              <div className="hidden sm:block mx-4">
                <ArrowRight className="w-6 h-6 text-white opacity-60" />
              </div>
              
              <div className="flex items-start mt-2 sm:mt-0">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-md">2</div>
                <div className="ml-3 sm:ml-4">
                  <p className="font-medium text-white text-sm sm:text-base">Then, select how you want to filter</p>
                  <p className="text-xs sm:text-sm text-indigo-100 mt-0.5 sm:mt-1">Choose from Category, Location, or Investment Size</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-indigo-50">
            {renderTabsAndFilters()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchSection;