import React from 'react';
import { Mail, Phone, MapPin, Shield, FileText, Facebook, Twitter, Instagram, Linkedin, BookOpen } from 'lucide-react';
import { Separator } from './ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">EduStream</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium study materials and video lectures for Class 10 students. Excel in your exams with our comprehensive learning resources.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/my-plans" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>My Plans</span>
                </a>
              </li>
              <li>
                <a href="/settings" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>FAQs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#refund" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Refund Policy</span>
                </a>
              </li>
              <li>
                <a href="#cancellation" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Cancellation Policy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href="mailto:support@edustream.com" className="text-gray-300 hover:text-white transition-colors">
                    support@edustream.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-gray-300 text-sm">
                    123 Education Street,<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} EduStream. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Made with ❤️ for students across India
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-sm mb-1">Your Privacy Matters</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                We collect and use your data only to provide access to our services. Your information is secure and 
                will never be shared with third parties. By using this platform, you agree to our{' '}
                <a href="#privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#terms" className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
