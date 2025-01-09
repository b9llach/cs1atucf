'use client';

import { usePathname } from 'next/navigation';
import { AIChatBox } from './ai-chat';
import { useEffect, useState } from 'react';

export function ChatWrapper() {
  const pathname = usePathname();
  const [context, setContext] = useState('cs1');
  
  useEffect(() => {
    const path = pathname.split('/');
    const topic = path[path.length - 1] || 'cs1';
    setContext(topic);
  }, [pathname]);

  return (
    <AIChatBox 
      contextTitle={context.replace('-', ' ')}
      contextDescription={`Current topic focuses on ${context.replace('-', ' ')}`}
    />
  );
} 