#!/bin/bash
# Start script for Learn Lab development server

cd "$(dirname "$0")"

# Kill any existing Next.js processes
echo "Clearing any existing processes..."
pkill -f "next dev" 2>/dev/null
sleep 1

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating it..."
    cat > .env.local << EOF
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=KS0oBURWPES4AphsJhc7M0TdNpfrwSgdogRI06Zo4G4=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EOF
    echo "✅ Created .env.local"
fi

# Start the server
echo "🚀 Starting Next.js development server..."
echo "📍 Server will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

