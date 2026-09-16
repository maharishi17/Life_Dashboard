$ErrorActionPreference = 'Stop'

# Database configuration
$env:PGPASSWORD = "7875"
$pgDump = "D:\APPS\bin\pg_dump.exe"
$dbName = "life_dashboard"
$dbUser = "postgres"
$dbHost = "localhost"

# Backup file configuration
$dateStr = Get-Date -Format "yyyy-MM-dd"
$backupDir = "C:\Users\USER\LifeDashboardBackups"
$backupFile = "$backupDir\${dbName}_${dateStr}.backup"

# Ensure backup directory exists
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
}

# Run the backup using custom format (-F c) which is highly compressed and easy to restore
Write-Host "Starting backup of database $dbName..."
& $pgDump -U $dbUser -h $dbHost -d $dbName -F c -f $backupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup successful: $backupFile"
} else {
    Write-Host "Backup failed!"
    exit $LASTEXITCODE
}
