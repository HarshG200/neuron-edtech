import React from 'react';
import { ArrowLeft, IndianRupee, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const RefundPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              Refund Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              At Neuron by ELV, we want you to be completely satisfied with your purchase. This policy outlines the conditions under which refunds may be granted for our educational subscriptions.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Eligible for Refund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>You may be eligible for a full refund if:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>You request a refund within <strong>7 days</strong> of purchase</li>
              <li>You have not accessed more than 20% of the study materials</li>
              <li>Technical issues prevent access to purchased content (not resolved within 48 hours)</li>
              <li>Duplicate payment was made by mistake</li>
              <li>Wrong subject was purchased (must request within 24 hours)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <XCircle className="w-5 h-5 text-red-600" />
              Not Eligible for Refund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>Refunds will not be granted in the following cases:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Request made after 7 days of purchase</li>
              <li>More than 20% of materials have been accessed</li>
              <li>Change of mind after accessing materials</li>
              <li>Account suspension due to policy violations</li>
              <li>Unable to use due to personal device/internet issues</li>
              <li>Promotional or discounted subscriptions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="w-5 h-5 text-blue-600" />
              Refund Process
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <ol className="list-decimal list-inside space-y-3">
              <li>Email your refund request to <strong>neuronbyelv@gmail.com</strong></li>
              <li>Include your registered email, order ID, and reason for refund</li>
              <li>Our team will review your request within 2-3 business days</li>
              <li>If approved, refund will be processed within 5-7 business days</li>
              <li>Refund will be credited to the original payment method</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p>
              If you have any questions about our refund policy or need assistance, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> neuronbyelv@gmail.com<br />
              <strong>Phone:</strong> +91 98765 43210<br />
              <strong>Hours:</strong> Monday - Saturday, 9 AM - 6 PM IST
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
