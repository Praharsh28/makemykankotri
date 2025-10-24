#!/usr/bin/env node
/**
 * Supabase Configuration Checker
 * Run this to verify your .env.local setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Supabase Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const exists = fs.existsSync(envPath);

if (!exists) {
  console.error('❌ .env.local file NOT FOUND!');
  console.log('\n📝 Create .env.local with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

console.log('✅ .env.local file exists');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let supabaseUrl = null;
let supabaseKey = null;

lines.forEach(line => {
  line = line.trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

// Check URL
console.log('\n🔗 Checking NEXT_PUBLIC_SUPABASE_URL...');
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not set!');
} else if (supabaseUrl === 'https://your-project.supabase.co') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is still the example value!');
  console.log('   Replace with your actual Supabase project URL');
} else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('supabase.co')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL format looks wrong!');
  console.log('   Should be: https://xxxxxxxxxxxxx.supabase.co');
  console.log('   You have:', supabaseUrl);
} else {
  console.log('✅ URL format looks good:', supabaseUrl);
}

// Check Key
console.log('\n🔑 Checking NEXT_PUBLIC_SUPABASE_ANON_KEY...');
if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set!');
} else if (supabaseKey === 'your-v0-api-key-here' || supabaseKey.length < 50) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY looks wrong!');
  console.log('   Should be a long JWT token (starts with eyJ...)');
} else if (!supabaseKey.startsWith('eyJ')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY should start with "eyJ"');
  console.log('   Yours starts with:', supabaseKey.substring(0, 10));
} else {
  console.log('✅ Key format looks good:', supabaseKey.substring(0, 30) + '...');
}

// Test connection
if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://') && supabaseKey.startsWith('eyJ')) {
  console.log('\n🧪 Testing connection to Supabase...');
  
  fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
    .then(response => {
      if (response.ok || response.status === 404) {
        console.log('✅ Connection successful! Supabase is reachable!');
        console.log('\n✨ Your configuration looks correct!');
        console.log('\n📋 Next steps:');
        console.log('1. Run the database-setup.sql in Supabase SQL Editor');
        console.log('2. Restart your dev server: npm run dev');
        console.log('3. Try signing up again!');
      } else {
        console.error('❌ Connection failed! Status:', response.status);
        console.log('   Your credentials might be wrong or project might not exist');
        console.log('   Check your Supabase dashboard: https://supabase.com/dashboard');
      }
    })
    .catch(error => {
      console.error('❌ Connection failed!', error.message);
      console.log('   Your Supabase URL or key might be incorrect');
      console.log('   Double-check your credentials at: https://supabase.com/dashboard');
    });
} else {
  console.log('\n❌ Cannot test connection - fix the errors above first!');
  console.log('\n📝 How to get your Supabase credentials:');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project (or create one)');
  console.log('3. Go to: Settings → API');
  console.log('4. Copy "Project URL" → Put in NEXT_PUBLIC_SUPABASE_URL');
  console.log('5. Copy "anon public" key → Put in NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
