@echo off
setlocal enabledelayedexpansion

rem install-agentic.bat — Agentic Framework Installer (CMD)
rem Copies all .agentic/ and .opencode/ contents to TARGET_DIR, sets up AGENTS.md
rem from template, and configures project-specific config.json.

set "PROJECT_NAME=%~1"
set "TARGET_DIR=%~2"

set "SCRIPT_DIR=%~dp0"
rem Remove trailing backslash from SCRIPT_DIR
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

rem Prompt for project name if not provided
if not defined PROJECT_NAME (
    set /p "PROJECT_NAME=Enter project name (e.g., my-project): "
)

rem Validate project name
if not defined PROJECT_NAME (
    echo ERROR: Project name is required.>&2
    exit /b 1
)

rem Prompt for target directory if not provided
if not defined TARGET_DIR (
    set /p "TARGET_DIR=Enter target directory (default: current directory): "
)

rem Default to current directory
if not defined TARGET_DIR set "TARGET_DIR=%CD%"

rem Create TARGET_DIR if it doesn't exist
if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%" || (
        echo ERROR: Failed to create target directory: %TARGET_DIR%>&2
        exit /b 1
    )
)

rem Resolve TARGET_DIR to absolute path
pushd "%TARGET_DIR%" 2>nul && (
    set "TARGET_DIR=!CD!"
    popd
) || (
    echo ERROR: Cannot resolve target directory: %TARGET_DIR%>&2
    exit /b 1
)

rem Safety check: prevent TARGET_DIR from being the script's own directory
if /i "!TARGET_DIR!"=="%SCRIPT_DIR%" (
    echo ERROR: TARGET_DIR cannot be the same directory as this script.>&2
    echo        Running the installer in the source directory would overwrite the original .agentic/ and .opencode/ folders.>&2
    echo        Please specify a different target directory.>&2
    exit /b 1
)

echo.
echo === Agentic Framework Installer ===
echo Project: %PROJECT_NAME%
echo Target: %TARGET_DIR%
echo Source: %SCRIPT_DIR%
echo.

rem Step 1: Copy .agentic/ directories
echo [1/4] Copying .agentic/ framework...
set "AGENTIC_SOURCE=%SCRIPT_DIR%\.agentic"
set "AGENTIC_TARGET=%TARGET_DIR%\.agentic"

if exist "%AGENTIC_SOURCE%" (
    if not exist "%AGENTIC_TARGET%" mkdir "%AGENTIC_TARGET%"
    
    rem Copy all specified directories from .agentic
    for %%D in (brain docs schemas templates) do (
        if exist "%AGENTIC_SOURCE%\%%D" (
            xcopy "%AGENTIC_SOURCE%\%%D" "%AGENTIC_TARGET%\%%D" /E /I /Y /Q >nul 2>&1
            echo   Copied: .agentic/%%D/
        )
    )
    
    rem Copy config.json if exists
    if exist "%AGENTIC_SOURCE%\config.json" (
        copy /y "%AGENTIC_SOURCE%\config.json" "%AGENTIC_TARGET%\config.json" >nul 2>&1
        echo   Copied: .agentic/config.json
    )
) else (
    echo   ERROR: .agentic source not found at %AGENTIC_SOURCE%.>&2
    exit /b 1
)

rem Step 2: Copy .opencode/ (all directories)
echo [2/4] Copying .opencode/ framework...
set "OPENCODE_SOURCE=%SCRIPT_DIR%\.opencode"
set "OPENCODE_TARGET=%TARGET_DIR%\.opencode"

