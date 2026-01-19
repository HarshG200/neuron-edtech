import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../App';
import { toast } from 'sonner';
import {
  Users,
  BookOpen,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Bell,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import Logo from '../../components/Logo';
import UsersTab from './tabs/UsersTab';
import BoardsTab from './tabs/BoardsTab';
import SubjectsTab from './tabs/SubjectsTab';
import MaterialsTab from './tabs/MaterialsTab';
import SubscriptionsTab from './tabs/SubscriptionsTab';
import PaymentsTab from './tabs/PaymentsTab';
import UpdatesTab from './tabs/UpdatesTab';

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({ users: 0, subjects: 0, subscriptions: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo className="h-14" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Subjects</CardTitle>
                <BookOpen className="w-8 h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.subjects}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Subscriptions</CardTitle>
                <FileText className="w-8 h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.subscriptions}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
                <CreditCard className="w-8 h-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{stats.revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="boards" className="w-full">
          <TabsList className="flex flex-wrap justify-start gap-1 h-auto p-1 mb-6 bg-gray-100">
            <TabsTrigger value="boards" className="px-3 py-2 text-sm">
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Boards
            </TabsTrigger>
            <TabsTrigger value="subjects" className="px-3 py-2 text-sm">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="materials" className="px-3 py-2 text-sm">
              <FileText className="w-4 h-4 mr-1.5" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="users" className="px-3 py-2 text-sm">
              <Users className="w-4 h-4 mr-1.5" />
              Users
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="px-3 py-2 text-sm">
              <Settings className="w-4 h-4 mr-1.5" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="payments" className="px-3 py-2 text-sm">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boards">
            <BoardsTab onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectsTab onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionsTab />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
