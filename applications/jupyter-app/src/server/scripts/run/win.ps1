#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

$is_windows = [environment]::OSVersion.Platform.ToString().ToLower().StartsWith("win")

$app_name = "Lumy"

$script_dir = $PSScriptRoot

if ($is_windows) {
  $app_data_dir = "$HOME\Application Data\Local Settings\${app_name}\${app_name}"
  $drive_name = $pwd.drive.name

  $miniconda_install_path = "${drive_name}:\apps\${app_name}\miniconda"
  # NOTE: On Windows only adminstrator can create links.
  # Therefore we use the cuistom "apps" installation path without creating
  # a symlink in the $app_data_dir
  $miniconda_app_dir = $miniconda_install_path

  $main_file_path = "${script_dir}\..\..\main.py"
  $miniconda_hooks = "${miniconda_app_dir}\shell\condabin\conda-hook.ps1"
}
else {
  $app_data_dir = "${HOME}/Library/Application Support/${app_name}"
  $miniconda_app_dir = "${app_data_dir}/miniconda"

  $main_file_path = "${script_dir}/../../main.py"
  $miniconda_hooks = "${miniconda_app_dir}/shell/condabin/conda-hook.ps1"
}

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

if (![string]::IsNullOrEmpty($env:MIDDLEWARE_VERSION)) {
  $required_middleware_version = $env:MIDDLEWARE_VERSION

  $pip_version_output = pip show --no-input lumy_middleware | Select-String -Pattern "^Version:"
  $current_middleware_version = $pip_version_output -replace '^Version:\s+', ''

  if ($current_middleware_version -ne $required_middleware_version) {
    throw "Current version of middleware ($current_middleware_version) is different from required ($required_middleware_version). Exiting."
  }
  else {
    "Correct middleware version detected: $current_middleware_version"
  }
}
else {
  Write-Host "Not checking middleware version because the required version is not defined in MIDDLEWARE_VERSION: $MIDDLEWARE_VERSION"
}


if ($args[0] -ne "--dry-run") {
  python $main_file_path
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'python' exited with code: ${code}"
  }
}
else {
  Write-Host "Dry run. Not starting the app."
}

exit 0