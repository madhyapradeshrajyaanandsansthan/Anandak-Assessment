
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInfoStep, type UserInfo } from './user-info-step';
import { AssessmentStep, type AnswerDetail } from './assessment-step';
import { ResultsStep } from './results-step';
import { ClipboardList, UserCheck, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { translations } from '@/lib/assessment-data';

export type Language = 'en' | 'hi';
type Step = 'language' | 'info' | 'assessment' | 'results';

function LanguageSelectionStep({ onSelect }: { onSelect: (lang: Language) => void }) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl"><Languages /> Select Language</CardTitle>
        <CardDescription>Please choose your preferred language for the assessment.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
        <Button onClick={() => onSelect('en')} size="lg" variant="outline" className="w-full sm:w-auto">
          Proceed in English
        </Button>
        <Button onClick={() => onSelect('hi')} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
          हिन्दी में आगे बढ़ें
        </Button>
      </CardContent>
    </>
  );
}


export default function AptitudeInsightApp() {
  const [step, setStep] = useState<Step>('language');
  const [lang, setLang] = useState<Language>('en');
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [assessmentData, setAssessmentData] = useState<AnswerDetail[]>([]);
  
  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setStep('info');
  };

  const handleInfoSubmit = (data: UserInfo) => {
    setUserData(data);
    setStep('assessment');
  };

  const handleAssessmentComplete = (data: AnswerDetail[]) => {
    setAssessmentData(data);
    setStep('results');
  };

  const getStepComponent = () => {
    const t = translations[lang];
    switch (step) {
      case 'language':
        return <LanguageSelectionStep onSelect={handleLanguageSelect} />;
      case 'info':
        return (
            <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl"><UserCheck/> {t.userInfo.title}</CardTitle>
                    <CardDescription>{t.userInfo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserInfoStep onSubmit={handleInfoSubmit} lang={lang} />
                </CardContent>
            </>
        );
      case 'assessment':
        return (
            <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl"><ClipboardList/> {t.assessment.title}</CardTitle>
                    <CardDescription>{t.assessment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <AssessmentStep onComplete={handleAssessmentComplete} lang={lang} />
                </CardContent>
            </>
        );
      case 'results':
        if (userData && assessmentData) {
            const totalScore = assessmentData.reduce((acc, val) => acc + val.score, 0);
            return <ResultsStep score={totalScore} userData={userData} assessmentData={assessmentData} lang={lang} />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-500 ease-in-out hover:shadow-primary/20 hover:shadow-xl">
        <div key={step} className="animate-in fade-in-50 duration-500">
            {getStepComponent()}
        </div>
    </Card>
  );
}
