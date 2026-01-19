import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Bell, X, FileText, Video, Megaphone, ExternalLink, Pin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const UpdatesDrawer = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/updates`);
      setUpdates(response.data);
      
      // Check if there are any updates from the last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const newUpdates = response.data.filter(u => new Date(u.created_at) > oneDayAgo);
      setHasNew(newUpdates.length > 0);
    } catch (error) {
      console.error('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'free_pdf':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'free_video':
        return <Video className="w-4 h-4 text-purple-500" />;
      default:
        return <Megaphone className="w-4 h-4 text-orange-500" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'free_pdf':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Free PDF</Badge>;
      case 'free_video':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">Free Video</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">Announcement</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // Sort updates: pinned first, then by date
  const sortedUpdates = [...updates].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          data-testid="updates-toggle"
        >
          <Bell className="w-5 h-5" />
          {hasNew && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <SheetTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            Updates & Free Resources
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Megaphone className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">No updates yet</p>
              <p className="text-sm text-center mt-1">Check back later for announcements and free resources</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sortedUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    update.is_pinned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        update.type === 'free_pdf' ? 'bg-blue-100' :
                        update.type === 'free_video' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        {getTypeIcon(update.type)}
                      </div>
                      <span className="font-semibold text-gray-900 truncate">{update.title}</span>
                    </div>
                    {update.is_pinned && (
                      <Pin className="w-4 h-4 text-yellow-600 flex-shrink-0 fill-yellow-600" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 ml-10">
                    {update.description}
                  </p>
                  
                  <div className="flex items-center justify-between ml-10">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(update.type)}
                      <span className="text-xs text-gray-400">{formatDate(update.created_at)}</span>
                    </div>
                    
                    {update.link && (
                      <a
                        href={update.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default UpdatesDrawer;
