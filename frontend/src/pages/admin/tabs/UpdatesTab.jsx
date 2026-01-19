import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Plus, Edit, Trash2, Pin, PinOff, Eye, EyeOff, Megaphone, FileText, Video, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';

const UpdatesTab = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement',
    link: '',
    is_pinned: false
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/updates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(response.data);
    } catch (error) {
      toast.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'announcement', link: '', is_pinned: false });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenDialog = (update = null) => {
    if (update) {
      setIsEditMode(true);
      setEditingId(update.id);
      setFormData({
        title: update.title,
        description: update.description,
        type: update.type,
        link: update.link || '',
        is_pinned: update.is_pinned || false
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      
      if (isEditMode) {
        await axios.put(`${API}/admin/updates/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Update edited successfully');
      } else {
        await axios.post(`${API}/admin/updates`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Update created successfully');
      }
      
      handleCloseDialog();
      fetchUpdates();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${isEditMode ? 'edit' : 'create'} update`);
    }
  };

  const handleToggleStatus = async (updateId) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API}/admin/updates/${updateId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status toggled');
      fetchUpdates();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/admin/updates/${updateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Update deleted');
      fetchUpdates();
    } catch (error) {
      toast.error('Failed to delete update');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'free_pdf': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'free_video': return <Video className="w-4 h-4 text-purple-500" />;
      default: return <Megaphone className="w-4 h-4 text-orange-500" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'free_pdf':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1"><FileText className="w-3 h-3" />Free PDF</Badge>;
      case 'free_video':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1"><Video className="w-3 h-3" />Free Video</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1"><Megaphone className="w-3 h-3" />Announcement</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Updates & Free Resources</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Share announcements and free materials with students</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-gradient-to-r from-orange-500 to-pink-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Update
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No updates created yet</p>
            <p className="text-sm">Create your first update to share with students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-3">Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Link</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Pinned</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Active</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((update) => (
                  <TableRow key={update.id} className={`hover:bg-gray-50/50 ${!update.is_active ? 'opacity-50' : ''}`}>
                    <TableCell className="py-4">
                      <div className="flex items-start gap-2">
                        {getTypeIcon(update.type)}
                        <div>
                          <p className="font-medium text-gray-900">{update.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">{update.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(update.type)}</TableCell>
                    <TableCell>
                      {update.link ? (
                        <a 
                          href={update.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline text-sm"
                        >
                          View <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {update.is_pinned ? (
                        <Pin className="w-4 h-4 text-yellow-600 mx-auto" />
                      ) : (
                        <PinOff className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={update.is_active}
                        onCheckedChange={() => handleToggleStatus(update.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(update.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(update)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(update.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {updates.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-sm text-gray-500">
            Total: {updates.length} updates ({updates.filter(u => u.is_active).length} active)
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Update' : 'Create New Update'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-orange-500" />
                      Announcement
                    </div>
                  </SelectItem>
                  <SelectItem value="free_pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Free PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="free_video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-500" />
                      Free Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., New Biology Notes Available!"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the update..."
                rows={3}
                required
              />
            </div>
            
            {(formData.type === 'free_pdf' || formData.type === 'free_video') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {formData.type === 'free_pdf' ? 'PDF Link (Google Drive)' : 'Video Link (YouTube/Bunny.net)'}
                </label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder={formData.type === 'free_pdf' 
                    ? 'https://drive.google.com/file/d/...' 
                    : 'https://youtube.com/watch?v=...'}
                />
                <p className="text-xs text-gray-500">
                  {formData.type === 'free_pdf' 
                    ? 'Share link must be publicly accessible' 
                    : 'YouTube or Bunny.net embed link'}
                </p>
              </div>
            )}
            
            {formData.type === 'announcement' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Link (optional)</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            )}
            
            <div className="flex items-center gap-3 py-2">
              <Switch
                id="is_pinned"
                checked={formData.is_pinned}
                onCheckedChange={(checked) => setFormData({...formData, is_pinned: checked})}
              />
              <label htmlFor="is_pinned" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                <Pin className="w-4 h-4 text-yellow-600" />
                Pin to top
              </label>
            </div>
            
            <Button type="submit" className="w-full">
              {isEditMode ? 'Update' : 'Create Update'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpdatesTab;
