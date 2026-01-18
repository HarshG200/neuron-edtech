import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';
import { Search, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-gray-800">User Management</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      City
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={index} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900 py-4">{user.name || '-'}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">{user.phone || '-'}</TableCell>
                    <TableCell className="text-gray-600">{user.city || '-'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {filteredUsers.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTab;
