import setuptools
import os.path
import json

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

with open(os.path.join(REPO_DIR, 'package.json')) as fid:
    repo_data = json.load(fid)


__version__ = '0.1.0'
description = 'DHARPA VRE Jupyter middleware'

with open('README.md', 'r') as fh:
    long_description = fh.read()


setup_args = dict(
    name='dharpa-vre-jupyter-middleware',
    version=__version__,
    url=repo_data.get('homepage'),
    author=repo_data.get('author'),
    description=description,
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    install_requires=[
        'ipython',
        'ipykernel',
        'tinypubsub>=0.1.0',
        'dacite',
        'stringcase>=1.2.0',
        'pyyaml',
        'pyarrow==3.0.0',
        'kiara@http://github.com/DHARPA-Project/kiara/tarball/master#egg=kiara'
    ],
    zip_safe=False,
    include_package_data=True,
    python_requires=">=3.7",
    license=repo_data.get('license'),
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab", "JupyterLab3"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
    entry_points={
        'kiara.modules': [
            'dataUpload=dharpa.vre.modules.data_upload:DataUploadModule',
            'dataSelection=dharpa.vre.modules.data_selection:DataSelectionModule',  # noqa
            'networkAnalysisDataMapping=dharpa.vre.modules.network_analysis:NetworkAnalysisDataMappingModule',  # noqa
            'networkAnalysisDataVis=dharpa.vre.modules.network_analysis:NetworkAnalysisDataVisModule',  # noqa
            'twoArgsMathFunction=dharpa.vre.modules.two_args_math_fn:TwoArgsMathFnModule',  # noqa
            # 'simplePlot=kiara_modules.default.dev:DummyModule',
        ],
        'kiara.pipelines': [
            'mock=dharpa.vre.context:mock'
        ]
    }
)

if __name__ == "__main__":
    setuptools.setup(**setup_args)
