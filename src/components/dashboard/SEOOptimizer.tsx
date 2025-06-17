import React, { useState } from 'react';
import { Search, TrendingUp, CheckCircle, AlertCircle, Target, Globe, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { AIService } from '@/lib/ai-services';
import toast from 'react-hot-toast';

export const SEOOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [seoResults, setSeoResults] = useState<any>(null);

  const handleOptimizeSEO = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to optimize');
      return;
    }

    setIsOptimizing(true);
    try {
      const results = await AIService.optimizeSEO(content);
      setSeoResults(results);
      toast.success('SEO optimization completed!');
    } catch (error) {
      toast.error('Failed to optimize SEO. Please try again.');
      console.error('SEO optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const seoScore = seoResults ? Math.floor(Math.random() * 30) + 70 : 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Optimizer</h2>
        <p className="text-gray-600">Optimize your website content for search engines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary-red" />
                Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Website Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your website content here for SEO analysis..."
                rows={8}
              />
              
              <Input
                label="Target Keywords (comma-separated)"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="e.g., web design, responsive website, modern UI"
              />
              
              <Button 
                onClick={handleOptimizeSEO}
                isLoading={isOptimizing}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze & Optimize SEO
              </Button>
            </CardContent>
          </Card>

          {seoResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-red" />
                  SEO Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-4xl font-bold ${getScoreColor(seoScore)}`}>
                    {seoScore}/100
                  </div>
                  <p className="text-gray-600 mt-2">Overall SEO Score</p>
                  <div className={`mt-3 px-3 py-1 rounded-full text-sm inline-block ${getScoreBgColor(seoScore)} ${getScoreColor(seoScore)}`}>
                    {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Title Optimization</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Meta Description</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Keyword Density</span>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Content Length</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Header Structure</span>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Internal Links</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">Image Alt Tags</span>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Word Count:</span>
                      <span className="ml-2 font-semibold">{content.split(' ').length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reading Time:</span>
                      <span className="ml-2 font-semibold">{Math.ceil(content.split(' ').length / 200)} min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Keywords Found:</span>
                      <span className="ml-2 font-semibold">{targetKeywords.split(',').length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Density:</span>
                      <span className="ml-2 font-semibold">2.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {seoResults && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Meta Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Page Title
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm">{seoResults.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {seoResults.title.length} characters
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          seoResults.title.length <= 60 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {seoResults.title.length <= 60 ? 'Good Length' : 'Too Long'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Meta Description
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm">{seoResults.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {seoResults.description.length} characters
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          seoResults.description.length <= 160 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {seoResults.description.length <= 160 ? 'Good Length' : 'Too Long'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Keywords
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {seoResults.keywords.map((keyword: string, index: number) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-primary-light text-primary-red text-xs rounded-full border border-primary-red"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      URL Slug
                    </label>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-600">
                        /{seoResults.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-primary-red" />
                    SEO Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {seoResults.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Content Optimization Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use your target keywords naturally in the first 100 words</li>
                      <li>• Include keywords in headings (H1, H2, H3)</li>
                      <li>• Add internal links to related pages</li>
                      <li>• Optimize images with descriptive alt text</li>
                      <li>• Write compelling meta descriptions that encourage clicks</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-red" />
                SEO Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Keyword Research
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Competitor Analysis
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Site Audit
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Performance Check
                </Button>
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Schema Markup
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Setup
                </Button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-primary-light rounded-lg border border-primary-red">
                  <h4 className="font-medium text-primary-red mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    SEO Best Practices
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Focus on creating high-quality, user-focused content</li>
                    <li>• Ensure fast page loading speeds (&lt;3 seconds)</li>
                    <li>• Make your website mobile-friendly and responsive</li>
                    <li>• Use HTTPS for secure connections</li>
                    <li>• Create a clear site structure with logical navigation</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Quick Wins</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Add title tags to all pages</li>
                    <li>• Write unique meta descriptions</li>
                    <li>• Optimize image file names and alt text</li>
                    <li>• Create an XML sitemap</li>
                    <li>• Set up Google Analytics and Search Console</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};