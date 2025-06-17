import axios from 'axios';
import { GeneratedContent, AIModel, ImageGenerationRequest, GeneratedImage } from '@/types';

// API Configuration
const API_CONFIG = {
  GROQ: {
    baseURL: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: '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',
    models: {
      'groq-llama': 'meta-llama/llama-4-scout-17b-16e-instruct',
      'groq-mixtral': 'mixtral-8x7b-32768',
      'groq-gemma': 'gemma-7b-it'
    }
  },
  OPENAI: {
    baseURL: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    model: 'gpt-4'
  },
  ANTHROPIC: {
    baseURL: 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
    model: 'claude-3-sonnet-20240229'
  },
  HUGGINGFACE: {
    baseURL: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ''
  }
};

export class AIService {
  static async generateWebsiteContent(
    prompt: string,
    model: AIModel
  ): Promise<GeneratedContent> {
    try {
      let response;

      if (model.provider === 'groq') {
        // Import the enhanced prompts
        const { GROQ_PROMPTS } = await import('@/lib/groq-prompts');
        const enhancedPrompt = GROQ_PROMPTS.websiteGeneration(prompt);
        
        response = await this.callGroqAPI(enhancedPrompt, model);
      } else if (model.provider === 'openai') {
        response = await this.callOpenAI(prompt, model);
      } else if (model.provider === 'anthropic') {
        response = await this.callAnthropic(prompt, model);
      }

      // Parse the AI response and structure it
      const content = this.parseWebsiteContent(response, prompt);
      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate website content');
    }
  }

  static async callGroqAPI(prompt: string, model: AIModel): Promise<string> {
    try {
      const response = await axios.post(
        API_CONFIG.GROQ.baseURL,
        {
          model: API_CONFIG.GROQ.models['groq-llama'] || 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an expert web developer and content creator. Create professional, engaging website content that converts visitors into customers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.GROQ.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error);
      throw new Error('Failed to call Groq API');
    }
  }

  static async callOpenAI(prompt: string, model: AIModel): Promise<string> {
    if (!API_CONFIG.OPENAI.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        API_CONFIG.OPENAI.baseURL,
        {
          model: API_CONFIG.OPENAI.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert web developer and content creator.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.OPENAI.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to call OpenAI API');
    }
  }

  static async callAnthropic(prompt: string, model: AIModel): Promise<string> {
    if (!API_CONFIG.ANTHROPIC.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await axios.post(
        API_CONFIG.ANTHROPIC.baseURL,
        {
          model: API_CONFIG.ANTHROPIC.model,
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_CONFIG.ANTHROPIC.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error('Failed to call Anthropic API');
    }
  }

  static parseWebsiteContent(aiResponse: string, originalPrompt: string): GeneratedContent {
    try {
      // Try to parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.title && parsed.sections) {
          // Ensure all sections have string content
          const validSections = parsed.sections.map((section: any, index: number) => ({
            id: section.id || `section-${index + 1}`,
            type: section.type || 'about',
            title: typeof section.title === 'string' ? section.title : 'Section Title',
            content: typeof section.content === 'string' ? section.content : 
                    typeof section.content === 'object' ? this.extractTextFromObject(section.content) : 'Section content',
            order: section.order || index + 1
          }));
          
          return {
            ...parsed,
            sections: validSections
          };
        }
      }
    } catch (e) {
      console.log('JSON parsing failed, using smart content generation');
    }

    // Enhanced fallback: Create realistic content based on the prompt
    return this.generateRealisticContent(originalPrompt, aiResponse);
  }

  static extractTextFromObject(contentObj: any): string {
    if (!contentObj) return 'Content not available';
    
    // Handle common object patterns
    if (contentObj.heading && contentObj.subheading) {
      return `${contentObj.heading}. ${contentObj.subheading}${contentObj.cta ? ` ${contentObj.cta}` : ''}`;
    }
    
    if (contentObj.text) return contentObj.text;
    if (contentObj.content) return contentObj.content;
    if (contentObj.description) return contentObj.description;
    
    // Extract all string values
    const textValues = Object.values(contentObj)
      .filter(value => typeof value === 'string' && value.length > 0)
      .join('. ');
    
    return textValues || 'Generated content';
  }

  static generateRealisticContent(prompt: string, aiResponse: string): GeneratedContent {
    const promptLower = prompt.toLowerCase();
    
    // Analyze the prompt to determine business type
    const businessType = this.detectBusinessType(promptLower);
    const templates = this.getContentTemplates(businessType, prompt);
    
    // Extract any meaningful content from AI response
    const lines = aiResponse.split('\n').filter(line => line.trim());
    const meaningfulContent = lines.filter(line => 
      line.length > 30 && 
      !line.includes('{') && 
      !line.includes('}') &&
      !line.includes('title') &&
      !line.startsWith('#')
    );

    return {
      title: templates.title,
      description: templates.description,
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          title: templates.hero.title,
          content: meaningfulContent[0] || templates.hero.content,
          order: 1
        },
        {
          id: 'about-2',
          type: 'about',
          title: templates.about.title,
          content: meaningfulContent[1] || templates.about.content,
          order: 2
        },
        {
          id: 'services-3',
          type: 'services',
          title: templates.services.title,
          content: meaningfulContent[2] || templates.services.content,
          order: 3
        },
        {
          id: 'contact-4',
          type: 'contact',
          title: templates.contact.title,
          content: templates.contact.content,
          order: 4
        }
      ],
      seo: {
        title: templates.seo.title,
        description: templates.seo.description,
        keywords: templates.seo.keywords,
        slug: prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
      }
    };
  }

