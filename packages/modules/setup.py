import json
import os

import setuptools
from lumy_middleware import __version__

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(CURRENT_DIR, 'package.json')) as fid:
    data = json.load(fid)

with open('README.md', 'r') as fh:
    long_description = fh.read()

setup_args = dict(
    name='lumy-modules.network-analysis',
    version=data['version'],
    url=data['homepage'],
    author=data['author'],
    description=data['description'],
    long_description=long_description,
    long_description_content_type="text/markdown",
    package_dir={'': 'pkg'},
    packages=setuptools.find_namespace_packages(where='pkg'),
    install_requires=[],
    zip_safe=True,
    include_package_data=True,
    python_requires=">=3.7",
    license=data['license'],
    platforms="Linux, Mac OS X, Windows",
    keywords=["Lumy"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
    entry_points={
        'lumy.modules': [
            'network_analysis_ui = lumy_modules.network_analysis:get_code'
        ]
    }
)

if __name__ == "__main__":
    setuptools.setup(**setup_args)
