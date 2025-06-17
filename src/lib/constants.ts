import { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'groq-llama',
    name: 'Groq AI (Llama 4 Scout)',
    provider: 'groq',
    description: 'Ultra-fast AI model by Groq with Llama architecture'
  },
  {
    id: 'groq-mixtral',
    name: 'Groq Mixtral 8x7B',
    provider: 'groq',
    description: 'High-performance mixture of experts model'
  },
  {
    id: 'gpt-4',
    name: 'ChatGPT 4',
    provider: 'openai',
    description: 'Advanced language model by OpenAI'
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    description: 'Smart, efficient model by Anthropic'
  }
];

export const WEBSITE_TEMPLATES = [
  'Portfolio Site',
  'Business Landing Page',
  'Blog Website',
  'E-commerce Store',
  'Agency Website',
  'Restaurant Website',
  'Personal Brand',
  'SaaS Landing Page',
  'Tech Startup',
  'Creative Studio',
  'Consulting Firm',
  'Educational Platform'
];

export const SECTION_TYPES = [
  { id: 'hero', name: 'Hero Section', icon: '🚀' },
  { id: 'about', name: 'About Section', icon: '👋' },
  { id: 'services', name: 'Services Section', icon: '⚡' },
  { id: 'contact', name: 'Contact Section', icon: '📞' },
  { id: 'faq', name: 'FAQ Section', icon: '❓' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
  { id: 'features', name: 'Features', icon: '✨' },
  { id: 'pricing', name: 'Pricing', icon: '💰' },
  { id: 'team', name: 'Team', icon: '👥' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨' }
];

export const IMAGE_STYLES = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant aesthetics' },
  { id: 'artistic', name: 'Artistic', description: 'Creative and expressive visuals' },
  { id: 'realistic', name: 'Realistic', description: 'Photo-realistic images' },
  { id: 'abstract', name: 'Abstract', description: 'Geometric and conceptual designs' },
  { id: 'professional', name: 'Professional', description: 'Business-oriented imagery' }
];

export const GROQ_MODELS = {
  'llama-4-scout': 'meta-llama/llama-4-scout-17b-16e-instruct',
  'mixtral-8x7b': 'mixtral-8x7b-32768',
  'gemma-7b': 'gemma-7b-it',
  'llama-70b': 'llama2-70b-4096'
};