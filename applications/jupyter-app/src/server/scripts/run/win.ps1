#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

$app_name = "Lumy"

if ($IsWindows) {
  $app_data_dir = "$HOME\Application Data\Local Settings\${app_name}\${app_name}"
  $miniconda_install_path = "{$pwd.drive.name}\apps\${app_name}\miniconda"
  # NOTE: On Windows only adminstrator can create links.
  # Therefore we use the cuistom "apps" installation path without creating
  # a symlink in the $app_data_dir
  $miniconda_app_dir = $miniconda_install_path
}
elseif ($IsMacOS) {
  $app_data_dir = "${HOME}/Library/Application Support/${app_name}"
  $miniconda_app_dir = "${app_data_dir}/miniconda"
}

$script_dir = $PSScriptRoot
$miniconda_hooks = Join-Path $miniconda_app_dir "shell" "condabin" "conda-hook.ps1"
$default_conda_env_name = "default"

if ($args[0] -ne "--skip-conda") {
  # activate conda
  $hook_file_exists = Test-Path -Path $miniconda_hooks -PathType Leaf
  if (!$hook_file_exists) {
    throw "Conda environment is not ready: ${miniconda_app_dir}. File ${miniconda_hooks} not found."
  }

  Import-Module $miniconda_hooks

  conda activate "${default_conda_env_name}"
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'conda activate' exited with code: ${code}"
  }
  Write-Host "Activated conda env: ${default_conda_env_name}"

  $python_exec = (Get-Command python).Path
  Write-Host "Python executable: ${python_exec}"
}
else {
  Write-Host "Skipped activating conda environment"
}

if ($args[0] -ne "--dry-run") {
  $main_file_path = Join-Path $script_dir ".." ".." "main.py"
  python $main_file_path
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'python' exited with code: ${code}"
  }
}
else {
  Write-Host "Dry run. Not starting the app."
}