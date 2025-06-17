import React, { useState } from 'react';
import { Plus, Globe, Edit3, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';

interface ProjectListProps {
  projects: Project[];
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onCreateProject,
  onDeleteProject,
  onEditProject
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'draft' as const
  });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      onCreateProject(newProject);
      setNewProject({ name: '', description: '', status: 'draft' });
      setIsCreateModalOpen(false);
    }
  };

  const handlePublish = (project: Project) => {
    const publishedProject = {
      ...project,
      status: 'published' as const,
      url: `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.techtorone.com`
    };
    onEditProject(publishedProject);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600 mt-1">Manage your AI-generated websites</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first AI-powered website to get started
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="text-xs text-gray-500 mb-4">
                  <p>Created: {formatDate(project.createdAt)}</p>
                  <p>Updated: {formatDate(project.updatedAt)}</p>
                  {project.url && (
                    <p className="flex items-center mt-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      <a href={project.url} target="_blank" rel="noopener noreferrer" 
                         className="text-primary-red hover:underline">
                        View Live
                      </a>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEditProject(project)}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  
                  {project.status === 'draft' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handlePublish(project)}
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      Publish
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Clone
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            placeholder="My Awesome Website"
          />
          <Textarea
            label="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Describe your website project..."
            rows={3}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};