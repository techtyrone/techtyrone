import React from 'react';
import {
  Home,
  Zap,
  Image,
  Search,
  MessageSquare,
  Settings,
  Eye,
  Folder,
  LogOut
} from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../../public/images/logo.svg';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'generator', label: 'AI Generator', icon: Zap },
  { id: 'builder', label: 'Visual Builder', icon: Home },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'seo', label: 'SEO Tools', icon: Search },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, onTabChange }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="w-64 bg-primary-black text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className=" border-b border-gray-800 flex-shrink-0">
        <img src={logo.src} alt="Techtyrone Logo" className="h-24 mx-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                    activeTab === item.id
                      ? 'bg-primary-red text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-[1.01]'
                  }`}
                  type="button"
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <UserMenu />

        {/* Help Section */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-light">Need Help?</h3>
          <p className="text-xs text-gray-400 mt-1">
            Check our documentation or contact support
          </p>
        </div>
      </div>
    </div>
  );
};