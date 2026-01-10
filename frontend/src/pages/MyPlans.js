import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const MyPlans = () => {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${API}/subscriptions/my`);
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isActive = (endDate) => {
    return new Date(endDate) > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            data-testid="back-to-dashboard-button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            My <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Plans</span>
          </h1>
          <p className="text-gray-600">View and manage your active subscriptions</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">No active plans yet</p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Browse Subjects
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop View */}
            <Card className="hidden md:block shadow-xl border-0" data-testid="plans-table">
              <CardHeader>
                <CardTitle className="text-2xl">Plan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">No.</TableHead>
                      <TableHead className="font-semibold">Plan</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">Start Date</TableHead>
                      <TableHead className="font-semibold">End Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub, index) => (
                      <TableRow key={sub.id} data-testid={`subscription-row-${index}`}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{sub.subject_name}</TableCell>
                        <TableCell>₹ {sub.price}</TableCell>
                        <TableCell>{sub.duration_months} months</TableCell>
                        <TableCell>{formatDate(sub.start_date)}</TableCell>
                        <TableCell>{formatDate(sub.end_date)}</TableCell>
                        <TableCell>
                          {isActive(sub.end_date) ? (
                            <Badge className="bg-green-500" data-testid={`status-active-${index}`}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" data-testid={`status-expired-${index}`}>Expired</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {subscriptions.map((sub, index) => (
                <Card key={sub.id} className="shadow-lg border-0" data-testid={`mobile-subscription-card-${index}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{sub.subject_name}</CardTitle>
                      {isActive(sub.end_date) ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Expired</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Price:</span>
                      <span className="ml-2 font-semibold">₹ {sub.price}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-semibold">{sub.duration_months} months</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Start:</span>
                      <span className="ml-2 font-semibold">{formatDate(sub.start_date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">End:</span>
                      <span className="ml-2 font-semibold">{formatDate(sub.end_date)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPlans;
