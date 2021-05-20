#!/usr/bin/env bash

set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command returned exit code $?."' EXIT

app_name="Lumy"
app_data_dir="${HOME}/Library/Application Support/${app_name}"
miniconda_app_dir="${app_data_dir}/miniconda"
default_conda_env_name="default"
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
conda_sh="${miniconda_app_dir}/etc/profile.d/conda.sh"

if [ "$1" != "--skip-conda" ]; then
  if [ ! -f "${conda_sh}" ]; then
    echo "Conda environment is not ready: ${miniconda_app_dir}"
    exit 1
  fi

  source "${conda_sh}"
  conda activate "${default_conda_env_name}"
  echo "Activated conda env: ${default_conda_env_name}"
  python_exec=$(which python)
  echo "Python executable: ${python_exec}"
else
  echo "Skipped activating conda environment"
fi


if [ "$1" != "--dry-run" ]; then
  python "${script_dir}/../../main.py"
fi
