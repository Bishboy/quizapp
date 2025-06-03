import React from 'react';
import { ThemeToggle } from '@/components/quiz/ThemeToggle';
import { QuizCategoryIcon } from '@/components/quiz/QuizCategoryIcon';
import type { Quiz } from '@/types/quiz';

interface QuizHeaderProps {
  currentQuiz?: Pick<Quiz, 'title' | 'iconName' | 'bgColorClass' | 'fgColorClass'>;
}

export function QuizHeader({ currentQuiz }: QuizHeaderProps) {
  return (
    <header className="py-4 md:py-8">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {currentQuiz && (
            <>
              <QuizCategoryIcon quiz={currentQuiz} size="sm" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-foreground">
                {currentQuiz.title}
              </h1>
            </>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
