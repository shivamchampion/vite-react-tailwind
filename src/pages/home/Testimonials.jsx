import React from 'react';
import { Card, CardBody, CardFooter, Button, Avatar } from "@heroui/react";
import { MessageCircle } from "lucide-react";

const Testimonials = ({ onSuccessStoriesClick }) => {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Sharma",
      position: "Entrepreneur & Investor",
      company: "RS Ventures",
      testimonial: "This platform completely transformed how I find business opportunities. Within three months, I found and acquired a profitable tech company that aligned perfectly with my investment criteria.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Priya Patel",
      position: "Business Owner",
      company: "Sunrise Retail Chain",
      testimonial: "When I decided to sell my retail business, I was amazed by how quickly I connected with serious buyers. The verification process gave everyone confidence, and the transaction was smoother than I expected.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Amit Verma",
      position: "Franchise Developer",
      company: "QuickBite Foods",
      testimonial: "As a franchise operator, finding qualified franchisees is critical. This platform has consistently delivered high-quality leads who understand our business model and are ready to commit.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied entrepreneurs and investors who've found success on our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="border border-gray-200 hover:border-indigo-300 transition-all duration-300">
              <CardBody className="p-6">
                <div className="mb-4">
                  <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                </div>
              </CardBody>
              <CardFooter className="bg-gray-50 px-6 py-4">
                <div className="flex items-center">
                  <Avatar src={testimonial.avatar} size="md" className="mr-4" />
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            className="bg-transparent text-indigo-600 hover:bg-indigo-50 font-medium"
            variant="flat"
            endContent={<MessageCircle className="w-4 h-4" />}
            onClick={onSuccessStoriesClick}
          >
            Read More Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;