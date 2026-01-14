import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';

const BoardsTab = ({ onUpdate }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    description: '',
  });

  useEffect(() => {
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
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', full_name: '', description: '' });
    setIsEditMode(false);
    setCurrentBoard(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (board) => {
    setCurrentBoard(board);
    setFormData({
      name: board.name,
      full_name: board.full_name,
      description: board.description || ''
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      
      if (isEditMode) {
        // Update existing board
        await axios.put(`${API}/admin/boards/${currentBoard.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Board updated successfully');
      } else {
        // Create new board
        await axios.post(`${API}/admin/boards`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Board added successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchBoards();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'add'} board`);
    }
  };

  const handleDelete = async (boardId, boardName) => {
    if (!window.confirm(`Are you sure you want to delete ${boardName}? This will affect all subjects under this board.`)) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/admin/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Board deleted successfully');
      fetchBoards();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete board');
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Board Management</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Manage education boards (ICSE, CBSE, State Boards, etc.)</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Edit Board' : 'Add New Board'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Short Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                    placeholder="ICSE"
                    required
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">Short code (e.g., ICSE, CBSE, IGCSE)</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Indian Certificate of Secondary Education"
                    required
                  />
                  <p className="text-xs text-gray-500">Full board name</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description about this board..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {isEditMode ? 'Update Board' : 'Add Board'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading boards...</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No boards added yet</p>
            <p className="text-gray-400 text-sm">Click "Add Board" to create your first education board</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Short Name</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="max-w-md">Description</TableHead>
                <TableHead className="text-center">Subjects</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boards.map((board) => (
                <TableRow key={board.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-bold text-base">
                      {board.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{board.full_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {board.description || <span className="text-gray-400 italic">No description</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{board.subject_count || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-500">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(board)}
                        data-testid={`edit-board-${board.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(board.id, board.name)}
                        data-testid={`delete-board-${board.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default BoardsTab;
