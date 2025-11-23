import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Assessment submission data structure
 * This matches the data sent from the frontend components
 */
interface AssessmentData {
  name: string;
  name_hi: string;
  age: number;
  gender: string;
  mobile?: string;
  email?: string;
  countryCode?: string;
  state: string;
  district: string;
  assessmentData: Array<{
    id: number;
    trait: string;
    score: number;
    feedback: string;
  }>;
  totalScore: number;
  finalAssessmentText: string;
  date: string;
}

/**
 * Saves assessment submission to Supabase
 * Extracts individual trait scores and feedback for storage
 */
async function saveAssessmentToSupabase(data: AssessmentData) {
  try {
    // Extract individual trait scores from assessment data
    const gratitudeScore = data.assessmentData?.find((a) => a.trait === 'Gratitude')?.score ?? 0;
    const resilienceScore = data.assessmentData?.find((a) => a.trait === 'Resilience')?.score ?? 0;
    const empathyScore = data.assessmentData?.find((a) => a.trait === 'Empathy')?.score ?? 0;
    const sociabilityScore = data.assessmentData?.find((a) => a.trait === 'Sociability')?.score ?? 0;
    const socialCognitionScore = data.assessmentData?.find((a) => a.trait === 'Social Cognition')?.score ?? 0;
    const courageScore = data.assessmentData?.find((a) => a.trait === 'Courage')?.score ?? 0;

    // Extract all feedback comments
    const feedbackComments = data.assessmentData?.map((a) => ({
      trait: a.trait,
      feedback: a.feedback
    })) || [];

    // Insert into Supabase database
    const { data: insertedData, error } = await supabase
      .from('assessment_submissions')
      .insert([
        {
          name: data.name,
          name_hi: data.name_hi,
          age: data.age,
          gender: data.gender,
          country_code: data.countryCode || '+91',
          mobile: data.mobile || '',
          email: data.email || null,
          state: data.state,
          district: data.district,
          total_score: data.totalScore,
          final_assessment: data.finalAssessmentText,
          gratitude_score: gratitudeScore,
          resilience_score: resilienceScore,
          empathy_score: empathyScore,
          sociability_score: sociabilityScore,
          social_cognition_score: socialCognitionScore,
          courage_score: courageScore,
          assessment_data: data.assessmentData,
          feedback_comments: feedbackComments,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    console.log('Supabase insert successful:', insertedData);
    return insertedData;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }
}

/**
 * POST endpoint to log assessment submissions
 * Receives assessment data from frontend and stores it in Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const submission = await request.json();

    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing required Supabase credentials'
        },
        { status: 500 }
      );
    }

    console.log('Saving assessment submission to Supabase...');
    
    // Save the assessment data
    const savedData = await saveAssessmentToSupabase(submission as AssessmentData);

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: savedData,
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit assessment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
