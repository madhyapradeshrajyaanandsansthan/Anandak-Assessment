/**
 * Firebase to Supabase Migration Script
 * 
 * This script migrates all assessment submissions from Firebase Firestore
 * to Supabase PostgreSQL database (legacy table).
 * 
 * Prerequisites:
 * 1. Both Firebase and Supabase credentials must be set in .env file
 * 2. Supabase table 'assessment_submissions_legacy' must be created
 * 3. Run this script with: npm run migrate
 */

import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
function initializeFirebase() {
    if (admin.apps.length > 0) {
        return;
    }

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const projectId = process.env.GOOGLE_PROJECT_ID;

    if (!serviceAccountEmail || !privateKey || !projectId) {
        throw new Error('Firebase credentials not found in environment variables');
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail: serviceAccountEmail,
            privateKey,
        }),
    });

    console.log('✅ Firebase initialized');
}

// Initialize Supabase
function initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase credentials not found in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase initialized');
    return supabase;
}

// Transform Firebase document to Supabase legacy row
function transformDocument(doc: any) {
    const data = doc.data();

    return {
        name: data.name || '',
        name_hi: data.name_hi || data.name || '',
        age: parseInt(data.age) || 0,
        gender: data.gender || 'Prefer not to say',
        mobile: data.mobile || null,
        email: data.email || null,
        country_code: data.countryCode || null,
        state: data.state || '',
        district: data.district || '',
        assessment_data: data.assessmentData || [],
        total_score: parseInt(data.totalScore) || 0,
        final_assessment_text: data.finalAssessmentText || '',
        date: data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
}

// Main migration function
async function migrateData() {
    console.log('🚀 Starting Firebase to Supabase migration...\n');

    try {
        // Initialize services
        initializeFirebase();
        const supabase = initializeSupabase();

        // Get all documents from Firebase
        console.log('📥 Fetching documents from Firebase Firestore...');
        const db = admin.firestore();
        const snapshot = await db.collection('submissions').get();

        if (snapshot.empty) {
            console.log('⚠️  No documents found in Firebase. Nothing to migrate.');
            return;
        }

        console.log(`📊 Found ${snapshot.size} documents to migrate\n`);

        // Transform and prepare data
        const documentsToMigrate: any[] = [];
        snapshot.forEach((doc) => {
            try {
                const transformed = transformDocument(doc);
                documentsToMigrate.push(transformed);
            } catch (error: any) {
                console.error(`❌ Error transforming document ${doc.id}:`, error.message);
            }
        });

        console.log(`✅ Successfully transformed ${documentsToMigrate.length} documents\n`);

        // Batch insert to Supabase (insert in chunks to avoid timeouts)
        const BATCH_SIZE = 100;
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < documentsToMigrate.length; i += BATCH_SIZE) {
            const batch = documentsToMigrate.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(documentsToMigrate.length / BATCH_SIZE);

            console.log(`📤 Inserting batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);

            try {
                // @ts-ignore - Supabase types will be generated after table creation
                const { data, error } = await supabase
                    .from('assessment_submissions_legacy')
                    .insert(batch)
                    .select();

                if (error) {
                    console.error(`❌ Error inserting batch ${batchNumber}:`, error.message);
                    errorCount += batch.length;
                } else {
                    console.log(`✅ Batch ${batchNumber} inserted successfully`);
                    successCount += batch.length;
                }
            } catch (error: any) {
                console.error(`❌ Exception during batch ${batchNumber} insert:`, error.message);
                errorCount += batch.length;
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 MIGRATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total documents in Firebase: ${snapshot.size}`);
        console.log(`Successfully migrated: ${successCount}`);
        console.log(`Failed migrations: ${errorCount}`);
        console.log('='.repeat(60) + '\n');

        if (errorCount === 0) {
            console.log('🎉 Migration completed successfully!');
            console.log('\n💡 Next steps:');
            console.log('   1. Verify data in Supabase dashboard');
            console.log('   2. Test the application with Supabase');
            console.log('   3. Once verified, you can remove Firebase dependencies\n');
        } else {
            console.log('⚠️  Migration completed with errors.');
            console.log('   Please check the error messages above and retry if needed.\n');
        }

    } catch (error: any) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run migration
migrateData()
    .then(() => {
        console.log('✅ Migration script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration script failed:', error);
        process.exit(1);
    });
