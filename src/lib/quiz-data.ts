import rawQuizData from '@/data/data.json';
import type { Quiz, QuizData as RawQuizDataType } from '@/types/quiz';

interface IconStyle {
  iconName: 'HTML' | 'CSS' | 'JavaScript' | 'Accessibility';
  bgColorClass: string;
  fgColorClass: string;
}

const iconStyles: Record<string, IconStyle> = {
  HTML: { iconName: 'HTML', bgColorClass: 'bg-icon-html-bg', fgColorClass: 'text-icon-html-fg' },
  CSS: { iconName: 'CSS', bgColorClass: 'bg-icon-css-bg', fgColorClass: 'text-icon-css-fg' },
  JavaScript: { iconName: 'JavaScript', bgColorClass: 'bg-icon-js-bg', fgColorClass: 'text-icon-js-fg' },
  Accessibility: { iconName: 'Accessibility', bgColorClass: 'bg-icon-accessibility-bg', fgColorClass: 'text-icon-accessibility-fg' },
};

const typedRawData = rawQuizData as unknown as RawQuizDataType;

export const quizzes: Quiz[] = typedRawData.quizzes.map((quiz) => {
  const style = iconStyles[quiz.title] || iconStyles['HTML']; // Default to HTML style if not found
  return {
    ...quiz,
    iconName: style.iconName,
    bgColorClass: style.bgColorClass,
    fgColorClass: style.fgColorClass,
  };
});

export function getQuizByTitle(title: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.title === title);
}
