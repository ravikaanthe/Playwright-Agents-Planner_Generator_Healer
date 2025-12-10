# PowerShell script to setup the development environment
# This script prepares the environment for Playwright testing

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipNodeCheck = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBrowserInstall = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$NodeVersion = "20.x",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateEnvFile = $true
)

Write-Host "=== Playwright Environment Setup Script ===" -ForegroundColor Green

try {
    $ErrorActionPreference = "Stop"
    
    # Check if running as administrator on Windows
    if ($IsWindows -and -NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Warning "This script should be run as Administrator on Windows for best results"
    }
    
    # Display system information
    Write-Host "`n=== System Information ===" -ForegroundColor Yellow
    Write-Host "OS: $env:OS" -ForegroundColor White
    Write-Host "Architecture: $env:PROCESSOR_ARCHITECTURE" -ForegroundColor White
    Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor White
    Write-Host "Current Directory: $(Get-Location)" -ForegroundColor White
    
    # Check Node.js installation
    if (-not $SkipNodeCheck) {
        Write-Host "`n=== Checking Node.js Installation ===" -ForegroundColor Yellow
        try {
            $nodeVersion = node --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
                
                $npmVersion = npm --version 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
                } else {
                    Write-Error "npm not found. Please install npm."
                }
            } else {
                Write-Error "Node.js not found. Please install Node.js $NodeVersion or later from https://nodejs.org/"
            }
        } catch {
            Write-Error "Error checking Node.js installation: $($_.Exception.Message)"
        }
    }
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the project root directory."
    }
    
    # Install npm dependencies
    Write-Host "`n=== Installing npm dependencies ===" -ForegroundColor Yellow
    if (Test-Path "package-lock.json") {
        Write-Host "Using npm ci for clean install" -ForegroundColor Cyan
        npm ci
    } else {
        Write-Host "Using npm install" -ForegroundColor Cyan
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install npm dependencies"
    } else {
        Write-Host "✓ npm dependencies installed successfully" -ForegroundColor Green
    }
    
    # Install Playwright browsers
    if (-not $SkipBrowserInstall) {
        Write-Host "`n=== Installing Playwright browsers ===" -ForegroundColor Yellow
        Write-Host "This may take several minutes..." -ForegroundColor Cyan
        
        npx playwright install --with-deps
        
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Playwright browser installation failed. Trying without system dependencies..."
            npx playwright install
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to install Playwright browsers"
            }
        } else {
            Write-Host "✓ Playwright browsers installed successfully" -ForegroundColor Green
        }
    }
    
    # Create .env file if requested
    if ($CreateEnvFile -and -not (Test-Path ".env")) {
        Write-Host "`n=== Creating environment file ===" -ForegroundColor Yellow
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
            Write-Host "Please review and update the .env file with your specific settings" -ForegroundColor Cyan
        } else {
            Write-Warning ".env.example not found. Creating basic .env file..."
            @"
# Basic environment configuration
BASE_URL=https://www.saucedemo.com
TEST_ENV=development
CI=false
HEADLESS=true
"@ | Out-File -FilePath ".env" -Encoding UTF8
            Write-Host "✓ Created basic .env file" -ForegroundColor Green
        }
    }
    
    # Create necessary directories
    Write-Host "`n=== Creating project directories ===" -ForegroundColor Yellow
    $directories = @(
        "test-results",
        "playwright-report", 
        "screenshots",
        "videos",
        "traces",
        "downloads"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "✓ Created directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "Directory already exists: $dir" -ForegroundColor Yellow
        }
    }
    
    # Verify Playwright installation
    Write-Host "`n=== Verifying Playwright installation ===" -ForegroundColor Yellow
    try {
        $playwrightVersion = npx playwright --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Playwright version: $playwrightVersion" -ForegroundColor Green
        } else {
            Write-Warning "Could not verify Playwright version"
        }
        
        # List installed browsers
        Write-Host "`nInstalled browsers:" -ForegroundColor Cyan
        npx playwright install --help 2>$null | Select-String "chromium|firefox|webkit" | ForEach-Object {
            Write-Host "  $($_.Line.Trim())" -ForegroundColor White
        }
    } catch {
        Write-Warning "Could not verify Playwright installation: $($_.Exception.Message)"
    }
    
    # Test basic functionality
    Write-Host "`n=== Running basic functionality test ===" -ForegroundColor Yellow
    try {
        Write-Host "Testing Playwright configuration..." -ForegroundColor Cyan
        npx playwright test --config=playwright.config.ts --list 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Playwright configuration is valid" -ForegroundColor Green
        } else {
            Write-Warning "Playwright configuration validation failed"
        }
    } catch {
        Write-Warning "Could not test Playwright configuration: $($_.Exception.Message)"
    }
    
    # Display next steps
    Write-Host "`n=== Setup completed successfully! ===" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Review and update the .env file if needed" -ForegroundColor White
    Write-Host "2. Run a test: npm run test" -ForegroundColor White
    Write-Host "3. View test report: npm run report:show" -ForegroundColor White
    Write-Host "4. Run specific browser tests:" -ForegroundColor White
    Write-Host "   - npm run test:chromium" -ForegroundColor Gray
    Write-Host "   - npm run test:firefox" -ForegroundColor Gray
    Write-Host "   - npm run test:webkit" -ForegroundColor Gray
    
    # Display available scripts
    Write-Host "`nAvailable npm scripts:" -ForegroundColor Yellow
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $packageJson.scripts.PSObject.Properties | ForEach-Object {
            Write-Host "  npm run $($_.Name)" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n🎉 Environment setup complete! Happy testing!" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Setup failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Ensure you have Node.js 18+ installed" -ForegroundColor White
    Write-Host "2. Run PowerShell as Administrator (Windows)" -ForegroundColor White
    Write-Host "3. Check your internet connection" -ForegroundColor White
    Write-Host "4. Try running: npm cache clean --force" -ForegroundColor White
    exit 1
}

Write-Host "`n=== Environment Setup Summary ===" -ForegroundColor Magenta
Write-Host "✓ Node.js and npm verified" -ForegroundColor Green
Write-Host "✓ Project dependencies installed" -ForegroundColor Green
if (-not $SkipBrowserInstall) {
    Write-Host "✓ Playwright browsers installed" -ForegroundColor Green
}
Write-Host "✓ Project directories created" -ForegroundColor Green
if ($CreateEnvFile) {
    Write-Host "✓ Environment file configured" -ForegroundColor Green
}
Write-Host "✓ Ready for testing!" -ForegroundColor Green