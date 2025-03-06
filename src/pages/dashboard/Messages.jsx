import React, { useState } from 'react';
import { Search, MessageSquare, User, Send, ChevronLeft, Trash2, ArrowLeft, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * MessagesPage Component
 * Page for managing and viewing message conversations
 */
function MessagesPage() {
  const { userProfile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Placeholder conversations data
  const conversations = [
    {
      id: 1,
      contactName: 'Rahul Sharma',
      entityName: 'Coffee Shop for Sale',
      lastMessage: 'Can you provide more details about the monthly revenue?',
      timestamp: '2023-05-15T10:30:00',
      unread: true,
      entityType: 'business',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I am interested in your coffee shop listing. Can you provide more details?',
          timestamp: '2023-05-15T10:00:00'
        },
        {
          id: 2,
          sender: 'contact',
          text: 'Hi there! Of course, what would you like to know?',
          timestamp: '2023-05-15T10:15:00'
        },
        {
          id: 3,
          sender: 'user',
          text: 'Can you provide more details about the monthly revenue?',
          timestamp: '2023-05-15T10:30:00'
        }
      ]
    },
    {
      id: 2,
      contactName: 'Priya Patel',
      entityName: 'Tech Startup Seeking Investment',
      lastMessage: 'Let me send you our pitch deck with more information.',
      timestamp: '2023-05-14T16:45:00',
      unread: false,
      entityType: 'startup',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hi, I saw your startup listing and I am interested in learning more.',
          timestamp: '2023-05-14T16:00:00'
        },
        {
          id: 2,
          sender: 'contact',
          text: 'Hello! Thanks for your interest. We are developing a SaaS platform for small businesses.',
          timestamp: '2023-05-14T16:30:00'
        },
        {
          id: 3,
          sender: 'user',
          text: 'That sounds interesting. Do you have any materials I can review?',
          timestamp: '2023-05-14T16:40:00'
        },
        {
          id: 4,
          sender: 'contact',
          text: 'Let me send you our pitch deck with more information.',
          timestamp: '2023-05-14T16:45:00'
        }
      ]
    },
    {
      id: 3,
      contactName: 'Amit Verma',
      entityName: 'E-commerce Website',
      lastMessage: 'Yes, the website comes with full inventory management.',
      timestamp: '2023-05-12T09:15:00',
      unread: false,
      entityType: 'digital_asset',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I am interested in your e-commerce website. Does it include inventory management?',
          timestamp: '2023-05-12T09:00:00'
        },
        {
          id: 2,
          sender: 'contact',
          text: 'Yes, the website comes with full inventory management.',
          timestamp: '2023-05-12T09:15:00'
        }
      ]
    }
  ];
  
  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    // Filter by type
    const matchesFilter = filter === 'all' || conversation.entityType === filter;
    
    // Filter by search term
    const matchesSearch = 
      conversation.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the API
    console.log(`Sending message to conversation ${selectedConversation}: ${message}`);
    
    // Clear the message input
    setMessage('');
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Communicate with business owners, investors, and sellers
        </p>
      </header>
      
      <div className="bg-white shadow rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          {/* Left sidebar - Conversations list */}
          <div className={`w-full md:w-1/3 border-r ${selectedConversation ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search messages..."
                />
              </div>
              
              <div className="mt-3 flex">
                <button
                  className={`mr-2 px-3 py-1 text-sm rounded-full ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`mr-2 px-3 py-1 text-sm rounded-full ${
                    filter === 'business' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('business')}
                >
                  Businesses
                </button>
                <button
                  className={`mr-2 px-3 py-1 text-sm rounded-full ${
                    filter === 'startup' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('startup')}
                >
                  Startups
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {filteredConversations.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => (
                    <li 
                      key={conversation.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedConversation === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-medium ${conversation.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {conversation.contactName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-1">{conversation.entityName}</p>
                        <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-3">
                    <MessageSquare size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No messages found</h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm || filter !== 'all'
                      ? 'Try changing your search or filter settings'
                      : 'When you contact businesses or receive messages, they will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side - Conversation */}
          <div className={`w-full md:w-2/3 flex flex-col ${selectedConversation ? 'block' : 'hidden md:block'}`}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      className="md:hidden mr-2 text-gray-500"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {conversations.find(c => c.id === selectedConversation)?.contactName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversations.find(c => c.id === selectedConversation)?.entityName}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {conversations.find(c => c.id === selectedConversation)?.messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}
                        >
                          {formatTimestamp(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <p className="mt-2 text-xs text-gray-500">
                    Sending a message uses 1 connect
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
                <p className="text-gray-500 text-center mb-4 max-w-md">
                  Select a conversation from the list, or contact a business owner to start a new conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;