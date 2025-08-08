@echo off
echo 🚀 Setting up PennyCam Production Environment...
echo.

echo 📁 Creating directory structure...
if not exist "public\sounds" mkdir "public\sounds"
if not exist "app\api" mkdir "app\api"
if not exist "components\ui" mkdir "components\ui"
if not exist "lib" mkdir "lib"

echo.
echo 📦 Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🎵 Checking audio files...
if exist "public\sounds\treat-dispense.mp3" (
    echo ✅ treat-dispense.mp3 found
) else (
    echo ⚠️  treat-dispense.mp3 missing - please copy your MP3 files to public\sounds\
)

if exist "public\sounds\penny-meow.mp3" (
    echo ✅ penny-meow.mp3 found
) else (
    echo ⚠️  penny-meow.mp3 missing - please copy your MP3 files to public\sounds\
)

if exist "public\sounds\pspspsp.mp3" (
    echo ✅ pspspsp.mp3 found
) else (
    echo ⚠️  pspspsp.mp3 missing - please copy your MP3 files to public\sounds\
)

echo.
echo 🔑 Checking environment variables...
if exist ".env.local" (
    echo ✅ .env.local found
) else (
    echo ⚠️  .env.local missing - creating template...
    echo # Stripe Configuration (Test Mode) > .env.local
    echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here >> .env.local
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here >> .env.local
    echo. >> .env.local
    echo # App Configuration >> .env.local
    echo NEXTAUTH_SECRET=your-random-secret-string-here >> .env.local
    echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
    echo.
    echo ✅ Created .env.local template - please add your actual keys
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Copy your MP3 files to: public\sounds\
echo 2. Add your Stripe keys to: .env.local
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
pause
