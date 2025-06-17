import React, { useState } from 'react';
import { Plus, Move, Settings, Trash2, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Section } from '@/types';
import { SECTION_TYPES } from '@/lib/constants';

interface VisualBuilderProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

export const VisualBuilder: React.FC<VisualBuilderProps> = ({
  sections,
  onSectionsChange
}) => {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState({
    type: 'hero' as Section['type'],
    title: '',
    content: ''
  });
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleAddSection = () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      const section: Section = {
        id: Math.random().toString(36).substr(2, 9),
        type: newSection.type,
        title: newSection.title,
        content: newSection.content,
        order: sections.length + 1
      };
      onSectionsChange([...sections, section]);
      setNewSection({ type: 'hero', title: '', content: '' });
      setIsAddSectionModalOpen(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
  };

  const handleUpdateSection = () => {
    if (editingSection) {
      const updatedSections = sections.map(section =>
        section.id === editingSection.id ? editingSection : section
      );
      onSectionsChange(updatedSections);
      setEditingSection(null);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
  };

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      onSectionsChange(newSections);
    }
  };

  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      onSectionsChange(newSections);
    }
  };

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-md';
      default: return 'max-w-4xl';
    }
  };

  const sectionOptions = SECTION_TYPES.map(type => ({
    value: type.id,
    label: `${type.icon} ${type.name}`
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visual Builder</h2>
          <p className="text-gray-600 mt-1">Drag and drop to build your website</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-sm capitalize ${
                  viewMode === mode
                    ? 'bg-primary-red text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <Button onClick={() => setIsAddSectionModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No sections yet. Add your first section to get started.
                  </p>
                ) : (
                  sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-red transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {SECTION_TYPES.find(t => t.id === section.type)?.icon}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{section.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{section.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveSectionUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSectionDown(index)}
                          disabled={index === sections.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-1 text-gray-400 hover:text-primary-red"
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview ({viewMode})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg min-h-96">
                <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getViewportWidth()}`}>
                  {sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                      <Code className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building</h3>
                      <p className="text-gray-600 text-center">
                        Add sections to see your website come to life in real-time
                      </p>
                    </div>
                  ) : (
                    sections.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 last:border-b-0">
                        {section.type === 'hero' && (
                          <div className="bg-gradient-to-r from-primary-red to-primary-pink text-white py-16 px-6">
                            <div className="max-w-4xl mx-auto text-center">
                              <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
                              <p className="text-lg opacity-90">
                                {typeof section.content === 'string' ? section.content : 'Welcome to our website'}
                              </p>
                              <button className="mt-6 bg-white text-primary-red px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                Get Started
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'about' && (
                          <div className="py-12 px-6">
                            <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                              <p className="text-lg text-gray-600 leading-relaxed">
                                {typeof section.content === 'string' ? section.content : 'About our company and services'}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'services' && (
                          <div className="py-12 px-6 bg-gray-50">
                            <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{section.title}</h2>
                              <p className="text-lg text-gray-600 text-center mb-8">
                                {typeof section.content === 'string' ? section.content : 'Our professional services'}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="w-12 h-12 bg-primary-red rounded-lg mb-4"></div>
                                    <h3 className="font-semibold mb-2">Service {i}</h3>
                                    <p className="text-gray-600 text-sm">Service description here</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'contact' && (
                          <div className="py-12 px-6">
                            <div className="max-w-2xl mx-auto">
                              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{section.title}</h2>
                              <p className="text-lg text-gray-600 text-center mb-8">
                                {typeof section.content === 'string' ? section.content : 'Get in touch with us'}
                              </p>
                              <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input placeholder="Name" className="p-3 border border-gray-300 rounded-lg" />
                                  <input placeholder="Email" className="p-3 border border-gray-300 rounded-lg" />
                                </div>
                                <textarea placeholder="Message" rows={4} className="w-full mt-4 p-3 border border-gray-300 rounded-lg"></textarea>
                                <button className="mt-4 bg-primary-red text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-pink transition-colors">
                                  Send Message
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'faq' && (
                          <div className="py-12 px-6 bg-gray-50">
                            <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{section.title}</h2>
                              <p className="text-lg text-gray-600 text-center mb-8">
                                {typeof section.content === 'string' ? section.content : 'Frequently asked questions'}
                              </p>
                              <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-2">Question {i}?</h3>
                                    <p className="text-gray-600 text-sm">Answer to frequently asked question</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'testimonials' && (
                          <div className="py-12 px-6">
                            <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{section.title}</h2>
                              <p className="text-lg text-gray-600 text-center mb-8">
                                {typeof section.content === 'string' ? section.content : 'What our clients say'}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                  <div key={i} className="bg-gray-50 p-6 rounded-lg">
                                    <p className="text-gray-600 mb-4">"Great service and amazing results!"</p>
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 bg-primary-red rounded-full mr-3"></div>
                                      <div>
                                        <p className="font-semibold">Customer {i}</p>
                                        <p className="text-sm text-gray-500">Company Name</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Add New Section"
      >
        <div className="space-y-4">
          <Select
            label="Section Type"
            value={newSection.type}
            onChange={(e) => setNewSection({ ...newSection, type: e.target.value as Section['type'] })}
            options={sectionOptions}
          />
          <Input
            label="Section Title"
            value={newSection.title}
            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
            placeholder="Enter section title"
          />
          <Textarea
            label="Section Content"
            value={newSection.content}
            onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
            placeholder="Enter section content"
            rows={4}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsAddSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection}>
              Add Section
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        title="Edit Section"
      >
        {editingSection && (
          <div className="space-y-4">
            <Select
              label="Section Type"
              value={editingSection.type}
              onChange={(e) => setEditingSection({ ...editingSection, type: e.target.value as Section['type'] })}
              options={sectionOptions}
            />
            <Input
              label="Section Title"
              value={editingSection.title}
              onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
              placeholder="Enter section title"
            />
            <Textarea
              label="Section Content"
              value={editingSection.content}
              onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
              placeholder="Enter section content"
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditingSection(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSection}>
                Update Section
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};