if exist "%OPENCODE_SOURCE%" (
    if not exist "%OPENCODE_TARGET%" mkdir "%OPENCODE_TARGET%"
    
    rem Copy all subdirectories from .opencode
    for /d %%D in ("%OPENCODE_SOURCE%\*") do (
        set "DIR_NAME=%%~nxD"
        xcopy "%%D" "%OPENCODE_TARGET%\!DIR_NAME!" /E /I /Y /Q >nul 2>&1
        echo   Copied: .opencode\!DIR_NAME!/
    )
    
    rem Copy files in .opencode root (if any)
    for %%F in ("%OPENCODE_SOURCE%\*") do (
        if not "%%~xF"=="" (
            copy /y "%%F" "%OPENCODE_TARGET%\" >nul 2>&1
        )
    )
) else (
    echo   ERROR: .opencode source not found at %OPENCODE_SOURCE%.>&2
    exit /b 1
)

rem Step 3: Copy AGENTS.md template to target root
echo [3/4] Copying AGENTS.md...
set "AGENTS_SOURCE=%SCRIPT_DIR%\.agentic\templates\AGENTS_OPENCODE.md"
set "AGENTS_TARGET=%TARGET_DIR%\AGENTS.md"

if exist "%AGENTS_SOURCE%" (
    copy /y "%AGENTS_SOURCE%" "%AGENTS_TARGET%" >nul 2>&1
    echo   Copied: AGENTS.md to target root
) else (
    echo   WARNING: AGENTS_OPENCODE.md not found at %AGENTS_SOURCE%.>&2
)

rem Step 4: Configure .agentic/config.json with project name
echo [4/4] Configuring project settings...
set "CONFIG_PATH=%TARGET_DIR%\.agentic\config.json"

if exist "%CONFIG_PATH%" (
    rem Try jq first
    where jq >nul 2>&1 && (
        jq --arg name "%PROJECT_NAME%" ". + {project: {name: $name, description: \"Project initialized with Agentic Framework\"}}" "%CONFIG_PATH%" > "%CONFIG_PATH%.tmp" 2>nul && move /y "%CONFIG_PATH%.tmp" "%CONFIG_PATH%" >nul 2>&1
        echo   Updated: .agentic/config.json with project name '%PROJECT_NAME%'
    ) || (
        rem Fallback to PowerShell
        where powershell >nul 2>&1 && (
            powershell -NoProfile -Command "$c = Get-Content -Raw '%CONFIG_PATH%' | ConvertFrom-Json; $c | Add-Member -NotePropertyName 'project' -NotePropertyValue @{name='%PROJECT_NAME%';description='Project initialized with Agentic Framework'} -Force; $c | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 '%CONFIG_PATH%'" 2>nul && (
                echo   Updated: .agentic/config.json with project name '%PROJECT_NAME%'
            ) || (
                echo   WARNING: Could not update config.json. Edit manually.
            )
        ) || (
            echo   WARNING: Neither jq nor PowerShell available. config.json not updated.
        )
    )
) else (
    echo   WARNING: config.json not found at %CONFIG_PATH%.>&2
)

rem Verification
echo.
echo Verifying installation...
set "ALL_EXIST=1"

for %%P in (
    ".agentic\config.json"
    ".agentic\schemas\analysis.json"
    ".agentic\schemas\planning.json"
    ".agentic\schemas\implementation.json"
    ".agentic\schemas\verification.json"
    "AGENTS.md"
    ".opencode\agents\analyzer.md"
    ".opencode\agents\planner.md"
    ".opencode\agents\implementer.md"
    ".opencode\agents\verifier.md"
) do (
    if exist "%TARGET_DIR%\%%~P" (
        echo   [OK] %%~P
    ) else (
        echo   [MISSING] %%~P
        set "ALL_EXIST=0"
    )
)

rem Summary
echo.
echo Installation complete!
echo.
echo Project '%PROJECT_NAME%' installed at: %TARGET_DIR%
echo.
echo Next steps:
echo   1. cd %TARGET_DIR%
echo   2. Edit .agentic/config.json to customize pipeline settings
echo   3. Edit AGENTS.md to add project-specific rules
echo   4. Run /analyze ^<task^> in opencode to start the pipeline
echo.

if "!ALL_EXIST!"=="0" (
    echo WARNING: Some files are missing. Verify the source directory.>&2
    exit /b 1
)

exit /b 0
