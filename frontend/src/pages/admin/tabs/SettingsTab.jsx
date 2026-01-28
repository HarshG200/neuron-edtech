import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Lock, Save } from 'lucide-react';

const SettingsTab = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      toast.error('All fields are required');
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        `${API}/admin/change-password`,
        {
          current_password: formData.current_password,
          new_password: formData.new_password
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Password changed successfully!');
      
      // Clear form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to change password';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your admin password. Make sure to use a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                name="current_password"
                type="password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                name="new_password"
                type="password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
