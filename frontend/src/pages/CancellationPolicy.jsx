import React from 'react';
import { ArrowLeft, XCircle, Clock, AlertTriangle, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const CancellationPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancellation Policy</h1>
          <p className="text-gray-600">Last updated: January 2026</p>
        </div>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <XCircle className="w-5 h-5 text-blue-600" />
              Subscription Cancellation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p>
              Neuron by ELV subscriptions are one-time purchases for a fixed duration. Unlike recurring subscriptions, our plans do not auto-renew, so there is no need to cancel to avoid future charges.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="w-5 h-5 text-blue-600" />
              Access Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <ul className="list-disc list-inside space-y-2">
              <li>Your subscription remains active for the purchased duration (e.g., 3 months, 6 months, 1 year)</li>
              <li>Access to materials continues until the subscription end date</li>
              <li>No action required from your side to end the subscription</li>
              <li>You will receive a reminder email before your subscription expires</li>
              <li>You can renew at any time to extend your access</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Early Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>If you wish to stop using the service before your subscription ends:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>You may request account deactivation at any time</li>
              <li>No refund will be provided for unused portion of the subscription</li>
              <li>Access will be terminated immediately upon deactivation</li>
              <li>Your account data will be retained for 30 days before permanent deletion</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Account Deletion</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            <p className="mb-4">
              If you wish to delete your account entirely:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Send an email to support@neuronlearn.com with subject "Account Deletion Request"</li>
              <li>Include your registered email address in the body</li>
              <li>Your request will be processed within 3-5 business days</li>
              <li>You will receive confirmation once the deletion is complete</li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              Note: Account deletion is permanent and cannot be reversed. All your data, including subscription history and progress, will be permanently removed.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-6 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-4">For any questions regarding cancellation or account management:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>support@neuronlearn.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default CancellationPolicy;
