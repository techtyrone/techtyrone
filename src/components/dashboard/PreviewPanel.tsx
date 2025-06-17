import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, Code, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Section } from '@/types';
import toast from 'react-hot-toast';

interface PreviewPanelProps {
  sections: Section[];
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ sections }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const getViewportSize = () => {
    switch (viewMode) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '800px' };
    }
  };

  const handleExport = (format: 'html' | 'json') => {
    // Mock export functionality
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  const handlePublish = () => {
    // Mock publish functionality
    const subdomain = `website-${Date.now()}`;
    toast.success(`Publishing to ${subdomain}.techtorone.com...`);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(45deg, #CF0F47, #FF0B55); color: white; padding: 80px 0; text-align: center; }
        .section { padding: 60px 0; }
        .bg-light { background-color: #f8f9fa; }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        h2 { font-size: 2rem; margin-bottom: 1rem; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #CF0F47; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
${sections.map(section => {
  if (section.type === 'hero') {
    return `    <section class="hero">
        <div class="container">
            <h1>${section.title}</h1>
            <p>${section.content}</p>
            <a href="#" class="btn">Get Started</a>
        </div>
    </section>`;
  }
  return `    <section class="section ${section.type === 'services' ? 'bg-light' : ''}">
        <div class="container">
            <h2>${section.title}</h2>
            <p>${section.content}</p>
        </div>
    </section>`;
}).join('\n')}
</body>
</html>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Preview</h2>
          <p className="text-gray-600 mt-1">Preview your website across different devices</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="w-4 h-4 mr-2" />
            {showCode ? 'Hide' : 'Show'} Code
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('html')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export HTML
          </Button>
          <Button onClick={handlePublish}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Publish Live
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Live Preview</CardTitle>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {[
                { mode: 'desktop' as const, icon: Monitor },
                { mode: 'tablet' as const, icon: Tablet },
                { mode: 'mobile' as const, icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 ${
                    viewMode === mode
                      ? 'bg-primary-red text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div 
              className="bg-white rounded-lg shadow-lg mx-auto transition-all duration-300 overflow-hidden"
              style={getViewportSize()}
            >
              <div className="h-full overflow-y-auto">
                {sections.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Yet</h3>
                      <p className="text-gray-600">Add sections to see your website preview</p>
                    </div>
                  </div>
                ) : (
                  sections.map((section) => (
                    <div key={section.id}>
                      {section.type === 'hero' && (
                        <div className="bg-gradient-to-r from-primary-red to-primary-pink text-white py-20 px-6 text-center">
                          <h1 className="text-4xl md:text-5xl font-bold mb-4">{section.title}</h1>
                          <p className="text-xl mb-6 opacity-90">{section.content}</p>
                          <button className="bg-white text-primary-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'about' && (
                        <div className="py-16 px-6">
                          <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">{section.content}</p>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'services' && (
                        <div className="py-16 px-6 bg-gray-50">
                          <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{section.title}</h2>
                            <p className="text-lg text-gray-600 text-center mb-12">{section.content}</p>
                            <div className="grid md:grid-cols-3 gap-8">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white p-8 rounded-lg shadow-sm text-center">
                                  <div className="w-16 h-16 bg-primary-red rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">{i}</span>
                                  </div>
                                  <h3 className="text-xl font-semibold mb-3">Service {i}</h3>
                                  <p className="text-gray-600">Professional service description that highlights key benefits.</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'contact' && (
                        <div className="py-16 px-6">
                          <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{section.title}</h2>
                            <p className="text-lg text-gray-600 text-center mb-8">{section.content}</p>
                            <div className="bg-gray-50 p-8 rounded-lg">
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input placeholder="Your Name" className="p-3 border border-gray-300 rounded-lg" />
                                <input placeholder="Email Address" className="p-3 border border-gray-300 rounded-lg" />
                              </div>
                              <textarea placeholder="Your Message" rows={4} className="w-full p-3 border border-gray-300 rounded-lg mb-4"></textarea>
                              <button className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-primary-pink transition-colors">
                                Send Message
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <span className="text-sm text-gray-500">
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Preview
              {viewMode !== 'desktop' && ` (${getViewportSize().width})`}
            </span>
          </div>
        </CardContent>
      </Card>

      {showCode && (
        <Card>
          <CardHeader>
            <CardTitle>Generated HTML Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{generateHTML()}</code>
              </pre>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(generateHTML())}
              >
                Copy HTML
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('json')}
              >
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};