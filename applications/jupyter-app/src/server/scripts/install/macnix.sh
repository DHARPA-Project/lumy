#!/usr/bin/env bash

set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command returned exit code $?."' EXIT

app_name="Lumy"

if [[ "$OSTYPE" == "darwin"* ]]; then
  # https://pypi.org/project/appdirs/
  app_data_dir="${HOME}/Library/Application Support/${app_name}"

  # As of 17/05/2021 miniconda does not support spaces in the prefix path.
  # https://github.com/ContinuumIO/anaconda-issues/issues/716
  # There is a PR waiting to be accepted that will fix this issue:
  # https://github.com/conda/constructor/pull/449
  # Meanwhile we use an alternative installation prefix and then
  # create a symbolic link to it in the app dir.
  miniconda_install_path="${HOME}/.local/share/${app_name}/miniconda"

  # https://docs.conda.io/projects/continuumio-conda/en/latest/user-guide/install/macos.html
  miniconda_installer_url="https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh"
else
  app_data_dir="${HOME}/.local/share/${app_name}"
  miniconda_install_path="${app_data_dir}/miniconda"

  miniconda_installer_url="https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh"
fi

miniconda_app_dir="${app_data_dir}/miniconda"

miniconda_installer_file="miniconda.sh"

tmp_dir=${TMPDIR}

miniconda_installer_file_location="${tmp_dir}/${miniconda_installer_file}"

default_conda_env_name="default"

vre_backend_git_url="git+https://github.com/DHARPA-Project/codename-vre@master#egg=dharpa-vre-jupyter-middleware&subdirectory=backend/jupyter-middleware"

function download_miniconda {
  echo "Downloading miniconda..."
  if [ ! -f "${miniconda_installer_file_location}" ]; then
    echo "Miniconda installer file ${miniconda_installer_file_location} does not exist. Downloading it."
    curl -o "${miniconda_installer_file_location}" "${miniconda_installer_url}"
  fi
  chmod u+x "${miniconda_installer_file_location}"
  echo "Downloading miniconda... DONE"
}

function run_installer {
  echo "Installing miniconda..."
  miniconda_python_executable="${miniconda_install_path}/bin/python"
  if [ -f "${miniconda_python_executable}" ]; then
    echo "Miniconda is already installed in ${miniconda_install_path}."
  else
    mkdir -p "${miniconda_install_path}"
    download_miniconda

    ${miniconda_installer_file_location} -u -b -p ${miniconda_install_path}
    echo "Miniconda has been installed in ${miniconda_install_path}."
  fi
  echo "Installing miniconda... DONE"
}

function create_link {
  echo "Creating miniconda link..."
  if [ "${miniconda_install_path}" == "${miniconda_app_dir}" ]; then
    echo "Not creating symlink because it is the same directory."
  elif [ ! -L "${miniconda_app_dir}" ]; then
    mkdir -p "${app_data_dir}"
    ln -s ${miniconda_install_path} "${miniconda_app_dir}"
    echo "Created link from ${miniconda_install_path} to '${miniconda_app_dir}'"
  fi
  echo "Creating miniconda link... DONE"
}

function create_default_env {
  echo "Creating miniconda default environment..."
  env_exists=$(conda env list | grep "^default\s" | wc -l)
  if [ ${env_exists} -gt 0 ]; then
    echo "Environment '${default_conda_env_name}' already exists."
  else
    conda create -y --name ${default_conda_env_name} python=3.7
  fi
  echo "Creating miniconda default environment... DONE"
}

function activate_default_env {
  echo "Activating miniconda default environment..."

  conda activate "${default_conda_env_name}"
  echo "Activating miniconda default environment... DONE"
}

function install_python_dependencies {
  pip install "jupyterlab-server>=2.5.2"
}

function install_or_update_vre_backend {
  pip install "${vre_backend_git_url}"
}

run_installer
create_link

source "${miniconda_app_dir}/etc/profile.d/conda.sh"

create_default_env
activate_default_env
install_python_dependencies
install_or_update_vre_backend