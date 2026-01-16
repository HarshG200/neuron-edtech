import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Video, Eye, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Footer from '../components/Footer';

const Watermark = ({ email }) => {
  return (
    <div className="watermark">
      {email}
    </div>
  );
};

const MaterialViewer = () => {
  const { user } = React.useContext(AuthContext);
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, [subjectId]);

  useEffect(() => {
    // Disable right-click on the entire page when viewing materials
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error('Right-click is disabled for security');
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Disable: Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source), 
      // F12 (DevTools), Ctrl+Shift+I (DevTools), Ctrl+Shift+C (Inspect), Ctrl+Shift+J (Console)
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j'))
      ) {
        e.preventDefault();
        toast.error('This action is disabled for security');
        return false;
      }
    };

    // Disable text selection on protected content
    const handleSelectStart = (e) => {
      if (selectedMaterial) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag on protected content
    const handleDragStart = (e) => {
      if (selectedMaterial) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy
    const handleCopy = (e) => {
      if (selectedMaterial) {
        e.preventDefault();
        toast.error('Copying is disabled for security');
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
    };
  }, [selectedMaterial]);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/materials/${subjectId}`);
      setMaterials(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load materials');
      if (error.response?.status === 403) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const pdfMaterials = materials.filter((m) => m.type === 'pdf');
  const videoMaterials = materials.filter((m) => m.type === 'video');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Button
          data-testid="back-button"
          variant="ghost"
          onClick={() => {
            setSelectedMaterial(null);
            navigate('/dashboard');
          }}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {!selectedMaterial ? (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Study <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Materials</span>
              </h1>
              <p className="text-gray-600">Access your PDFs and video lectures</p>
            </div>

            <Tabs defaultValue="pdf" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="pdf" data-testid="pdf-tab">
                  <FileText className="w-4 h-4 mr-2" />
                  PDFs ({pdfMaterials.length})
                </TabsTrigger>
                <TabsTrigger value="video" data-testid="video-tab">
                  <Video className="w-4 h-4 mr-2" />
                  Videos ({videoMaterials.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pdf">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pdfMaterials.map((material) => (
                    <Card
                      key={material.id}
                      data-testid={`pdf-card-${material.id}`}
                      className="card-hover shadow-lg border-0 group"
                    >
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      <CardHeader>
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          data-testid={`view-pdf-button-${material.id}`}
                          onClick={() => setSelectedMaterial(material)}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="video">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoMaterials.map((material) => (
                    <Card
                      key={material.id}
                      data-testid={`video-card-${material.id}`}
                      className="card-hover shadow-lg border-0 group"
                    >
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <CardHeader>
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                          <Video className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          data-testid={`view-video-button-${material.id}`}
                          onClick={() => setSelectedMaterial(material)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMaterial.title}</h2>
                <p className="text-gray-600">{selectedMaterial.description}</p>
              </div>
              <Button
                data-testid="close-viewer-button"
                variant="outline"
                onClick={() => setSelectedMaterial(null)}
              >
                Close
              </Button>
            </div>

            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0 relative protected-content" data-testid="material-viewer">
                <Watermark email={user.email} />
                {selectedMaterial.type === 'pdf' ? (
                  <iframe
                    src={selectedMaterial.link}
                    className="w-full h-[80vh]"
                    title={selectedMaterial.title}
                    frameBorder="0"
                  />
                ) : (
                  <div className="relative">
                    <iframe
                      src={selectedMaterial.link}
                      className="w-full h-[80vh]"
                      title={selectedMaterial.title}
                      frameBorder="0"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    This content is protected. Downloading, screen recording, and sharing are strictly prohibited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MaterialViewer;
