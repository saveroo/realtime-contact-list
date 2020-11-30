$cd = Get-Location
$gotoFront = (cd $cd\front)
$runFront = (yarn serve)
$gotoFunctions = (cd $cd\functions)
$runFunctions = (npm run serve)

Write-Host "Starting VUE 3 Development Server"
wt.exe new-tab -ArgumentList "PowerShell.exe", "-NoExit", "-Command", "$gotoFront -and $runFront",
Write-Host "Starting GCP Development Server"
wt.exe new-tab -ArgumentList "PowerShell.exe", "-NoExit", "-Command", "$gotoFunctions -and $runFunctions"