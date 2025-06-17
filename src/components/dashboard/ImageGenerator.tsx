import React, { useState } from 'react';
import { Image, Download, RefreshCw, Sparkles, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AIService } from '@/lib/ai-services';
import { ImageGenerationRequest, GeneratedImage } from '@/types';
import { IMAGE_STYLES } from '@/lib/constants';
import toast from 'react-hot-toast';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedSize, setSelectedSize] = useState('1024x512');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your image');
      return;
    }

    setIsGenerating(true);
    try {
      const request: ImageGenerationRequest = {
        prompt,
        style: selectedStyle as any,
        size: selectedSize as any
      };
      
      const image = await AIService.generateImage(request);
      setGeneratedImages([image, ...generatedImages]);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
      console.error('Image generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (imagePrompt: string) => {
    navigator.clipboard.writeText(imagePrompt);
    toast.success('Prompt copied to clipboard!');
  };

  const handleDownloadImage = (imageUrl: string, prompt: string) => {
    // Mock download functionality
    toast.success('Download started!');
  };

  const styleOptions = IMAGE_STYLES.map(style => ({
    value: style.id,
    label: style.name
  }));

  const sizeOptions = [
    { value: '512x512', label: 'Square (512x512)' },
    { value: '1024x512', label: 'Wide (1024x512)' },
    { value: '1024x1024', label: 'Large Square (1024x1024)' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Website images</h2>
        <p className="text-gray-600">Create stunning images for your website using Hugging Face AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary-red" />
                Image Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Image Description"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Modern minimalist hero image with abstract geometric shapes"
              />
              
              <Select
                label="Style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                options={styleOptions}
              />
              
              <Select
                label="Size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                options={sizeOptions}
              />
              
              <div className="bg-primary-light rounded-lg p-4">
                <h4 className="font-medium text-primary-red mb-2">Selected Style:</h4>
                <p className="text-sm text-gray-700">
                  {IMAGE_STYLES.find(s => s.id === selectedStyle)?.description}
                </p>
              </div>
              
              <Button 
                onClick={handleGenerateImage}
                isLoading={isGenerating}
                className="w-full"
              >
                <Image className="w-4 h-4 mr-2" />
                Generate Image
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Modern tech startup hero background',
                  'Elegant portfolio header image',
                  'Abstract business presentation background',
                  'Minimalist website banner design',
                  'Creative agency hero section image'
                ].map((quickPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(quickPrompt)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="loading-dots mx-auto mb-4">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p className="text-gray-600">Generating your image...</p>
                  </div>
                </div>
              )}
              
              {generatedImages.length === 0 && !isGenerating && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Image className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images generated yet</h3>
                  <p className="text-gray-600 text-center">
                    Enter a description and generate your first AI image
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownloadImage(image.url, image.prompt)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPrompt(image.prompt)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white">
                      <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 capitalize">{image.style}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(image.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};