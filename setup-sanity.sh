#!/bin/bash

# Sanity CMS Quick Setup Script
# This script helps you set up Sanity CMS for your Gramika News website

echo "🎉 Welcome to Sanity CMS Setup for Gramika News!"
echo ""
echo "This script will guide you through the setup process."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created!"
    echo ""
fi

echo "📋 Please follow these steps:"
echo ""
echo "1️⃣  Create a Sanity account:"
echo "   → Visit: https://www.sanity.io/manage"
echo "   → Click 'Create Project'"
echo "   → Give your project a name (e.g., 'Gramika News')"
echo ""

read -p "Press Enter when you've created your Sanity project..."

echo ""
echo "2️⃣  Get your Project ID:"
echo "   → In your Sanity dashboard, copy the Project ID"
echo ""
read -p "Enter your Sanity Project ID: " PROJECT_ID

echo ""
echo "3️⃣  Create an API Token:"
echo "   → Go to API → Tokens in your Sanity dashboard"
echo "   → Click 'Add API Token'"
echo "   → Name: 'Next.js App'"
echo "   → Permissions: 'Editor'"
echo ""
read -p "Enter your Sanity API Token: " API_TOKEN

echo ""
echo "4️⃣  Dataset name (default is 'production'):"
read -p "Enter dataset name [production]: " DATASET
DATASET=${DATASET:-production}

# Update .env.local
echo ""
echo "📝 Updating .env.local..."

# For macOS (BSD sed)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/NEXT_PUBLIC_SANITY_PROJECT_ID=.*/NEXT_PUBLIC_SANITY_PROJECT_ID=$PROJECT_ID/" .env.local
    sed -i '' "s/NEXT_PUBLIC_SANITY_DATASET=.*/NEXT_PUBLIC_SANITY_DATASET=$DATASET/" .env.local
    sed -i '' "s/SANITY_API_TOKEN=.*/SANITY_API_TOKEN=$API_TOKEN/" .env.local
else
    # For Linux (GNU sed)
    sed -i "s/NEXT_PUBLIC_SANITY_PROJECT_ID=.*/NEXT_PUBLIC_SANITY_PROJECT_ID=$PROJECT_ID/" .env.local
    sed -i "s/NEXT_PUBLIC_SANITY_DATASET=.*/NEXT_PUBLIC_SANITY_DATASET=$DATASET/" .env.local
    sed -i "s/SANITY_API_TOKEN=.*/SANITY_API_TOKEN=$API_TOKEN/" .env.local
fi

echo "✅ Environment variables updated!"
echo ""

echo "5️⃣  Would you like to set up Sanity Studio now? (y/n)"
read -p "> " SETUP_STUDIO

if [ "$SETUP_STUDIO" = "y" ] || [ "$SETUP_STUDIO" = "Y" ]; then
    echo ""
    echo "📦 Setting up Sanity Studio..."
    echo ""
    
    # Check if sanity CLI is installed
    if ! command -v sanity &> /dev/null; then
        echo "Installing Sanity CLI..."
        npm install -g @sanity/cli
    fi
    
    cd ..
    
    echo ""
    echo "Creating Sanity Studio..."
    echo "Please follow the prompts:"
    echo "  - Select 'Use existing project'"
    echo "  - Choose your project: $PROJECT_ID"
    echo "  - Use default dataset: $DATASET"
    echo "  - Project output path: gramika-studio"
    echo ""
    
    npx create-sanity@latest
    
    echo ""
    echo "✅ Sanity Studio created!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy schemas from live/sanity/schemas/ to gramika-studio/schemas/"
    echo "2. Update gramika-studio/sanity.config.ts to import schemas"
    echo "3. Run 'cd gramika-studio && npm run dev'"
    echo "4. Open http://localhost:3333 to manage content"
    echo ""
else
    echo ""
    echo "📋 To set up Sanity Studio later:"
    echo "1. Run: npm install -g @sanity/cli"
    echo "2. Run: npx create-sanity@latest"
    echo "3. Follow the prompts to connect to your project"
    echo ""
fi

echo ""
echo "🎊 Setup Complete!"
echo ""
echo "📚 Documentation:"
echo "  - SANITY_SETUP.md - Detailed setup guide"
echo "  - SANITY_INTEGRATION.md - Integration summary"
echo ""
echo "🚀 To start your Next.js app:"
echo "  npm run dev"
echo ""
echo "Happy content managing! 🎉"
