import React, { useState } from 'react';
import { Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ModelSelector } from './ModelSelector';
import { AIService } from '@/lib/ai-services';
import { AIModel, GeneratedContent } from '@/types';
import { AI_MODELS, WEBSITE_TEMPLATES } from '@/lib/constants';
import toast from 'react-hot-toast';

interface ContentGeneratorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  onContentGenerated: (content: GeneratedContent) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  selectedModel,
  onModelChange,
  onContentGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your website');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await AIService.generateWebsiteContent(prompt, selectedModel);
      setGeneratedContent(content);
      onContentGenerated(content);
      toast.success('Website content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (generatedContent) {
      setIsGenerating(true);
      try {
        const content = await AIService.generateWebsiteContent(prompt, selectedModel);
        setGeneratedContent(content);
        onContentGenerated(content);
        toast.success('Content regenerated successfully!');
      } catch (error) {
        toast.error('Failed to regenerate content. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const templateOptions = WEBSITE_TEMPLATES.map(template => ({
    value: template.toLowerCase().replace(/\s+/g, '-'),
    label: template
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Website Generator</h2>
        <p className="text-gray-600">Describe your website and let AI create it for you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-primary-red" />
                Website Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Website Template (Optional)"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                options={templateOptions}
                placeholder="Choose a template or describe from scratch"
              />
              
              <Textarea
                label="Describe Your Website"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modern portfolio website for a freelance graphic designer with a dark theme, showcasing creative projects and client testimonials..."
                rows={6}
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Website
                </Button>
                
                {generatedContent && (
                  <Button 
                    variant="outline"
                    onClick={handleRegenerate}
                    isLoading={isGenerating}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-primary-red">
                    {generatedContent.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{generatedContent.description}</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Sections Generated:</h4>
                  {generatedContent.sections?.map((section) => (
                    <div key={section.id} className="border-l-4 border-primary-red pl-4">
                      <h5 className="font-medium capitalize">{section.type}: {section.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {typeof section.content === 'string' 
                          ? section.content 
                          : typeof section.content === 'object'
                          ? JSON.stringify(section.content)
                          : 'Content generated'}
                      </p>
                    </div>
                  ))}
                </div>

                {generatedContent.seo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">SEO Optimization</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Title:</span> {generatedContent.seo.title}</p>
                      <p><span className="font-medium">Description:</span> {generatedContent.seo.description}</p>
                      <p><span className="font-medium">Keywords:</span> {generatedContent.seo.keywords.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />
        </div>
      </div>
    </div>
  );
};