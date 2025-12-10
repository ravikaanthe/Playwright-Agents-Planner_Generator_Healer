# PowerShell script to install dependencies for Playwright tests
# This script is designed for Azure DevOps Pipeline execution

param(
    [Parameter(Mandatory=$false)]
    [string]$NodeVersion = "20.x",
    
    [Parameter(Mandatory=$false)]
    [switch]$InstallBrowsers = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$CleanCache = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Browser = "all"
)

Write-Host "=== Playwright Dependencies Installation Script ===" -ForegroundColor Green
Write-Host "Node Version: $NodeVersion" -ForegroundColor Cyan
Write-Host "Install Browsers: $InstallBrowsers" -ForegroundColor Cyan
Write-Host "Clean Cache: $CleanCache" -ForegroundColor Cyan
Write-Host "Browser: $Browser" -ForegroundColor Cyan

try {
    # Set error action preference
    $ErrorActionPreference = "Stop"
    
    # Display environment information
    Write-Host "`n=== Environment Information ===" -ForegroundColor Yellow
    Write-Host "OS: $env:OS" -ForegroundColor White
    Write-Host "Architecture: $env:PROCESSOR_ARCHITECTURE" -ForegroundColor White
    Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor White
    
    # Check if running in Azure DevOps
    if ($env:SYSTEM_TEAMPROJECT) {
        Write-Host "Running in Azure DevOps Pipeline" -ForegroundColor Green
        Write-Host "Project: $env:SYSTEM_TEAMPROJECT" -ForegroundColor White
        Write-Host "Build Number: $env:BUILD_BUILDNUMBER" -ForegroundColor White
    }
    
    # Check Node.js version
    Write-Host "`n=== Checking Node.js ===" -ForegroundColor Yellow
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js Version: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Error "Node.js is not installed or not in PATH"
    }
    
    # Check npm version
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm Version: $npmVersion" -ForegroundColor Green
    } else {
        Write-Error "npm is not installed or not in PATH"
    }
    
    # Clean npm cache if requested
    if ($CleanCache) {
        Write-Host "`n=== Cleaning npm cache ===" -ForegroundColor Yellow
        npm cache clean --force
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to clean npm cache, continuing..."
        } else {
            Write-Host "npm cache cleaned successfully" -ForegroundColor Green
        }
    }
    
    # Install npm dependencies
    Write-Host "`n=== Installing npm dependencies ===" -ForegroundColor Yellow
    
    # Check if package-lock.json exists for npm ci
    if (Test-Path "package-lock.json") {
        Write-Host "Using npm ci for faster, reliable installs" -ForegroundColor Cyan
        npm ci --prefer-offline
    } else {
        Write-Host "Using npm install" -ForegroundColor Cyan
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install npm dependencies"
    } else {
        Write-Host "npm dependencies installed successfully" -ForegroundColor Green
    }
    
    # Install Playwright browsers if requested
    if ($InstallBrowsers) {
        Write-Host "`n=== Installing Playwright browsers ===" -ForegroundColor Yellow
        
        switch ($Browser.ToLower()) {
            "chromium" {
                Write-Host "Installing Chromium only" -ForegroundColor Cyan
                npx playwright install chromium --with-deps
            }
            "firefox" {
                Write-Host "Installing Firefox only" -ForegroundColor Cyan
                npx playwright install firefox --with-deps
            }
            "webkit" {
                Write-Host "Installing WebKit only" -ForegroundColor Cyan
                npx playwright install webkit --with-deps
            }
            "chrome" {
                Write-Host "Installing Chrome only" -ForegroundColor Cyan
                npx playwright install chrome --with-deps
            }
            "all" {
                Write-Host "Installing all browsers" -ForegroundColor Cyan
                npx playwright install --with-deps
            }
            default {
                Write-Host "Installing all browsers (default)" -ForegroundColor Cyan
                npx playwright install --with-deps
            }
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install Playwright browsers"
        } else {
            Write-Host "Playwright browsers installed successfully" -ForegroundColor Green
        }
    }
    
    # Verify Playwright installation
    Write-Host "`n=== Verifying Playwright installation ===" -ForegroundColor Yellow
    $playwrightVersion = npx playwright --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Playwright Version: $playwrightVersion" -ForegroundColor Green
    } else {
        Write-Warning "Could not verify Playwright installation"
    }
    
    # Display installed browsers
    Write-Host "`n=== Installed browsers ===" -ForegroundColor Yellow
    npx playwright install --help | Select-String "Available browsers"
    
    # Create necessary directories
    Write-Host "`n=== Creating directories ===" -ForegroundColor Yellow
    $directories = @("test-results", "playwright-report", "screenshots", "videos", "traces")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "Created directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "Directory already exists: $dir" -ForegroundColor Yellow
        }
    }
    
    # Set environment variables for CI
    if ($env:SYSTEM_TEAMPROJECT) {
        Write-Host "`n=== Setting CI environment variables ===" -ForegroundColor Yellow
        Write-Host "##vso[task.setvariable variable=CI]true"
        Write-Host "##vso[task.setvariable variable=PLAYWRIGHT_BROWSERS_PATH]0"
        Write-Host "CI environment variables set" -ForegroundColor Green
    }
    
    Write-Host "`n=== Installation completed successfully! ===" -ForegroundColor Green
    
} catch {
    Write-Host "`n=== Installation failed! ===" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor Red
    exit 1
}

# Display summary
Write-Host "`n=== Installation Summary ===" -ForegroundColor Magenta
Write-Host "✓ Node.js and npm verified" -ForegroundColor Green
Write-Host "✓ npm dependencies installed" -ForegroundColor Green
if ($InstallBrowsers) {
    Write-Host "✓ Playwright browsers installed" -ForegroundColor Green
}
Write-Host "✓ Required directories created" -ForegroundColor Green
Write-Host "✓ Environment prepared for testing" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run tests with: npm run test" -ForegroundColor White
Write-Host "2. Run specific browser tests with: npm run test:chromium" -ForegroundColor White
Write-Host "3. View reports with: npm run report:show" -ForegroundColor White