"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { getFinalFeedback, getFinalAssessment, translations } from "@/lib/assessment-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserInfo } from "./user-info-step"
import type { AnswerDetail } from "./assessment-step"
import { Award, Download } from "lucide-react"
import type { Language } from "./aptitude-insight-app"
import { useToast } from "@/hooks/use-toast"

interface ResultsStepProps {
  score: number
  userData: UserInfo
  assessmentData: AnswerDetail[]
  lang: Language
}

export function ResultsStep({ score, userData, assessmentData, lang }: ResultsStepProps) {
  const router = useRouter()
  const { toast } = useToast()
  const t = translations[lang].results
  const feedback = getFinalFeedback(score, lang)
  const hasLoggedRef = useRef(false); // Use ref to prevent double execution

  useEffect(() => {
    // Guard clause to prevent re-running if already logged
    if (hasLoggedRef.current) return;
    hasLoggedRef.current = true;

    const certificateData = {
      ...userData,
      assessmentData,
      finalAssessmentText: getFinalAssessment(getFinalFeedback(score, 'en'), 'en'), // Always store in English
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    // Save to localStorage for the certificate page
    try {
      localStorage.setItem('anandakAssessmentCertificate', JSON.stringify(certificateData));
    } catch (error) {
      console.error("Could not save certificate data to localStorage", error);
      toast({
        title: "Could not save certificate",
        description: "There was an issue preparing your certificate data.",
        variant: "destructive",
      });
    }

    // Asynchronously log the submission to the backend
    const logSubmission = async () => {
      try {
        // Use the legacy format (like Firebase) - simpler and matches what you like
        const submissionData = {
          name: userData.name,
          name_hi: userData.name_hi,
          age: userData.age,
          gender: userData.gender,
          mobile: userData.mobile,
          email: userData.email || '',
          countryCode: userData.countryCode,
          state: userData.state,
          district: userData.district,
          assessmentData: assessmentData,
          totalScore: score,
          finalAssessmentText: getFinalAssessment(getFinalFeedback(score, 'en'), 'en'),
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };

        const response = await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || result.details || 'Failed to log submission');
        }
        
        console.log("Submission logged successfully:", result);

      } catch (error: any) {
        console.error("Failed to log submission:", error);
        toast({
          title: "Data Submission Failed",
          description: `Your assessment results could not be saved. Reason: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    logSubmission();

  }, [userData, assessmentData, score, toast, lang]); // Dependencies remain the same

  const handleViewCertificate = () => {
    router.push('/certificate');
  }

  return (
    <Card className="text-center animate-in fade-in duration-500">
      <CardHeader>
        <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit mb-4">
            <Award className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl">{t.title}</CardTitle>
        <CardDescription className="text-lg">{t.description(userData.name)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-secondary/50 rounded-lg">
          <h3 className="font-semibold text-xl mb-2">{t.insightTitle}</h3>
          <p className="text-foreground text-lg">{feedback}</p>
        </div>
        <p className="text-muted-foreground">
          {t.certificateMessage}
        </p>
        <Button onClick={handleViewCertificate} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="mr-2 h-5 w-5" />
          {t.certificateButton}
        </Button>
      </CardContent>
    </Card>
  )
}
