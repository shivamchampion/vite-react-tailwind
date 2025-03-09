import React, { useState } from 'react';
import { Button } from "@heroui/react";
import {
    ArrowRight,
    ChevronRight,
    Store,
    Lightbulb,
    Building,
    Users,
    Globe,
    Search,
    MessageCircle,
    CheckCircle,
    Shield,
    TrendingUp,
    DollarSign,
    FileText
} from "lucide-react";
import { useOutletContext } from 'react-router-dom';

const HowItWorks = ({ openAuthModal }) => {
    const [activeCategory, setActiveCategory] = useState("business");

    // Define the categories and their specific process steps
    const categories = [
        {
            id: "business",
            label: "Sell Your Business",
            icon: <Building className="w-5 h-5" />,
            steps: [
                {
                    number: "01",
                    title: "Create Your Business Profile",
                    description: "Complete a comprehensive business profile with key metrics, financial performance and assets",
                    icon: <FileText className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Company history and unique selling proposition",
                        "Financial statements and performance metrics",
                        "Customer base and market position",
                        "Proprietary technology and intellectual property"
                    ]
                },
                {
                    number: "02",
                    title: "Get Verified & Valued",
                    description: "Our team verifies your information and helps determine an optimal valuation range",
                    icon: <Shield className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Document verification process",
                        "Market-based valuation methodology",
                        "Comparable business analysis",
                        "Growth potential assessment"
                    ]
                },
                {
                    number: "03",
                    title: "Connect with Buyers",
                    description: "Get matched with qualified buyers and investors based on your preferences",
                    icon: <MessageCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Secure messaging system",
                        "Privacy controls for sensitive information",
                        "Filter and screen potential buyers",
                        "Schedule virtual or in-person meetings"
                    ]
                },
                {
                    number: "04",
                    title: "Close Your Deal",
                    description: "Finalize the transaction with support from our network of trusted advisors",
                    icon: <CheckCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Deal structuring guidance",
                        "Legal document preparation",
                        "Transition planning assistance",
                        "Post-sale support options"
                    ]
                }
            ],
            featuredStats: [
                { value: "94%", label: "Listing success rate" },
                { value: "45 days", label: "Average time to offer" },
                { value: "8.5%", label: "Higher sale price" }
            ]
        },
        {
            id: "franchise",
            label: "Franchise Opportunities",
            icon: <Store className="w-5 h-5" />,
            steps: [
                {
                    number: "01",
                    title: "List Your Franchise Model",
                    description: "Create a detailed profile of your franchise opportunity with costs, requirements and support",
                    icon: <Building className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Franchise model overview",
                        "Setup costs and ongoing fees",
                        "Training and support systems",
                        "Territory exclusivity terms"
                    ]
                },
                {
                    number: "02",
                    title: "Showcase Performance",
                    description: "Share validated performance metrics from existing franchisees to build credibility",
                    icon: <TrendingUp className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Unit economics breakdown",
                        "Franchisee success stories",
                        "Growth trajectory data",
                        "Market penetration analysis"
                    ]
                },
                {
                    number: "03",
                    title: "Screen Franchisees",
                    description: "Review applications and connect with qualified franchisee candidates",
                    icon: <Users className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Candidate qualification tools",
                        "Background verification",
                        "Financial capability assessment",
                        "Cultural fit evaluation"
                    ]
                },
                {
                    number: "04",
                    title: "Onboard New Partners",
                    description: "Streamline the signing and onboarding of new franchisees through our platform",
                    icon: <CheckCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Digital contract signing",
                        "Initial training registration",
                        "Supply chain integration",
                        "Launch schedule planning"
                    ]
                }
            ],
            featuredStats: [
                { value: "3.2x", label: "Faster franchisee acquisition" },
                { value: "150+", label: "Active franchise brands" },
                { value: "62%", label: "Lower acquisition costs" }
            ]
        },
        {
            id: "startup",
            label: "Fund Your Startup",
            icon: <Lightbulb className="w-5 h-5" />,
            steps: [
                {
                    number: "01",
                    title: "Showcase Your Startup",
                    description: "Create a comprehensive profile highlighting your innovation, team and market opportunity",
                    icon: <Lightbulb className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Product/service differentiation",
                        "Team credentials and expertise",
                        "Market size and growth potential",
                        "Traction and key milestones"
                    ]
                },
                {
                    number: "02",
                    title: "Define Investment Terms",
                    description: "Clarify your funding needs, equity offering, and use of funds",
                    icon: <DollarSign className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Funding round structure",
                        "Valuation and equity percentages",
                        "Capital allocation plan",
                        "Growth and exit projections"
                    ]
                },
                {
                    number: "03",
                    title: "Pitch to Investors",
                    description: "Connect with suitable investors matching your industry, stage and funding requirements",
                    icon: <MessageCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Targeted investor matching",
                        "Virtual pitch sessions",
                        "Due diligence data rooms",
                        "Investor Q&A management"
                    ]
                },
                {
                    number: "04",
                    title: "Secure Funding",
                    description: "Finalize deal terms and receive investment with necessary legal documentation",
                    icon: <Shield className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Term sheet templates",
                        "Legal compliance checks",
                        "Payment processing",
                        "Post-investment reporting tools"
                    ]
                }
            ],
            featuredStats: [
                { value: "₹82Cr+", label: "Funding raised" },
                { value: "38%", label: "Success rate" },
                { value: "75+", label: "Active investors" }
            ]
        },
        {
            id: "investment",
            label: "Find Investments",
            icon: <Users className="w-5 h-5" />,
            steps: [
                {
                    number: "01",
                    title: "Create Investor Profile",
                    description: "Set up your investor profile with preferences, investment criteria and experience",
                    icon: <Users className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Investment strategy definition",
                        "Industry and sector preferences",
                        "Budget range and deal size",
                        "Expected ROI parameters"
                    ]
                },
                {
                    number: "02",
                    title: "Discover Opportunities",
                    description: "Browse verified listings or receive curated opportunities matching your criteria",
                    icon: <Search className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "AI-powered matching algorithm",
                        "Advanced filtering options",
                        "Verified financial data access",
                        "Risk assessment tools"
                    ]
                },
                {
                    number: "03",
                    title: "Perform Due Diligence",
                    description: "Access detailed business information and analytics to evaluate potential investments",
                    icon: <FileText className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Standardized financial reports",
                        "Historical performance data",
                        "Market competition analysis",
                        "Virtual data room access"
                    ]
                },
                {
                    number: "04",
                    title: "Invest with Confidence",
                    description: "Make offers, negotiate terms and finalize investments through our secure platform",
                    icon: <Shield className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Secure offer submission",
                        "Counter-offer negotiation",
                        "Transaction security measures",
                        "Post-investment tracking"
                    ]
                }
            ],
            featuredStats: [
                { value: "2,100+", label: "Active opportunities" },
                { value: "32%", label: "Average ROI" },
                { value: "12-16%", label: "Typical yield" }
            ]
        },
        {
            id: "digital",
            label: "Digital Assets",
            icon: <Globe className="w-5 h-5" />,
            steps: [
                {
                    number: "01",
                    title: "List Your Digital Asset",
                    description: "Create a detailed listing of your website, app, domain or other digital property",
                    icon: <Globe className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Traffic and user metrics",
                        "Revenue streams and monetization",
                        "Technical infrastructure details",
                        "Content and intellectual property"
                    ]
                },
                {
                    number: "02",
                    title: "Verify Performance",
                    description: "Connect analytics accounts to verify metrics and increase buyer confidence",
                    icon: <TrendingUp className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Analytics integration",
                        "Revenue verification",
                        "Traffic source breakdown",
                        "User engagement metrics"
                    ]
                },
                {
                    number: "03",
                    title: "Engage with Buyers",
                    description: "Connect with interested buyers and answer questions about your digital asset",
                    icon: <MessageCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Secure messaging system",
                        "Screen sharing demos",
                        "Technical Q&A management",
                        "Negotiation tools"
                    ]
                },
                {
                    number: "04",
                    title: "Transfer Ownership",
                    description: "Complete the secure transfer of your digital asset and receive payment",
                    icon: <CheckCircle className="w-6 h-6 text-indigo-300" />,
                    details: [
                        "Escrow payment protection",
                        "Domain transfer assistance",
                        "Code repository handover",
                        "Account access transition"
                    ]
                }
            ],
            featuredStats: [
                { value: "3.8x", label: "Average multiple" },
                { value: "21 days", label: "Avg. time to sell" },
                { value: "₹48L+", label: "Highest sale" }
            ]
        }
    ];

    const currentCategory = categories.find(cat => cat.id === activeCategory);

    return (
        <section className="py-16 bg-[#0031AC] text-white">
            <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-indigo-200 max-w-3xl mx-auto">
                        Our platform makes it simple to buy, sell, or invest in businesses and opportunities with a transparent, secure process
                    </p>
                </div>

                {/* Improved Clickable Category Selection Pills */}
                <div className="mb-10">
                    <div className="flex flex-wrap justify-center gap-3 p-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${activeCategory === category.id
                                        ? 'bg-white text-[#0031AC] shadow-md transform scale-105'
                                        : 'bg-indigo-800/70 text-white hover:bg-indigo-700 hover:scale-105'
                                    }`}
                                aria-label={`View process for ${category.label}`}
                            >
                                <div className={`${activeCategory === category.id ? 'text-[#0031AC]' : 'text-indigo-300'}`}>
                                    {category.icon}
                                </div>
                                <span>{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Description */}
                <div className="text-center mb-10">
                    <h3 className="text-xl font-semibold mb-2">
                        {activeCategory === "business" && "Sell your business at the best possible valuation"}
                        {activeCategory === "franchise" && "Expand your franchise network with qualified partners"}
                        {activeCategory === "startup" && "Secure funding from investors who believe in your vision"}
                        {activeCategory === "investment" && "Find the right business opportunities for your investment portfolio"}
                        {activeCategory === "digital" && "Buy or sell online businesses, websites, and digital assets"}
                    </h3>
                    <p className="text-indigo-200 max-w-2xl mx-auto text-sm">
                        {activeCategory === "business" && "For established businesses looking to exit, find strategic buyers, or transfer ownership to new entrepreneurs."}
                        {activeCategory === "franchise" && "For franchisors looking to scale their business model and find qualified franchisees across multiple locations."}
                        {activeCategory === "startup" && "For innovative startups seeking seed, angel, or venture capital funding to fuel their growth and scale operations."}
                        {activeCategory === "investment" && "For investors looking to diversify their portfolio with verified business and franchise opportunities."}
                        {activeCategory === "digital" && "For digital entrepreneurs looking to buy or sell established websites, apps, SaaS products, and online businesses."}
                    </p>
                </div>

                {/* Featured Stats */}
                <div className="grid grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
                    {currentCategory.featuredStats.map((stat, index) => (
                        <div key={index} className="bg-indigo-800/40 rounded-xl p-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-indigo-200">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {currentCategory.steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-indigo-800/40 rounded-xl p-6 h-full border border-indigo-700/50 hover:border-indigo-500/50 transition-all duration-300 group">
                                <div className="absolute -top-4 -left-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg px-3 py-1 text-xs font-bold text-white shadow-lg">
                                    Step {step.number}
                                </div>

                                <div className="flex items-start mb-4">
                                    <div className="mr-4 mt-1">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors">{step.title}</h3>
                                        <p className="text-indigo-200 text-sm">{step.description}</p>
                                    </div>
                                </div>

                                <ul className="mt-4 space-y-2">
                                    {step.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="text-indigo-400 mr-2 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            </div>
                                            <span className="text-xs text-indigo-200">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {index < currentCategory.steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <ArrowRight className="w-8 h-8 text-indigo-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Button
                        className="bg-white text-[#0031AC] hover:bg-gray-100 transition-all duration-200 shadow-md px-8 py-4 font-medium text-base rounded-full hover:shadow-lg hover:scale-105 active:scale-95"
                        endContent={<ChevronRight className="w-5 h-5" />}
                        onClick={() => {
                            // Check if openAuthModal exists and is a function before calling
                            if (typeof openAuthModal === 'function') {
                                openAuthModal('register');
                            } else {
                                console.warn("openAuthModal is not available. Check HowItWorksPage component.");
                            }
                        }}
                        aria-label="Create your account"
                    >
                        Get Started Today
                    </Button>
                    <p className="text-indigo-300 text-xs mt-3">No obligation. Free to create your profile.</p>
                </div>
            </div>
        </section>
    );
};



const HowItWorksPage = () => {
    // Get openAuthModal from outlet context, not auth context
    const { openAuthModal } = useOutletContext() || {};
    
    return (
      <div>
        {/* Pass it as a prop to your HowItWorks component */}
        <HowItWorks openAuthModal={openAuthModal} />
      </div>
    );
  };
  
  export default HowItWorksPage;