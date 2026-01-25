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
import { Plus, Edit, Trash2, ExternalLink, FileText, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';

const MaterialsTab = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: '',
    title: '',
    type: 'pdf',
    link: '',
    description: ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API}/admin/materials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(response.data);
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
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
      console.error('Failed to load subjects');
    }
  };

  const resetForm = () => {
    setFormData({ subject_id: '', title: '', type: 'pdf', link: '', description: '' });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenDialog = (material = null) => {
    if (material) {
      setIsEditMode(true);
      setEditingId(material.id);
      setFormData({
        subject_id: material.subject_id,
        title: material.title,
        type: material.type,
        link: material.link,
        description: material.description || ''
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
        await axios.put(`${API}/admin/materials/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Material updated successfully');
      } else {
        await axios.post(`${API}/admin/materials`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Material added successfully');
      }
      
      handleCloseDialog();
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'add'} material`);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/admin/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.board} - ${subject.subject_name}` : subjectId;
  };

  return (
    <Card className="shadow-lg border border-gray-200">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Material Management</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Add Google Drive PDFs and Bunny.net videos</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No materials added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-3">Subject</TableHead>
                  <TableHead className="font-semibold text-gray-700">Title</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Link</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-gray-50/50">
                    <TableCell className="py-4 font-medium">{getSubjectName(material.subject_id)}</TableCell>
                    <TableCell>{material.title}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={material.type === 'pdf' ? 'default' : 'secondary'}
                        className={`gap-1 ${material.type === 'pdf' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-purple-100 text-purple-700 hover:bg-purple-100'}`}
                      >
                        {material.type === 'pdf' ? <FileText className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        {material.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={material.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-600 hover:underline text-sm"
                      >
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-gray-500 text-sm">
                      {material.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(material)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
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
        {materials.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-sm text-gray-500">
            Total: {materials.length} materials ({materials.filter(m => m.type === 'pdf').length} PDFs, {materials.filter(m => m.type === 'video').length} Videos)
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Material' : 'Add New Material'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={formData.subject_id} onValueChange={(value) => setFormData({...formData, subject_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.board} - {subject.class_name} - {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subjects.length === 0 && (
                <p className="text-xs text-orange-600">⚠️ Please add subjects first in the Subjects tab</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
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
                placeholder="Main Concept Clearing Notes"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {formData.type === 'pdf' ? 'Google Drive Link' : 'Bunny.net Stream Link'}
              </label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                placeholder={formData.type === 'pdf' 
                  ? 'https://drive.google.com/file/d/FILE_ID/view' 
                  : 'https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID'}
                required
              />
              {formData.type === 'pdf' ? (
                <div className="text-xs space-y-1">
                  <p className="text-gray-500">
                    📋 Paste any Google Drive share link - it will be auto-converted for embedding
                  </p>
                  <p className="text-blue-600">
                    ⚠️ Make sure the file is shared as "Anyone with the link can view"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Paste Bunny.net iframe embed link
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the material"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              {isEditMode ? 'Update Material' : 'Add Material'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MaterialsTab;
