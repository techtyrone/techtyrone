export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  url?: string;
  preview?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'groq';
  description: string;
}

export interface GeneratedContent {
  title?: string;
  description?: string;
  sections?: Section[];
  seo?: SEOData;
}

export interface Section {
  id: string;
  type: 'hero' | 'about' | 'services' | 'contact' | 'faq' | 'testimonials';
  title: string;
  content: string;
  order: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'minimal' | 'modern';
  size?: '512x512' | '1024x1024' | '1024x512';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  generatedAt: Date;
}