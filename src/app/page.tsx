"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { quizzes as allQuizzes, getQuizByTitle } from '@/lib/quiz-data';
import type { Quiz, Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { QuizCategoryIcon } from '@/components/quiz/QuizCategoryIcon';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppState = 'welcome' | 'playing' | 'completed';
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const currentQuestion = useMemo(() => {
    return currentQuiz?.questions[currentQuestionIndex];
  }, [currentQuiz, currentQuestionIndex]);

  const handleSubjectSelect = (quizTitle: string) => {
    const quiz = getQuizByTitle(quizTitle);
    if (quiz) {
      setCurrentQuiz(quiz);
      setAppState('playing');
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setScore(0);
      setIsSubmitted(false);
      setShowError(false);
    }
  };
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pattern-bg {
        background-image: 
          radial-gradient(circle at 100% 0%, hsl(var(--accent) / 0.1) 0px, transparent 60px),
          radial-gradient(circle at 0% 100%, hsl(var(--accent) / 0.1) 0px, transparent 60px);
        background-size: 120px 120px;
        background-position: 0 0, 0 0;
      }
      .dark .pattern-bg {
        background-image: 
          radial-gradient(circle at 100% 0%, hsl(var(--accent) / 0.05) 0px, transparent 60px),
          radial-gradient(circle at 0% 100%, hsl(var(--accent) / 0.05) 0px, transparent 60px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      document.head.removeChild(style);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setShowError(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    setIsSubmitted(true);
    if (selectedOption === currentQuestion?.answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowError(false);
    } else {
      setAppState('completed');
    }
  };

  const handlePlayAgain = () => {
    setAppState('welcome');
    setCurrentQuiz(null);
  };
  
  const OptionItem = ({ option, index, isSelected, isCorrect, isSubmitted, isActualAnswer }: {
    option: string;
    index: number;
    isSelected: boolean;
    isCorrect: boolean | null;
    isSubmitted: boolean;
    isActualAnswer: boolean;
  }) => {
    const baseClasses = "flex items-center w-full p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 shadow-option-default hover:shadow-option-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    const selectedClasses = "border-primary ring-2 ring-primary";
    const correctClasses = "border-correct bg-correct/10";
    const incorrectClasses = "border-incorrect bg-incorrect/10";

    let stateClasses = "";
    if (isSubmitted) {
      if (isActualAnswer) {
        stateClasses = correctClasses;
      } else if (isSelected && !isCorrect) {
        stateClasses = incorrectClasses;
      }
    } else if (isSelected) {
      stateClasses = selectedClasses;
    }
    
    return (
      <Label
        htmlFor={`option-${index}`}
        className={cn(
          baseClasses,
          "bg-card hover:border-accent",
          stateClasses
        )}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOptionSelect(option);}}}
      >
        <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
        <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md mr-4 text-lg font-medium shrink-0",
            isSelected && !isSubmitted ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
            isSubmitted && isActualAnswer ? "bg-correct text-primary-foreground" : "",
            isSubmitted && isSelected && !isCorrect ? "bg-incorrect text-primary-foreground" : ""
          )}
        >
          {OPTION_LABELS[index]}
        </div>
        <span className="text-base md:text-lg font-medium text-foreground">{option}</span>
        {isSubmitted && (
          <div className="ml-auto">
            {isActualAnswer && <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-correct" />}
            {isSelected && !isCorrect && <XCircle className="w-6 h-6 md:w-7 md:h-7 text-incorrect" />}
          </div>
        )}
      </Label>
    );
  };


  if (appState === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900 pattern-bg">
        <QuizHeader />
        <main className="container mx-auto flex-grow flex items-center px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
                Welcome to <span className="text-primary">QuizWhiz!</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 italic">
                Pick a subject to get started.
              </p>
            </div>
            <div className="space-y-4">
              {allQuizzes.map((quiz) => (
                <Button
                  key={quiz.title}
                  onClick={() => handleSubjectSelect(quiz.title)}
                  variant="outline"
                  className="w-full h-auto justify-start p-4 rounded-xl bg-card shadow-lg hover:bg-accent/20 hover:border-primary transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Start ${quiz.title} quiz`}
                >
                  <QuizCategoryIcon quiz={quiz} size="md" />
                  <span className="ml-4 text-xl md:text-2xl font-semibold text-foreground">
                    {quiz.title}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (appState === 'playing' && currentQuiz && currentQuestion) {
    const progressValue = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900 pattern-bg">
        <QuizHeader currentQuiz={currentQuiz} />
        <main className="container mx-auto flex-grow flex items-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
            <div className="flex flex-col justify-center lg:pr-8">
              <p className="text-base md:text-lg italic text-muted-foreground mb-3 md:mb-5">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-6 md:mb-10 leading-tight">
                {currentQuestion.question}
              </h2>
              <Progress value={progressValue} className="w-full h-2 md:h-3 mb-6 md:mb-10" />
               {showError && !isSubmitted && (
                <div className="flex items-center text-incorrect mb-4 text-sm md:text-base">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Please select an answer.
                </div>
              )}
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect} className="space-y-3 md:space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <OptionItem
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedOption === option}
                    isCorrect={selectedOption === currentQuestion.answer}
                    isSubmitted={isSubmitted}
                    isActualAnswer={option === currentQuestion.answer}
                  />
                ))}
              </RadioGroup>
              
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitAnswer}
                  className="w-full text-lg md:text-xl py-3 md:py-4 h-auto mt-4 md:mt-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow duration-200"
                  aria-label="Submit answer"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="w-full text-lg md:text-xl py-3 md:py-4 h-auto mt-4 md:mt-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow duration-200"
                  aria-label={currentQuestionIndex < currentQuiz.questions.length - 1 ? "Next question" : "Show results"}
                >
                  {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Show Results'}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (appState === 'completed' && currentQuiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900 pattern-bg">
        <QuizHeader currentQuiz={currentQuiz} />
        <main className="container mx-auto flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full max-w-4xl">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                Quiz completed
              </h1>
              <p className="text-3xl sm:text-4xl md:text-5xl font-medium text-primary mb-8">
                You scored...
              </p>
            </div>
            <Card className="w-full shadow-xl">
              <CardHeader className="items-center">
                <QuizCategoryIcon quiz={currentQuiz} size="md" />
                <CardTitle className="text-2xl md:text-3xl mt-2">{currentQuiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-6xl md:text-8xl font-bold text-foreground">{score}</p>
                <p className="text-lg md:text-xl text-muted-foreground">
                  out of {currentQuiz.questions.length}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePlayAgain}
                  className="w-full text-lg md:text-xl py-3 md:py-4 h-auto bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow duration-200"
                  aria-label="Play again"
                >
                  Play Again
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return null; 
}

 
