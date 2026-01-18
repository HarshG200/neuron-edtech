import React from 'react';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Scale, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-blue-600" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              By accessing and using Neuron by ELV's educational platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-blue-600" />
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <ul className="list-disc list-inside space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 13 years old to use our services</li>
              <li>One account per user is permitted</li>
              <li>You must notify us immediately of any unauthorized access to your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Subscription & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <ul className="list-disc list-inside space-y-2">
              <li>Subscriptions provide access to specific subject materials for the purchased duration</li>
              <li>Access is granted immediately upon successful payment</li>
              <li>Subscription duration is calculated from the date of purchase</li>
              <li>Materials are for personal, non-commercial educational use only</li>
              <li>Sharing account credentials or materials is strictly prohibited</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Share, distribute, or reproduce our study materials</li>
              <li>Record, screenshot, or download protected content</li>
              <li>Use automated tools to access or scrape our platform</li>
              <li>Attempt to bypass security measures or access restrictions</li>
              <li>Use the platform for any unlawful purpose</li>
              <li>Impersonate others or provide false information</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Scale className="w-5 h-5 text-blue-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p className="mb-4">
              All content on our platform, including study materials, videos, PDFs, graphics, and text, is owned by Neuron by ELV and protected by copyright laws. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Copy or reproduce any content without written permission</li>
              <li>Modify, adapt, or create derivative works</li>
              <li>Distribute or publicly display any content</li>
              <li>Use content for commercial purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              Neuron by ELV provides educational content for informational purposes. We do not guarantee specific academic results. Our liability is limited to the amount paid for the subscription in question.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p>
              For questions about these Terms of Service, contact us at:
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

export default TermsOfService;
