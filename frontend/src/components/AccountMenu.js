import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, FileText, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AuthContext } from '../App';

const AccountMenu = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="account-menu-trigger"
          className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <Avatar className="h-9 w-9 ring-2 ring-blue-100 rounded-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-sm rounded-lg">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-gray-900" data-testid="account-menu-name">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500">{user?.city}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-xl">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid="account-menu-settings"
          onClick={() => navigate('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="account-menu-my-plans"
          onClick={() => navigate('/my-plans')}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>My Plans</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid="account-menu-logout"
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
