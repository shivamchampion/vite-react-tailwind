import React from 'react';
import { Card, CardBody } from "@heroui/react";

/**
 * FeatureCard Component
 * Displays a feature with an icon, title, and description
 */
const FeatureCard = ({ icon, title, description }) => (
  <Card className="border border-gray-200 hover:border-indigo-600 transition-all duration-300 h-full">
    <CardBody className="p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardBody>
  </Card>
);

export default FeatureCard;