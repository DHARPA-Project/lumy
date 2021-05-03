import json
import os

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.extension.handler import (
    ExtensionHandlerJinjaMixin,
    ExtensionHandlerMixin,
)
from jupyter_server.utils import url_path_join as ujoin
from jupyterlab_server import LabServerApp


HERE = os.path.dirname(__file__)
PROJECT_DIR = os.path.normpath(os.path.join(HERE, '..', '..'))

with open(os.path.abspath(os.path.join(PROJECT_DIR, 'package.json'))) as fid:
    pkg = json.load(fid)
    version = pkg['version']
    name = pkg['name'].replace('@', '').replace('/', '_')

serverapp_config = {}

# exposed for use in electron
port_override = os.getenv('JUPYTER_PORT_OVERRIDE', None)
if port_override is not None:
    serverapp_config['port'] = int(port_override)

# exposed for use in electron
origin_pat_override = os.getenv('JUPYTER_ORIGIN_PAT_OVERRIDE', None)
if origin_pat_override is not None:
    serverapp_config['allow_origin_pat'] = origin_pat_override


def _jupyter_server_extension_points():
    return [
        {
            'module': __name__,
            'app': VREApp
        }
    ]


class VREHandler(
    ExtensionHandlerJinjaMixin,
    ExtensionHandlerMixin,
    JupyterHandler
):
    """Handle requests between the main app page and jupyterlab server."""

    def get(self):
        """Get the main page for the application's interface."""
        config_data = {
            # Use camelCase here, since that's what the lab components expect
            "appVersion": version,
            'baseUrl': self.base_url,
            'token': self.settings['token'],
            'fullStaticUrl': ujoin(self.base_url, 'static', self.name),
            'frontendUrl': ujoin(self.base_url, '/'),
        }
        return self.write(
            self.render_template(
                'index.html',
                static=self.static_url,
                base_url=self.base_url,
                token=self.settings['token'],
                page_config=config_data
            )
        )


class VREApp(LabServerApp):
    extension_url = '/'
    default_url = '/'
    app_url = '/vre'
    load_other_extensions = False
    name = name
    app_name = 'VRE Jupyter App'
    static_dir = os.path.join(PROJECT_DIR, 'dist', 'webapp')
    templates_dir = os.path.join(HERE, 'templates')
    app_version = version
    # app_settings_dir = os.path.join(
    #     PROJECT_DIR, 'dist', 'application_settings')
    # schemas_dir = os.path.join(PROJECT_DIR, 'dist', 'schemas')
    # themes_dir = os.path.join(PROJECT_DIR, 'dist', 'themes')
    # user_settings_dir = os.path.join(PROJECT_DIR, 'dist', 'user_settings')
    # workspaces_dir = os.path.join(PROJECT_DIR, 'dist', 'workspaces')
    open_browser = False

    serverapp_config = serverapp_config

    def initialize_handlers(self):
        super().initialize_handlers()
        self.handlers.append(('/', VREHandler))


if __name__ == '__main__':
    VREApp.launch_instance()
