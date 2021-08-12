import pkgutil


def get_code() -> str:
    return pkgutil.get_data(__name__, "resources/index.js").decode('utf-8')
