'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { ContentGenerator } from '@/components/dashboard/ContentGenerator';
import { VisualBuilder } from '@/components/dashboard/VisualBuilder';
import { ImageGenerator } from '@/components/dashboard/ImageGenerator';
import { SEOOptimizer } from '@/components/dashboard/SEOOptimizer';
import { PreviewPanel } from '@/components/dashboard/PreviewPanel';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Project, AIModel, GeneratedContent, Section } from '@/types';
import { AI_MODELS } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../public/images/logo.svg'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentSections, setCurrentSections] = useState<Section[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProjects([newProject, ...projects]);
    toast.success('Project created successfully!');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    toast.success('Project deleted');
  };

  const handleEditProject = (updatedProject: Project) => {
    setProjects(projects.map(project => 
      project.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date() }
        : project
    ));
    toast.success('Project updated successfully!');
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    if (content.sections) {
      setCurrentSections(content.sections);
    }
    setActiveTab('builder');
    // Close mobile sidebar when navigating
    setIsMobileSidebarOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close mobile sidebar when navigating
    setIsMobileSidebarOpen(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectList
            projects={projects}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
          />
        );
      case 'generator':
        return (
          <ContentGenerator
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onContentGenerated={handleContentGenerated}
          />
        );
      case 'builder':
        return (
          <VisualBuilder
            sections={currentSections}
            onSectionsChange={setCurrentSections}
          />
        );
      case 'images':
        return <ImageGenerator />;
      case 'seo':
        return <SEOOptimizer />;
      case 'preview':
        return <PreviewPanel sections={currentSections} />;
      case 'assistant':
        return <AIAssistant selectedModel={selectedModel} />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-sm md:text-base text-gray-600">Configure your AI Website Builder preferences</p>
            </div>
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groq API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Groq API key"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your OpenAI API key"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anthropic API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Anthropic API key"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hugging Face API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Hugging Face API key"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                  />
                </div>
                <button className="w-full md:w-auto bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-pink transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <ProjectList projects={projects} onCreateProject={handleCreateProject} onDeleteProject={handleDeleteProject} onEditProject={handleEditProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary-black text-white p-4 z-30 flex items-center justify-between">
        <div>
          <img src={logo.src} alt="" className='h-12 mx-auto'/>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 lg:z-10
        transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <SidebarNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isMobile={isMobileSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1  overflow-auto pt-16 lg:pt-0">
        <div className="p-4 md:p-6">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}