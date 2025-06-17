'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-3">
      {/* User Info Display */}
      <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
        <div className="w-10 h-10 bg-primary-red rounded-full flex items-center justify-center flex-shrink-0">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={displayName} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-sm">
              {userInitials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* ONLY ONE LOGOUT BUTTON */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  );
};