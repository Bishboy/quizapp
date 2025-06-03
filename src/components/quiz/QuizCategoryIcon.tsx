import React from 'react';
import { HtmlIcon } from '@/components/icons/HtmlIcon';
import { CssIcon } from '@/components/icons/CssIcon';
import { JavaScriptIcon } from '@/components/icons/JavaScriptIcon';
import { AccessibilityIcon } from '@/components/icons/AccessibilityIcon';
import { cn } from '@/lib/utils';
import type { Quiz } from '@/types/quiz';

interface QuizCategoryIconProps {
  quiz: Pick<Quiz, 'iconName' | 'bgColorClass' | 'fgColorClass'>;
  size?: 'sm' | 'md';
}

export function QuizCategoryIcon({ quiz, size = 'md' }: QuizCategoryIconProps) {
  const IconComponent = {
    HTML: HtmlIcon,
    CSS: CssIcon,
    JavaScript: JavaScriptIcon,
    Accessibility: AccessibilityIcon,
  }[quiz.iconName];

  const iconSizeClass = size === 'sm' ? 'w-7 h-7' : 'w-10 h-10';
  const wrapperSizeClass = size === 'sm' ? 'p-1.5' : 'p-2';


  return (
    <div
      className={cn(
        'rounded-md flex items-center justify-center',
        wrapperSizeClass,
        quiz.bgColorClass
      )}
    >
      <IconComponent className={cn(iconSizeClass, quiz.fgColorClass)} />
    </div>
  );
}
