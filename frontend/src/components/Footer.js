import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Separator } from './ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact Information */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-white/10 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">Email</p>
              <a href="mailto:support@neuronlearn.com" className="text-gray-200 hover:text-white transition-colors">
                support@neuronlearn.com
              </a>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-white/10 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">Phone</p>
              <a href="tel:+919876543210" className="text-gray-200 hover:text-white transition-colors">
                +91 98765 43210
              </a>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-white/10 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">Address</p>
              <p className="text-gray-200 text-sm">
                Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        {/* Privacy Notice */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-lg mb-2">Your Privacy Matters</h5>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  We collect and use your data only to provide access to our services. Your information is secure and 
                  will never be shared with third parties without your consent.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href="#privacy" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </a>
                  <span className="text-gray-500">•</span>
                  <a href="#terms" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </a>
                  <span className="text-gray-500">•</span>
                  <a href="#refund" className="text-blue-400 hover:text-blue-300 underline">
                    Refund Policy
                  </a>
                  <span className="text-gray-500">•</span>
                  <a href="#cancellation" className="text-blue-400 hover:text-blue-300 underline">
                    Cancellation Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Made with ❤️ for students across India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
