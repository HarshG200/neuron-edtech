import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Badge } from '../../../components/ui/badge';

const SubjectsTab = ({ onUpdate }) => {
  const [subjects, setSubjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    board: '',
    class_name: 'Class 10',
    subject_name: '',
    price: '',
    duration_months: 6
  });

  useEffect(() => {
    fetchSubjects();
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/boards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(response.data);
    } catch (error) {
      console.error('Failed to load boards');
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ board: '', class_name: 'Class 10', subject_name: '', price: '', duration_months: 6 });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setIsEditMode(true);
      setEditingId(subject.id);
      setFormData({
        board: subject.board,
        class_name: subject.class_name,
        subject_name: subject.subject_name,
        price: subject.price.toString(),
        duration_months: subject.duration_months
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
        await axios.put(`${API}/admin/subjects/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Subject updated successfully');
      } else {
        await axios.post(`${API}/admin/subjects`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Subject added successfully');
      }
      
      handleCloseDialog();
      fetchSubjects();
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'add'} subject`);
    }
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/admin/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Subject deleted successfully');
      fetchSubjects();
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleToggleVisibility = async (subjectId, currentVisibility) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `${API}/admin/subjects/${subjectId}/visibility`,
        { is_visible: !currentVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Subject ${!currentVisibility ? 'shown' : 'hidden'} on client side`);
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to toggle visibility');
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Subject Management</CardTitle>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-3">Board</TableHead>
                  <TableHead className="font-semibold text-gray-700">Class</TableHead>
                  <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Visible</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id} className={`hover:bg-gray-50/50 ${subject.is_visible === false ? 'opacity-60' : ''}`}>
                    <TableCell className="py-4">{subject.board}</TableCell>
                    <TableCell>{subject.class_name}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{subject.subject_name}</span>
                        {subject.is_visible === false && (
                          <Badge variant="secondary" className="text-xs">Hidden</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{subject.price}</TableCell>
                    <TableCell className="text-center">{subject.duration_months} mo</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={subject.is_visible !== false}
                          onCheckedChange={() => handleToggleVisibility(subject.id, subject.is_visible !== false)}
                        />
                        {subject.is_visible !== false ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(subject)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(subject.id)}
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
        {subjects.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-sm text-gray-500">
            Total: {subjects.length} subjects
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Board</label>
              <Select value={formData.board} onValueChange={(value) => setFormData({...formData, board: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map(board => (
                    <SelectItem key={board.id} value={board.name}>
                      {board.name} - {board.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {boards.length === 0 && (
                <p className="text-xs text-orange-600">⚠️ Please add boards first in the Boards tab</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Input
                value={formData.class_name}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                placeholder="Class 10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Name</label>
              <Input
                value={formData.subject_name}
                onChange={(e) => setFormData({...formData, subject_name: e.target.value})}
                placeholder="Biology"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (₹)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (months)</label>
                <Input
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({...formData, duration_months: parseInt(e.target.value)})}
                  placeholder="6"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isEditMode ? 'Update Subject' : 'Add Subject'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SubjectsTab;
