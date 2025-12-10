# PowerShell script to run Playwright tests with comprehensive reporting
# This script is designed for Azure DevOps Pipeline execution

param(
    [Parameter(Mandatory=$false)]
    [string]$Project = "chromium",
    
    [Parameter(Mandatory=$false)]
    [string]$TestPattern = "**/*.spec.ts",
    
    [Parameter(Mandatory=$false)]
    [string]$Grep = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Headed = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Debug = $false,
    
    [Parameter(Mandatory=$false)]
    [int]$Workers = 1,
    
    [Parameter(Mandatory=$false)]
    [int]$Retries = 2,
    
    [Parameter(Mandatory=$false)]
    [switch]$UpdateSnapshots = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFormat = "junit,html",
    
    [Parameter(Mandatory=$false)]
    [string]$BaseURL = "https://www.saucedemo.com"
)

Write-Host "=== Playwright Test Execution Script ===" -ForegroundColor Green
Write-Host "Project: $Project" -ForegroundColor Cyan
Write-Host "Test Pattern: $TestPattern" -ForegroundColor Cyan
Write-Host "Grep: $Grep" -ForegroundColor Cyan
Write-Host "Workers: $Workers" -ForegroundColor Cyan
Write-Host "Retries: $Retries" -ForegroundColor Cyan

