$ErrorActionPreference = 'Stop'

$git = 'C:\Program Files\Git\cmd\git.exe'
$gh = (Get-Command gh.exe -ErrorAction Stop).Source
$project = $PSScriptRoot

& $gh auth status
& $git -C $project push origin main
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível enviar o projeto ao GitHub.' }

& $gh api repos/paulo-santzs/linksentry/pages *> $null
if ($LASTEXITCODE -eq 0) {
  & $gh api --method PUT repos/paulo-santzs/linksentry/pages -f build_type=workflow *> $null
} else {
  & $gh api --method POST repos/paulo-santzs/linksentry/pages -f build_type=workflow *> $null
}

Write-Host 'LinkSentry enviado. A publicação será concluída em alguns minutos:'
Write-Host 'https://paulo-santzs.github.io/linksentry/'
