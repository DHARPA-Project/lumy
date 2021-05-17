#! /usr/bin/env bash

app_name="DHARPA VRE"

# https://pypi.org/project/appdirs/
app_data_dir="~/Library/Application Support/${app_name}"
# app_data_dir="~/.dharpa"
miniconda_app_dir="${app_data_dir}/miniconda"

# https://docs.conda.io/projects/continuumio-conda/en/latest/user-guide/install/macos.html
miniconda_installer_url="https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh"
miniconda_installer_file="miniconda.sh"

tmp_dir=${TMPDIR}

miniconda_installer_file_location="${tmp_dir}/${miniconda_installer_file}"


# 1. Check if already installed
miniconda_python_executable="${miniconda_app_dir}/python" # XXX
if [ -f "${miniconda_python_executable}" ]; then
  echo "Miniconda is already installed in ${miniconda_app_dir}. Exiting."
  exit 0
fi

# 2. Download installer if needed
if [ ! -f "${miniconda_installer_file_location}" ]; then
  echo "Miniconda installer file ${miniconda_installer_file_location} does not exist. Downloading it."
  wget "${miniconda_installer_url}" -O "${miniconda_installer_file_location}"
fi

# 3. Run installer
echo "Installing miniconda"
mkdir -p "${miniconda_app_dir}"
chmod u+x "${miniconda_installer_file_location}"
installation_path=$(printf %q "$miniconda_app_dir") # escape spaces
${miniconda_installer_file_location} -u -b -p ${installation_path}

# echo "hello ${app_data_dir} ${tmp_dir}"
# sed -i -e '353d' "$TMPDIR/miniconda.sh"