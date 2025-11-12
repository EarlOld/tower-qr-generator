#!/bin/bash

# Pre-push validation script
# Run this before pushing to ensure CI will pass

set -e

echo "🔍 Running pre-push checks..."
echo ""

echo "📝 Type checking..."
npm run type-check
echo "✅ Type check passed"
echo ""

echo "🧹 Linting..."
npm run lint
echo "✅ Lint passed"
echo ""

echo "🧪 Running unit tests..."
npm run test:unit -- --run
echo "✅ Unit tests passed"
echo ""

echo "🏗️  Building..."
npm run build
echo "✅ Build successful"
echo ""

echo "🎭 Running E2E tests..."
npm run test:e2e
echo "✅ E2E tests passed"
echo ""

echo "✨ All checks passed! Ready to push 🚀"
