import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <div className="w-full max-w-[1000px] mx-auto px-6 lg:px-8 py-8 flex-1">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <Logo className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Neuron by ELV ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform and services.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="w-5 h-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Name and contact information (email, phone number)</li>
                <li>Location information (city)</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely via Razorpay)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Study materials accessed and progress</li>
                <li>Subscription history</li>
                <li>Device and browser information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="w-5 h-5 text-blue-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To provide and maintain our educational services</li>
              <li>To process your subscriptions and payments</li>
              <li>To personalize your learning experience</li>
              <li>To communicate with you about your account and updates</li>
              <li>To improve our platform and services</li>
              <li>To ensure security and prevent unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-blue-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p className="mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure payment processing through Razorpay</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="w-5 h-5 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> support@neuronlearn.com<br />
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
