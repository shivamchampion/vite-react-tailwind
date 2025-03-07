import React from 'react';
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { MapPin, Star, DollarSign } from "lucide-react";

/**
 * ListingCard Component
 * Displays a business listing card with details
 */
const ListingCard = ({ listing }) => {
  const planColors = {
    "Premium": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "Standard": "bg-blue-100 text-blue-800 border-blue-300",
    "Basic": "bg-green-100 text-green-800 border-green-300"
  };
  
  return (
    <Card className="border hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-48 object-cover" 
        />
        <Chip 
          className={`${planColors[listing.planType]} absolute top-3 right-3 font-medium text-xs`} 
          size="sm" 
          variant="flat"
        >
          {listing.planType}
        </Chip>
      </div>
      
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.type}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-gray-800">{listing.rating}/5</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>{listing.location}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
        
        <div className="bg-green-50 p-2 rounded-md mb-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-600 mr-1" />
            <p className="text-sm font-semibold text-green-700">{listing.investment}</p>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="bg-gray-50 py-3 px-4 flex justify-between items-center">
        <Button 
          className="bg-transparent text-indigo-600 hover:bg-indigo-50 font-medium"
          variant="flat"
          size="sm"
        >
          View Details
        </Button>
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
          size="sm"
        >
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;