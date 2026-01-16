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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API}/admin/subjects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Subject added successfully');
      setIsDialogOpen(false);
      setFormData({ board: 'ICSE', class_name: 'Class 10', subject_name: '', price: '', duration_months: 6 });
      fetchSubjects();
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add subject');
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
    <Card className="shadow-xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Subject Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
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
                <Button type="submit" className="w-full">Add Subject</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading subjects...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Board</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-center">Visible to Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id} className={subject.is_visible === false ? 'opacity-50' : ''}>
                  <TableCell>{subject.board}</TableCell>
                  <TableCell>{subject.class_name}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{subject.subject_name}</span>
                      {subject.is_visible === false && (
                        <Badge variant="secondary" className="text-xs">Hidden</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>₹{subject.price}</TableCell>
                  <TableCell>{subject.duration_months} months</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Switch
                        checked={subject.is_visible !== false}
                        onCheckedChange={() => handleToggleVisibility(subject.id, subject.is_visible !== false)}
                        data-testid={`visibility-toggle-${subject.id}`}
                      />
                      {subject.is_visible !== false ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default SubjectsTab;
