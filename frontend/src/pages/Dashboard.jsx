import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FileText,
  ShoppingCart,
  CheckCircle,
  Loader2,
  User,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import AccountMenu from '../components/AccountMenu';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import UpdatesDrawer from '../components/UpdatesDrawer';

const Dashboard = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, subscriptionsRes] = await Promise.all([
        axios.get(`${API}/subjects`),
        axios.get(`${API}/subscriptions/my`),
      ]);
      setSubjects(subjectsRes.data);
      setSubscriptions(subscriptionsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = (subjectId) => {
    return subscriptions.some(
      (sub) =>
        sub.subject_id === subjectId &&
        sub.payment_status === 'completed' &&
        new Date(sub.end_date) > new Date()
    );
  };

  const handleBuyPlan = async (subject) => {
    try {
      // Create order
      const orderResponse = await axios.post(`${API}/payments/create-order`, {
        subject_id: subject.id,
        amount: subject.price,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_S4akkTCJTwt4qA',
        amount: orderResponse.data.amount * 100,
        currency: 'INR',
        name: 'Neuron',
        description: `${subject.board} - ${subject.class_name} - ${subject.subject_name}`,
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
            await axios.post(`${API}/payments/verify`, {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Subscription activated.');
            fetchData(); // Refresh data
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#667eea',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  const handleOpenMaterial = (subjectId) => {
    navigate(`/materials/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo className="h-14" />
            </div>
            <div className="flex items-center space-x-4">
              <UpdatesDrawer />
              <Button
                data-testid="my-plans-button"
                variant="outline"
                onClick={() => navigate('/my-plans')}
                className="hidden sm:flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>My Plans</span>
              </Button>
              <AccountMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 py-12 flex-1">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Available <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Subjects</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your subjects and start your learning journey with premium study materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="subjects-grid">
          {subjects.map((subject) => {
            const hasSubscription = hasActiveSubscription(subject.id);
            return (
              <Card
                key={subject.id}
                data-testid={`subject-card-${subject.id}`}
                className="card-hover border-0 shadow-lg overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {subject.board}
                      </Badge>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {subject.subject_name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {subject.class_name}
                      </CardDescription>
                    </div>
                    {hasSubscription && (
                      <CheckCircle className="w-6 h-6 text-green-500" data-testid={`subscribed-icon-${subject.id}`} />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">₹{subject.price}</span>
                    <span className="text-sm text-gray-500">/ {subject.duration_months} months</span>
                  </div>
                  {hasSubscription ? (
                    <Button
                      data-testid={`open-material-button-${subject.id}`}
                      onClick={() => handleOpenMaterial(subject.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Open Materials
                    </Button>
                  ) : (
                    <Button
                      data-testid={`buy-plan-button-${subject.id}`}
                      onClick={() => handleBuyPlan(subject)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
