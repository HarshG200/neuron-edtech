import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Search } from 'lucide-react';

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(response.data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActive = (endDate) => {
    return new Date(endDate) > new Date();
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Subscription Management</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading subscriptions...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{sub.user_email}</TableCell>
                  <TableCell>{sub.subject_name}</TableCell>
                  <TableCell>₹{sub.price}</TableCell>
                  <TableCell>
                    {new Date(sub.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isActive(sub.end_date) ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Expired</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionsTab;