  static detectBusinessType(prompt: string): string {
    const types = [
      { keywords: ['portfolio', 'designer', 'artist', 'creative', 'photographer'], type: 'portfolio' },
      { keywords: ['restaurant', 'food', 'cafe', 'dining', 'menu'], type: 'restaurant' },
      { keywords: ['agency', 'marketing', 'advertising', 'branding'], type: 'agency' },
      { keywords: ['tech', 'software', 'app', 'saas', 'startup'], type: 'tech' },
      { keywords: ['shop', 'store', 'ecommerce', 'products', 'sell'], type: 'ecommerce' },
      { keywords: ['consulting', 'business', 'professional', 'services'], type: 'consulting' },
      { keywords: ['fitness', 'gym', 'health', 'wellness', 'trainer'], type: 'fitness' },
      { keywords: ['blog', 'news', 'magazine', 'content'], type: 'blog' }
    ];

    for (const type of types) {
      if (type.keywords.some(keyword => prompt.includes(keyword))) {
        return type.type;
      }
    }
    return 'business';
  }

  static getContentTemplates(businessType: string, originalPrompt: string) {
    const templates = {
      portfolio: {
        title: `Creative Portfolio - ${originalPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
        description: 'Showcasing creative excellence through innovative design and artistic vision',
        hero: {
          title: 'Transforming Ideas into Visual Masterpieces',
          content: 'Welcome to my creative world where imagination meets expertise. I specialize in crafting unique visual experiences that tell compelling stories and captivate audiences. From concept to completion, every project is a journey of artistic discovery.'
        },
        about: {
          title: 'About My Creative Journey',
          content: 'With years of experience in creative design, I bring passion and precision to every project. My approach combines artistic vision with strategic thinking, ensuring that each piece not only looks stunning but also serves its intended purpose effectively.'
        },
        services: {
          title: 'Creative Services',
          content: 'I offer a comprehensive range of creative services including brand identity design, digital artwork, print materials, and visual storytelling. Each service is tailored to meet your unique needs and bring your vision to life.'
        },
        contact: {
          title: 'Let\'s Create Something Amazing',
          content: 'Ready to bring your creative vision to life? I\'d love to hear about your project and discuss how we can work together to create something truly exceptional.'
        },
        seo: {
          title: 'Creative Portfolio | Professional Design Services',
          description: 'Award-winning creative designer specializing in brand identity, digital art, and visual storytelling. Transform your ideas into stunning visual experiences.',
          keywords: ['creative design', 'portfolio', 'visual identity', 'graphic design', 'digital art']
        }
      },
      
      restaurant: {
        title: `${originalPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Culinary Excellence`,
        description: 'Experience exceptional dining with fresh ingredients and passionate culinary artistry',
        hero: {
          title: 'A Culinary Journey Awaits',
          content: 'Welcome to our restaurant where every dish tells a story of passion, tradition, and innovation. Our chefs create memorable dining experiences using the finest local ingredients and time-honored techniques combined with modern culinary artistry.'
        },
        about: {
          title: 'Our Culinary Philosophy',
          content: 'We believe that great food brings people together. Our commitment to quality ingredients, exceptional service, and a warm atmosphere creates the perfect setting for any occasion, from intimate dinners to celebration gatherings.'
        },
        services: {
          title: 'Dining Experiences',
          content: 'From our signature tasting menu to casual dining options, we offer diverse culinary experiences. Our services include dine-in, takeout, catering, and special event hosting to meet all your dining needs.'
        },
        contact: {
          title: 'Reserve Your Table',
          content: 'Ready for an unforgettable dining experience? Make a reservation today and let us create a memorable evening for you and your guests.'
        },
        seo: {
          title: 'Fine Dining Restaurant | Fresh Local Cuisine',
          description: 'Experience exceptional dining with locally sourced ingredients, innovative cuisine, and warm hospitality. Reserve your table for an unforgettable culinary journey.',
          keywords: ['restaurant', 'fine dining', 'local cuisine', 'fresh ingredients', 'culinary experience']
        }
      },

      tech: {
        title: `${originalPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Technology Solutions`,
        description: 'Innovative technology solutions that drive business growth and digital transformation',
        hero: {
          title: 'Powering Innovation Through Technology',
          content: 'We are a forward-thinking technology company dedicated to creating innovative solutions that transform businesses and improve lives. Our cutting-edge products and services help organizations navigate the digital landscape with confidence.'
        },
        about: {
          title: 'Our Technology Vision',
          content: 'Founded on the principles of innovation and excellence, we combine technical expertise with strategic insight to deliver solutions that make a real difference. Our team of expert developers and engineers is passionate about pushing the boundaries of what\'s possible.'
        },
        services: {
          title: 'Technology Solutions',
          content: 'We offer comprehensive technology services including software development, cloud solutions, mobile applications, and digital transformation consulting. Our solutions are designed to scale with your business and adapt to changing market demands.'
        },
        contact: {
          title: 'Start Your Digital Transformation',
          content: 'Ready to leverage technology for business growth? Contact us to discuss your project and discover how our innovative solutions can drive your success.'
        },
        seo: {
          title: 'Technology Solutions | Software Development Company',
          description: 'Leading technology company providing innovative software solutions, mobile app development, and digital transformation services for businesses worldwide.',
          keywords: ['technology solutions', 'software development', 'digital transformation', 'mobile apps', 'cloud computing']
        }
      },

      business: {
        title: `${originalPrompt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Professional Services`,
        description: 'Delivering exceptional professional services with expertise, integrity, and innovation',
        hero: {
          title: 'Excellence in Professional Services',
          content: 'We are dedicated to providing outstanding professional services that help businesses achieve their goals. With our expertise, commitment to quality, and client-focused approach, we deliver results that exceed expectations and drive sustainable success.'
        },
        about: {
          title: 'Our Professional Commitment',
          content: 'Built on a foundation of trust, expertise, and results, our firm has been serving clients with distinction for years. We combine industry knowledge with innovative approaches to solve complex challenges and create value for our clients.'
        },
        services: {
          title: 'Professional Services',
          content: 'Our comprehensive range of professional services is designed to meet the diverse needs of modern businesses. From strategic consulting to implementation support, we provide the expertise you need to succeed in today\'s competitive marketplace.'
        },
        contact: {
          title: 'Partner With Us',
          content: 'Ready to take your business to the next level? Contact us today to discuss how our professional services can help you achieve your objectives and drive sustainable growth.'
        },
        seo: {
          title: 'Professional Services | Business Solutions & Consulting',
          description: 'Expert professional services firm providing strategic consulting, business solutions, and implementation support to help companies achieve sustainable growth.',
          keywords: ['professional services', 'business consulting', 'strategic planning', 'business solutions', 'expert advice']
        }
      }
    };

    return templates[businessType as keyof typeof templates] || templates.business;
  }

  static async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    try {
      if (!API_CONFIG.HUGGINGFACE.apiKey) {
        // Fallback to placeholder if no API key
        return {
          url: `https://via.placeholder.com/1024x512/${request.style === 'modern' ? 'CF0F47' : '000000'}/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
          prompt: request.prompt,
          style: request.style || 'modern',
          generatedAt: new Date()
        };
      }

      const response = await axios.post(
        API_CONFIG.HUGGINGFACE.baseURL,
        {
          inputs: `${request.prompt}, ${request.style} style, high quality, professional`,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.HUGGINGFACE.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Convert blob to URL (in a real app, you'd upload to storage)
      const imageUrl = URL.createObjectURL(response.data);

      return {
        url: imageUrl,
        prompt: request.prompt,
        style: request.style || 'modern',
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to placeholder
      return {
        url: `https://via.placeholder.com/1024x512/FF0B55/FFFFFF?text=${encodeURIComponent(request.prompt)}`,
        prompt: request.prompt,
        style: request.style || 'modern',
        generatedAt: new Date()
      };
    }
  }

  static async optimizeSEO(content: string): Promise<any> {
    try {
      const prompt = `Analyze this website content for SEO and provide optimization suggestions:

"${content}"

Respond with a JSON object containing:
- title: An SEO-optimized page title (under 60 chars)
- description: Meta description (under 160 chars)  
- keywords: Array of relevant keywords
- suggestions: Array of specific SEO improvement recommendations

Focus on readability, keyword optimization, and search engine best practices.`;

      const response = await this.callGroqAPI(prompt, {
        id: 'groq-llama',
        name: 'Groq AI',
        provider: 'groq',
        description: 'SEO Analysis'
      });

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Fallback if JSON parsing fails
      }

      return {
        title: 'SEO Optimized Page Title',
        description: 'Professional SEO-optimized meta description that improves search engine visibility and click-through rates.',
        keywords: ['seo', 'optimization', 'website', 'professional'],
        suggestions: [
          'Add more descriptive headings (H1, H2, H3)',
          'Include target keywords naturally in content',
          'Optimize image alt texts with descriptive keywords',
          'Add internal links to related pages',
          'Improve page loading speed',
          'Create compelling meta descriptions for all pages'
        ]
      };
    } catch (error) {
      console.error('Error optimizing SEO:', error);
      throw new Error('Failed to optimize SEO');
    }
  }

  static async getChatResponse(message: string, model: AIModel): Promise<string> {
    try {
      const prompt = `You are an AI assistant helping with website development. The user asks: "${message}"
      
      Provide helpful, specific advice about:
      - Website design and development
      - Content creation and optimization
      - SEO best practices
      - User experience improvements
      - Technical implementation suggestions
      
      Keep responses practical and actionable.`;

      if (model.provider === 'groq') {
        return await this.callGroqAPI(prompt, model);
      } else if (model.provider === 'openai') {
        return await this.callOpenAI(prompt, model);
      } else if (model.provider === 'anthropic') {
        return await this.callAnthropic(prompt, model);
      }

      return "I'm here to help with your website development needs. How can I assist you today?";
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw new Error('Failed to get AI response');
    }
  }
}