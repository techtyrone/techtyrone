// Enhanced prompts for better Groq API responses

export const GROQ_PROMPTS = {
  websiteGeneration: (prompt: string) => `
Create a complete professional website for: "${prompt}"

Analyze the type of business/website requested and create appropriate, detailed content.

You MUST respond with valid JSON in this exact format:
{
  "title": "Professional Website Title Based On Request",
  "description": "Compelling description that matches the business type",
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "title": "Compelling Hero Title",
      "content": "Detailed hero section content that speaks directly to the target audience. Make this specific to ${prompt} and include value propositions, benefits, and compelling messaging that would convert visitors.",
      "order": 1
    },
    {
      "id": "about-2", 
      "type": "about",
      "title": "About Section Title",
      "content": "Comprehensive about section that explains the business story, mission, values, and what makes this ${prompt} unique. Include credibility factors and emotional connection points.",
      "order": 2
    },
    {
      "id": "services-3",
      "type": "services", 
      "title": "Services/Products Title",
      "content": "Detailed description of services or products offered. List specific offerings that relate to ${prompt} and explain the benefits customers will receive.",
      "order": 3
    },
    {
      "id": "features-4",
      "type": "features",
      "title": "Key Features/Benefits",
      "content": "Highlight the main features and benefits that set this ${prompt} apart from competitors. Focus on value propositions and unique selling points.",
      "order": 4
    },
    {
      "id": "contact-5",
      "type": "contact",
      "title": "Get In Touch",
      "content": "Compelling call-to-action that encourages visitors to contact or engage. Include what happens next and how the business will help solve their problems.",
      "order": 5
    }
  ],
  "seo": {
    "title": "SEO optimized title under 60 chars for ${prompt}",
    "description": "Meta description under 160 chars that includes key benefits",
    "keywords": ["primary-keyword", "secondary-keyword", "location-based", "service-based"],
    "slug": "url-friendly-slug"
  }
}

IMPORTANT Rules:
- All "content" fields must be detailed paragraphs (minimum 100 words each)
- Content must be specific to "${prompt}" - not generic
- Include industry-specific terms and benefits
- Make content conversion-focused
- NO objects in content fields - only strings
- Be professional but engaging
- Include emotional triggers and value propositions

Business Type: Analyze if this is portfolio, restaurant, tech company, agency, ecommerce, consulting, fitness, blog, or other and tailor content accordingly.
`,

  seoOptimization: (content: string) => `
Analyze this website content for SEO optimization: "${content}"

Respond with valid JSON in this format:
{
  "title": "SEO optimized title under 60 characters that includes primary keyword",
  "description": "Compelling meta description under 160 characters that includes keywords and benefits",
  "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "location-keyword", "industry-keyword"],
  "suggestions": [
    "Add more descriptive H1-H6 headings with target keywords",
    "Include internal links to related pages and services", 
    "Optimize images with descriptive alt text containing keywords",
    "Add schema markup for better search engine understanding",
    "Improve page loading speed for better user experience",
    "Create more content around related keywords and topics"
  ]
}

Focus on:
- Local SEO if applicable
- Industry-specific keywords
- User intent optimization
- Technical SEO improvements
- Content optimization suggestions
`,

  chatAssistant: (message: string) => `
You are an expert AI assistant specializing in website development, design, and digital marketing.

User question: "${message}"

Provide a helpful, detailed response about:
- Website development and design best practices
- Content creation and optimization strategies  
- SEO and digital marketing advice
- User experience improvements
- Technical implementation guidance
- Industry-specific recommendations

Keep your response:
- Practical and actionable
- Professional but conversational
- Specific to their question
- Include examples when helpful
- Maximum 3-4 paragraphs

Do not use complex formatting or objects. Respond with plain text only.
`
};