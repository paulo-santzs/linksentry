$ErrorActionPreference = 'Stop'

$git = 'C:\Program Files\Git\cmd\git.exe'
$gh = (Get-Command gh.exe -ErrorAction Stop).Source
$project = $PSScriptRoot

& $gh auth status
& $git -C $project push origin main
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível enviar o projeto ao GitHub.' }

$previousErrorPreference = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& $gh api --silent repos/paulo-santzs/linksentry/pages 2> $null
$pagesExists = $LASTEXITCODE -eq 0
$ErrorActionPreference = $previousErrorPreference

if ($pagesExists) {
  & $gh api --method PUT repos/paulo-santzs/linksentry/pages -f build_type=workflow *> $null
} else {
  & $gh api --method POST repos/paulo-santzs/linksentry/pages -f build_type=workflow *> $null
}
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível ativar o GitHub Pages.' }

& $gh workflow run pages.yml --repo paulo-santzs/linksentry --ref main
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível iniciar a publicação.' }

Start-Sleep -Seconds 3
$runId = & $gh run list --repo paulo-santzs/linksentry --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'
if (-not $runId) { throw 'A publicação foi solicitada, mas ainda não apareceu no GitHub Actions.' }

& $gh run watch $runId --repo paulo-santzs/linksentry --exit-status
if ($LASTEXITCODE -ne 0) { throw 'O GitHub Actions encontrou uma falha durante a publicação.' }

Write-Host 'LinkSentry publicado com sucesso:'
Write-Host 'https://paulo-santzs.github.io/linksentry/'
