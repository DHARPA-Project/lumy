#!/usr/bin/env pwsh

$ErrorActionPreference = "Stop"

$is_windows = [environment]::OSVersion.Platform.ToString().ToLower().StartsWith("win")

$app_name = "Lumy"

# https://pypi.org/project/appdirs/

# As of 17/05/2021 miniconda does not support spaces in the prefix path.
# https://github.com/ContinuumIO/anaconda-issues/issues/716
# There is a PR waiting to be accepted that will fix this issue:
# https://github.com/conda/constructor/pull/449
# Meanwhile we use an alternative installation prefix and then
# create a symbolic link to it in the app dir.

if ($is_windows) {
  $app_data_dir = "$HOME\Application Data\Local Settings\${app_name}\${app_name}"
  $drive_name = $pwd.drive.name

  $miniconda_install_path = "${drive_name}:\apps\${app_name}\miniconda"
  # $miniconda_app_dir = "${app_data_dir}\miniconda"

  # NOTE: On Windows only adminstrator can create links.
  # Therefore we use the cuistom "apps" installation path without creating
  # a symlink in the $app_data_dir
  $miniconda_app_dir = $miniconda_install_path

  # https://docs.conda.io/projects/continuumio-conda/en/latest/user-guide/install/windows.html
  $miniconda_installer_url = "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe"
  $miniconda_python_executable = "${miniconda_install_path}\python.exe"
}
else {
  # Assuming mac
  $app_data_dir = "${HOME}/Library/Application Support/${app_name}"
  $miniconda_app_dir = "${app_data_dir}/miniconda"
  $miniconda_install_path = "${HOME}/.local/share/${app_name}/miniconda"
  # https://docs.conda.io/projects/continuumio-conda/en/latest/user-guide/install/macos.html
  $miniconda_installer_url = "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh"
  $miniconda_python_executable = "${miniconda_install_path}/bin/python"
}


$tmp_dir = [System.IO.Path]::GetTempPath()

if ($is_windows) {
  $miniconda_installer_file = "miniconda.exe"
  $miniconda_installer_file_location = "${tmp_dir}\${miniconda_installer_file}"
  $miniconda_hooks = "${miniconda_app_dir}\shell\condabin\conda-hook.ps1"
}
else {
  $miniconda_installer_file = "miniconda.sh"
  $miniconda_installer_file_location = "${tmp_dir}/${miniconda_installer_file}"
  $miniconda_hooks = "${miniconda_app_dir}/shell/condabin/conda-hook.ps1"
}


$default_conda_env_name = "default"

function Start-DownloadMiniconda {
  Write-Host "Downloading miniconda..."
  $installer_file_exists = Test-Path -Path $miniconda_installer_file_location -PathType Leaf

  if (!$installer_file_exists) {
    Write-Host "Miniconda installer file ${miniconda_installer_file_location} does not exist. Downloading it."
    Invoke-WebRequest -Uri $miniconda_installer_url -OutFile "${miniconda_installer_file_location}"
  }
  if (!$is_windows) {
    chmod u+x "${miniconda_installer_file_location}"
    $code = $LastExitCode
    if ($code -ne 0) {
      throw "chmod exited with code: ${code}"
    }
  }
  Write-Host "Downloading miniconda... DONE"
}

function Start-RunInstaller {
  Write-Host "Installing miniconda..."
  $python_executable_exists = Test-Path -Path $miniconda_python_executable -PathType Leaf

  if ($python_executable_exists) {
    Write-Host "Miniconda is already installed in ${miniconda_install_path}."
  }
  else {
    New-Item -Path $miniconda_install_path -ItemType "directory" -Force
    Start-DownloadMiniconda

    if (!$is_windows) {
      $install_process = Start-Process -FilePath "${miniconda_installer_file_location}" -ArgumentList "-u -b -p ${miniconda_install_path}" -PassThru -Wait
      if ($install_process.ExitCode -ne 0) {
        $code = $install_process.ExitCode
        throw "Install script exited with code ${code}"
      }
    }
    else {
      $installer_args = "/InstallationType=JustMe /S /RegisterPython=0 /AddToPath=0 /D=${miniconda_install_path}"
      Write-Host "Running conda installer ${miniconda_installer_file_location} with ${installer_args}"
      # https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html
      $install_process = Start-Process -FilePath "${miniconda_installer_file_location}" -ArgumentList $installer_args -PassThru -Wait
      if ($install_process.ExitCode -ne 0) {
        $code = $install_process.ExitCode
        throw "Install script exited with code ${code}"
      }
    }
    Write-Host "Miniconda has been installed in ${miniconda_install_path}."
  }
  Write-Host "Installing miniconda... DONE"
}

function Start-CreateLink {
  Write-Host "Creating miniconda link..."
  if ($is_windows) {
    Write-Host "Not creating links on Windows"
    return
  }

  bash -c "test -L \"${miniconda_app_dir}\""
  $link_exists = $LastExitCode

  if (!$link_exists) {
    mkdir -p "${app_data_dir}"
    $code = $LastExitCode
    if ($code -ne 0) {
      throw "mkdir exited with code: ${code}"
    }
    ln -s ${miniconda_install_path} "${miniconda_app_dir}"    
    $code = $LastExitCode
    if ($code -ne 0) {
      throw "ln exited with code: ${code}"
    }
    Write-Host "Created link from ${miniconda_install_path} to '${miniconda_app_dir}'"
  }
  Write-Host "Creating miniconda link... DONE"
}


function Start-CreateDefaultEnv {
  Write-Host "Creating miniconda default environment..."

  $conda_envs = conda env list
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'conda env list' exited with code: ${code} | ${conda_envs}"
  }

  $default_envs = $conda_envs | Select-String -Pattern "^default\s"
  # env_exists=$(conda env list | grep "^default\s" | wc -l)
  if ($default_envs.length -gt 0) {
    Write-Host "Environment '${default_conda_env_name}' already exists."
  }
  else {
    conda create -y --name ${default_conda_env_name} python=3.7
    $code = $LastExitCode
    if ($code -ne 0) {
      throw "'conda create' exited with code: ${code}"
    }
  }

  Write-Host "Creating miniconda default environment... DONE"
}

function Start-ActivateDefaultEnv {
  Write-Host "Activating miniconda default environment..."

  conda activate "${default_conda_env_name}"
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'conda activate' exited with code: ${code}"
  }
  Write-Host "Activating miniconda default environment... DONE"
}

function Start-InstallPythonDependencies {
  pip install "jupyterlab-server>=2.5.2"
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'pip install' exited with code: ${code}"
  }
}

function Start-InstallOrUpdateVreBackend {
  pip install -U --extra-index-url https://pypi.fury.io/dharpa/ lumy-jupyter-middleware
  $code = $LastExitCode
  if ($code -ne 0) {
    throw "'pip install' exited with code: ${code}"
  }
}


Start-RunInstaller
Start-CreateLink

Import-Module $miniconda_hooks

Start-CreateDefaultEnv
Start-ActivateDefaultEnv
Start-InstallPythonDependencies
Start-InstallOrUpdateVreBackend

exit 0