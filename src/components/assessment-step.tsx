
"use client";

import { useState } from 'react';
import { questions, getIndividualFeedback, type Question } from '@/lib/assessment-data';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Language } from './aptitude-insight-app';
import { translations } from '@/lib/assessment-data';

export interface AnswerDetail {
    id: number;
    trait: Question['trait'];
    score: number;
    feedback: string;
}

interface AssessmentStepProps {
  onComplete: (answers: AnswerDetail[]) => void;
  lang: Language;
}

export function AssessmentStep({ onComplete, lang }: AssessmentStepProps) {
  const t = translations[lang].assessment;
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex) / questions.length) * 100;

  // Show instructions screen
  if (showInstructions) {
    return (
      <Card className="animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t.instructions.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base leading-relaxed text-muted-foreground">
            {t.instructions.text}
          </p>
          <Button 
            onClick={() => setShowInstructions(false)} 
            className="w-full"
            size="lg"
          >
            {lang === 'en' ? 'Begin Assessment' : 'मूल्यांकन शुरू करें'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    const score = parseInt(value, 10);
    const trait = currentQuestion.trait;
    const feedback = getIndividualFeedback(trait, score, lang);
    setCurrentFeedback(feedback);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: t.toast.title,
        description: t.toast.description,
        variant: "destructive",
      });
      return;
    }

    const score = parseInt(selectedOption, 10);
    const newAnswer: AnswerDetail = {
        id: currentQuestion.id,
        trait: currentQuestion.trait,
        score: score,
        feedback: getIndividualFeedback(currentQuestion.trait, score, 'en') // Always store english feedback for cert
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setCurrentFeedback(null);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="progress" className="text-sm font-medium text-muted-foreground">
          {t.progress} {currentQuestionIndex + 1} {t.of} {questions.length}
        </Label>
        <Progress id="progress" value={progressValue} className="mt-2 h-2" />
      </div>
      
      <Card key={currentQuestionIndex} className="animate-in fade-in duration-500 transition-shadow hover:shadow-lg hover:shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.questionText[lang]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedOption ?? undefined}
            onValueChange={handleOptionChange}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.score + '-' + option.text.en} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-all hover:shadow-md hover:shadow-primary/20">
                <RadioGroupItem value={String(option.score)} id={`q${currentQuestion.id}-o${option.score}`} />
                <Label htmlFor={`q${currentQuestion.id}-o${option.score}`} className="font-normal text-base cursor-pointer">
                  {option.text[lang]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {currentFeedback && (
        <div className="p-4 bg-secondary/50 rounded-lg text-center animate-in fade-in duration-300">
          <p className="text-foreground">{currentFeedback}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {currentQuestionIndex < questions.length - 1 ? t.nextButton : t.finishButton}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
