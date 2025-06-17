// src/components/ui/SafeContentRenderer.tsx
// Safe component to render any content type

import React from 'react';

interface SafeContentRendererProps {
  content: any;
  fallback?: string;
  className?: string;
}

export const SafeContentRenderer: React.FC<SafeContentRendererProps> = ({
  content,
  fallback = 'Content not available',
  className = ''
}) => {
  const renderContent = () => {
    // Handle null or undefined
    if (content === null || content === undefined) {
      return fallback;
    }

    // Handle strings
    if (typeof content === 'string') {
      return content;
    }

    // Handle numbers
    if (typeof content === 'number') {
      return content.toString();
    }

    // Handle arrays
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index}>
          <SafeContentRenderer content={item} fallback={fallback} />
        </div>
      ));
    }

    // Handle objects
    if (typeof content === 'object') {
      // Check for common content object patterns
      if (content.text || content.content) {
        return content.text || content.content;
      }
      
      if (content.heading && content.subheading) {
        return (
          <div>
            <h3 className="font-semibold">{content.heading}</h3>
            <p className="text-gray-600">{content.subheading}</p>
          </div>
        );
      }

      // Try to extract meaningful text from object
      const values = Object.values(content).filter(value => 
        typeof value === 'string' && value.length > 0
      );
      
      if (values.length > 0) {
        return values.join(' ');
      }

      // Last resort: stringify the object
      try {
        return JSON.stringify(content, null, 2);
      } catch (e) {
        return fallback;
      }
    }

    // Handle booleans
    if (typeof content === 'boolean') {
      return content ? 'Yes' : 'No';
    }

    return fallback;
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
};