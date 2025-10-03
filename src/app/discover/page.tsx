'use client';

import { Heart, CheckCircle, Users, TrendingUp, Star, Zap } from 'lucide-react';

export default function DiscoverPage() {
  const features = [
    {
      icon: Heart,
      title: 'Personalized Health Coaching',
      description: 'Get one-on-one coaching tailored to your unique health goals and needs.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Users,
      title: 'Multi-Coach Support',
      description: 'Work with multiple coaches for different aspects of your health journey.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your health metrics, sessions, and goals with detailed analytics.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: CheckCircle,
      title: 'Goal Management',
      description: 'Set, track, and achieve your health and wellness goals with guided support.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      title: 'Expert Guidance',
      description: 'Access professional health coaches with verified credentials and experience.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Stay connected with instant notifications and session scheduling.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Client',
      text: 'EFH Health Hub transformed my approach to wellness. The personalized coaching is incredible!',
      rating: 5
    },
    {
      name: 'Mike T.',
      role: 'Client',
      text: 'Best health coaching platform I\'ve used. The progress tracking keeps me accountable.',
      rating: 5
    },
    {
      name: 'Emma L.',
      role: 'Health Coach',
      text: 'As a coach, this platform makes it easy to manage multiple clients and track their progress.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EFH Health Hub
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your comprehensive health coaching platform. Transform your wellness journey with personalized 
              guidance, expert support, and powerful tracking tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Get Started
              </button>
              <button className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Your Health Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you achieve your wellness goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className={`p-4 rounded-xl ${feature.bgColor} w-fit mb-4`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied clients and coaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join EFH Health Hub today and take the first step towards a healthier, happier you.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

