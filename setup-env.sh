#!/bin/bash
# Setup .env.local with Supabase credentials

echo "🔧 Setting up .env.local file..."

# Create .env.local with the user's credentials
cat > .env.local << 'EOF'
# Supabase Configuration
# Your project: ebaqzmfejeymxfxkmczi

NEXT_PUBLIC_SUPABASE_URL=https://ebaqzmfejeymxfxkmczi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYXF6bWZlamV5bXhmeGttY3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTE1NjcsImV4cCI6MjA3NjE4NzU2N30.Ha9kexDO8EPu3JNUAWzZUwYZVOl_H7dilzqW1efzBE4

# v0.dev API Configuration (Optional)
V0_API_KEY=your-v0-api-key-here
EOF

echo "✅ .env.local created successfully!"
echo ""
echo "📋 Running diagnostic to verify configuration..."
echo ""

# Run the diagnostic tool
node check-supabase-config.js

echo ""
echo "🚀 Next steps:"
echo "1. If diagnostic shows all ✅, restart your server:"
echo "   npm run dev"
echo ""
echo "2. Test signup at: http://localhost:3000/auth/signup"
echo ""
echo "3. If you get errors, run the database setup:"
echo "   - Open Supabase SQL Editor"
echo "   - Run database-setup.sql"
