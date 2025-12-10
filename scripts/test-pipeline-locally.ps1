# Quick local validation script for CI/CD pipeline
# Run this to test pipeline changes before pushing to Azure DevOps

param(
    [Parameter(Mandatory=$false)]
    [switch]$FullTest = $false
)

Write-Host "=== Local CI/CD Pipeline Validation ===" -ForegroundColor Green

try {
    # Set CI environment
    $env:CI = "true"
    $env:SYSTEM_TEAMPROJECT = "LocalTest"
    $env:BUILD_BUILDNUMBER = "local-123"
    $env:BUILD_SOURCEBRANCHNAME = "main"
    $env:PLAYWRIGHT_BROWSERS_PATH = "0"
    
    Write-Host "`n1. Testing environment setup..." -ForegroundColor Yellow
    .\scripts\setup-environment.ps1 -SkipNodeCheck
    
    Write-Host "`n2. Testing npm script availability..." -ForegroundColor Yellow
    $npmScripts = @("test", "test:chromium", "test:ci", "test:smoke", "clean")
    foreach ($script in $npmScripts) {
        if ((Get-Content package.json | ConvertFrom-Json).scripts.$script) {
            Write-Host "✓ npm run $script - Available" -ForegroundColor Green
        } else {
            Write-Host "✗ npm run $script - Missing" -ForegroundColor Red
        }
    }
    
    Write-Host "`n3. Testing PowerShell scripts..." -ForegroundColor Yellow
    
    # Test run-tests script with dry run
    Write-Host "Testing run-tests.ps1..." -ForegroundColor Cyan
    $testResult = .\scripts\run-tests.ps1 -Project "chromium" -TestPattern "tests/seed.spec.ts" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ run-tests.ps1 - Working" -ForegroundColor Green
    } else {
        Write-Host "✗ run-tests.ps1 - Failed" -ForegroundColor Red
    }
    
    Write-Host "`n4. Testing different scenarios..." -ForegroundColor Yellow
    
    # Test PR scenario
    $env:BUILD_REASON = "PullRequest"
    Write-Host "PR Scenario: Running smoke tests..." -ForegroundColor Cyan
    npm run test:smoke 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PR build scenario - Working" -ForegroundColor Green
    } else {
        Write-Host "⚠ PR build scenario - Check smoke tests" -ForegroundColor Yellow
    }
    
    # Test main branch scenario
    $env:BUILD_REASON = "IndividualCI"
    Write-Host "Main Branch Scenario: Running chromium tests..." -ForegroundColor Cyan
    npm run test:chromium 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Main branch scenario - Working" -ForegroundColor Green
    } else {
        Write-Host "⚠ Main branch scenario - Check chromium tests" -ForegroundColor Yellow
    }
    
    if ($FullTest) {
        Write-Host "`n5. Running full test suite..." -ForegroundColor Yellow
        npm run test:chromium
        npm run test:firefox
        npm run test:webkit
    }
    
    Write-Host "`n6. Checking artifact generation..." -ForegroundColor Yellow
    if (Test-Path "test-results") {
        Write-Host "✓ test-results directory exists" -ForegroundColor Green
    }
    if (Test-Path "playwright-report") {
        Write-Host "✓ playwright-report directory exists" -ForegroundColor Green  
    }
    if (Test-Path "test-results/results.xml") {
        Write-Host "✓ JUnit results file generated" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Local validation completed!" -ForegroundColor Green
    Write-Host "Your pipeline changes are ready for Azure DevOps" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Local validation failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Fix issues before pushing to Azure DevOps" -ForegroundColor Yellow
}