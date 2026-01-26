import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        {/* Contact Row */}
        <div className="flex justify-center items-center mb-4">
          <a href="mailto:support@neuronlearn.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
            <Mail className="w-4 h-4 text-blue-400" />
            support@neuronlearn.com
          </a>
        </div>

        {/* Privacy Notice - Compact */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-3">
          <Shield className="w-3 h-3 text-blue-400" />
          <span>Your data is secure and never shared without consent.</span>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap justify-center gap-4 text-xs mb-3">
          <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</Link>
          <span className="text-gray-600">•</span>
          <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</Link>
          <span className="text-gray-600">•</span>
          <Link to="/refund" className="text-blue-400 hover:text-blue-300 transition-colors">Refund Policy</Link>
          <span className="text-gray-600">•</span>
          <Link to="/cancellation" className="text-blue-400 hover:text-blue-300 transition-colors">Cancellation</Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          © {currentYear} Neuron by ELV. Made with ❤️ for students across India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
