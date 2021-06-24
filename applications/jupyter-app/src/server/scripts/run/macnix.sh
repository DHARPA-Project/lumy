#!/usr/bin/env bash

set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command returned exit code $?."' EXIT

app_name="Lumy"

if [[ "$OSTYPE" == "darwin"* ]]; then
  app_data_dir="${HOME}/Library/Application Support/${app_name}"
else
  app_data_dir="${HOME}/.local/share/${app_name}"
fi

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

# Check that the correct version of middleware is installed
if [ ! -z "$MIDDLEWARE_VERSION" ]; then
  middleware_package="lumy-middleware==$MIDDLEWARE_VERSION"
  current_version=$(pip show --no-input lumy_middleware | grep "^Version:" | cut -d' ' -f2)
  if [ "$current_version" != "$MIDDLEWARE_VERSION" ]; then
    echo "Current version of middleware ($current_version) is different from required ($MIDDLEWARE_VERSION). Exiting."
    exit 1
  else
    echo "Correct middleware version detected: $current_version"
  fi
else
  echo "Not checking middleware version because the required version is not defined in MIDDLEWARE_VERSION: $MIDDLEWARE_VERSION"
fi


if [ "$1" != "--dry-run" ]; then
  python "${script_dir}/../../main.py"
else
  echo "Dry run. Not starting the app."
fi
