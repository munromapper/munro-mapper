//src/components/global/ReadMore.tsx
// This component provides a "Read More" functionality for text content, allowing users to expand or collapse long text

'use client';
import { useState } from 'react';

interface ReadMoreProps {
  text: string;
  maxChars?: number;
  className?: string;
}

export default function ReadMore({ 
  text, 
  maxChars = 150, 
  className = '' 
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If text is shorter than maxChars, just show it
  if (!text || text.length <= maxChars) {
    return <p className={className}>{text}</p>;
  }
  
  return (
    <div className={className}>
      <p className="inline">
        {isExpanded ? text : `${text.slice(0, maxChars)}...`}{' '}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate underline underline-offset-3 decoration-dotted inline-block cursor-pointer"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      </p>
      
      {/* This span contains the full text for SEO but is hidden from view */}
      <span className="sr-only">{text}</span>
    </div>
  );
}