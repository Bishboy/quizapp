export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface Quiz {
  title: string;
  icon: string; // Original icon path, used to determine which SVG icon to render
  questions: Question[];
  // Mapped properties for styling
  iconName: 'HTML' | 'CSS' | 'JavaScript' | 'Accessibility';
  bgColorClass: string;
  fgColorClass: string;
}

export interface QuizData {
  quizzes: Quiz[];
}
