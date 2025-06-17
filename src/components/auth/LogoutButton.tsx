'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export const LogoutButton: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
      setShowConfirmation(false);
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to logout? You'll need to sign in again to access the dashboard.</p>
          
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout}
              isLoading={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};