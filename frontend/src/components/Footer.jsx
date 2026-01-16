import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Contact Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-4">
          <a href="mailto:support@neuronlearn.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <Mail className="w-4 h-4 text-blue-400" />
            support@neuronlearn.com
          </a>
          <a href="tel:+919876543210" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <Phone className="w-4 h-4 text-blue-400" />
            +91 98765 43210
          </a>
          <span className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin className="w-4 h-4 text-blue-400" />
            Mumbai, Maharashtra
          </span>
        </div>

        {/* Privacy Notice - Compact */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-3">
          <Shield className="w-3 h-3 text-blue-400" />
          <span>Your data is secure and never shared without consent.</span>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap justify-center gap-4 text-xs mb-3">
          <a href="#privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
          <span className="text-gray-600">•</span>
          <a href="#terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
          <span className="text-gray-600">•</span>
          <a href="#refund" className="text-blue-400 hover:text-blue-300 transition-colors">Refund Policy</a>
          <span className="text-gray-600">•</span>
          <a href="#cancellation" className="text-blue-400 hover:text-blue-300 transition-colors">Cancellation</a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          © {currentYear} Neuron. Made with ❤️ for students across India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