try {
    # Set error action preference
    $ErrorActionPreference = "Stop"
    
    # Display environment information
    Write-Host "`n=== Environment Information ===" -ForegroundColor Yellow
    Write-Host "Base URL: $BaseURL" -ForegroundColor White
    Write-Host "CI Mode: $env:CI" -ForegroundColor White
    Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor White
    
    # Check if running in Azure DevOps
    if ($env:SYSTEM_TEAMPROJECT) {
        Write-Host "Running in Azure DevOps Pipeline" -ForegroundColor Green
        Write-Host "Project: $env:SYSTEM_TEAMPROJECT" -ForegroundColor White
        Write-Host "Build Number: $env:BUILD_BUILDNUMBER" -ForegroundColor White
        Write-Host "Source Branch: $env:BUILD_SOURCEBRANCHNAME" -ForegroundColor White
    }
    
    # Verify Playwright installation
    Write-Host "`n=== Verifying Playwright installation ===" -ForegroundColor Yellow
    $playwrightVersion = npx playwright --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Playwright Version: $playwrightVersion" -ForegroundColor Green
    } else {
        Write-Error "Playwright is not installed or not accessible"
    }
    
    # Clean previous test results
    Write-Host "`n=== Cleaning previous test results ===" -ForegroundColor Yellow
    $cleanDirs = @("test-results", "playwright-report")
    foreach ($dir in $cleanDirs) {
        if (Test-Path $dir) {
            Remove-Item -Path $dir -Recurse -Force
            Write-Host "Cleaned directory: $dir" -ForegroundColor Green
        }
    }
    
    # Create output directories
    Write-Host "`n=== Creating output directories ===" -ForegroundColor Yellow
    $outputDirs = @("test-results", "playwright-report", "screenshots", "videos", "traces")
    foreach ($dir in $outputDirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "Created directory: $dir" -ForegroundColor Green
        }
    }
    
    # Set environment variables
    $env:CI = "true"
    $env:BASE_URL = $BaseURL
    $env:PLAYWRIGHT_BROWSERS_PATH = "0"
    
    # Build Playwright command
    $playwrightCmd = "npx playwright test"
    
    # Add project filter
    if ($Project -and $Project -ne "all") {
        $playwrightCmd += " --project=$Project"
    }
    
    # Add test pattern
    if ($TestPattern -and $TestPattern -ne "**/*.spec.ts") {
        $playwrightCmd += " $TestPattern"
    }
    
    # Add grep filter
    if ($Grep) {
        $playwrightCmd += " --grep=`"$Grep`""
    }
    
    # Add workers
    $playwrightCmd += " --workers=$Workers"
    
    # Add retries
    $playwrightCmd += " --retries=$Retries"
    
    # Add headed mode
    if ($Headed) {
        $playwrightCmd += " --headed"
    }
    
    # Add debug mode
    if ($Debug) {
        $playwrightCmd += " --debug"
    }
    
    # Add update snapshots
    if ($UpdateSnapshots) {
        $playwrightCmd += " --update-snapshots"
    }
    
    # Add reporter configuration for CI
    if ($env:CI -eq "true") {
        $playwrightCmd += " --reporter=junit,html,blob"
    }
    
    Write-Host "`n=== Test Execution Command ===" -ForegroundColor Yellow
    Write-Host $playwrightCmd -ForegroundColor White
    
    # Start test execution
    Write-Host "`n=== Starting test execution ===" -ForegroundColor Yellow
    $startTime = Get-Date
    
    # Execute tests
    Invoke-Expression $playwrightCmd
    $testExitCode = $LASTEXITCODE
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    # Display execution results
    Write-Host "`n=== Test Execution Completed ===" -ForegroundColor Yellow
    Write-Host "Duration: $($duration.ToString('hh\:mm\:ss'))" -ForegroundColor White
    Write-Host "Exit Code: $testExitCode" -ForegroundColor White
    
    if ($testExitCode -eq 0) {
        Write-Host "All tests passed! ✓" -ForegroundColor Green
    } else {
        Write-Host "Some tests failed! ✗" -ForegroundColor Red
    }
    
    # Check for test results
    Write-Host "`n=== Test Results Summary ===" -ForegroundColor Yellow
    
    if (Test-Path "test-results/results.xml") {
        Write-Host "✓ JUnit results file created" -ForegroundColor Green
    } else {
        Write-Host "✗ JUnit results file not found" -ForegroundColor Red
    }
    
    if (Test-Path "playwright-report/index.html") {
        Write-Host "✓ HTML report created" -ForegroundColor Green
    } else {
        Write-Host "✗ HTML report not found" -ForegroundColor Red
    }
    
    # Count test artifacts
    if (Test-Path "test-results") {
        $screenshots = Get-ChildItem -Path "test-results" -Filter "*.png" -Recurse | Measure-Object
        $videos = Get-ChildItem -Path "test-results" -Filter "*.webm" -Recurse | Measure-Object
        $traces = Get-ChildItem -Path "test-results" -Filter "*.zip" -Recurse | Measure-Object
        
        Write-Host "Screenshots: $($screenshots.Count)" -ForegroundColor White
        Write-Host "Videos: $($videos.Count)" -ForegroundColor White
        Write-Host "Traces: $($traces.Count)" -ForegroundColor White
    }
    
    # Set Azure DevOps variables for test results
    if ($env:SYSTEM_TEAMPROJECT) {
        Write-Host "`n=== Setting Azure DevOps variables ===" -ForegroundColor Yellow
        Write-Host "##vso[task.setvariable variable=TEST_EXIT_CODE]$testExitCode"
        Write-Host "##vso[task.setvariable variable=TEST_DURATION]$($duration.TotalMinutes)"
        
        if ($testExitCode -eq 0) {
            Write-Host "##vso[task.setvariable variable=TEST_RESULT]PASSED"
            Write-Host "##vso[task.complete result=Succeeded;]All tests passed"
        } else {
            Write-Host "##vso[task.setvariable variable=TEST_RESULT]FAILED"
            Write-Host "##vso[task.complete result=Failed;]Some tests failed"
        }
    }
    
    # Generate test summary for Azure DevOps
    if ($env:SYSTEM_TEAMPROJECT -and (Test-Path "playwright-report/index.html")) {
        Write-Host "`n=== Generating test summary ===" -ForegroundColor Yellow
        $summaryFile = "test-results/test-summary.md"
        
        @"
# Playwright Test Results

## Execution Details
- **Project**: $Project
- **Duration**: $($duration.ToString('hh\:mm\:ss'))
- **Exit Code**: $testExitCode
- **Status**: $(if ($testExitCode -eq 0) { "✅ PASSED" } else { "❌ FAILED" })

## Artifacts
- **Screenshots**: $($screenshots.Count)
- **Videos**: $($videos.Count)
- **Traces**: $($traces.Count)

## Reports
- [HTML Report](playwright-report/index.html)
- [JUnit Results](test-results/results.xml)

## Environment
- **Base URL**: $BaseURL
- **Workers**: $Workers
- **Retries**: $Retries
- **Browser**: $Project
"@ | Out-File -FilePath $summaryFile -Encoding UTF8
        
        Write-Host "Test summary generated: $summaryFile" -ForegroundColor Green
    }
    
    # Exit with test result code
    exit $testExitCode
    
} catch {
    Write-Host "`n=== Test execution failed! ===" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor Red
    
    # Set failure variables for Azure DevOps
    if ($env:SYSTEM_TEAMPROJECT) {
        Write-Host "##vso[task.setvariable variable=TEST_RESULT]ERROR"
        Write-Host "##vso[task.complete result=Failed;]Script execution failed"
    }
    
    exit 1
}

Write-Host "`n=== Script execution completed ===" -ForegroundColor Magenta