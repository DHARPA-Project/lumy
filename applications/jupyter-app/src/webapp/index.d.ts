import { SessionContext } from '@jupyterlab/apputils';
import { ServiceManager } from '@jupyterlab/services';
import { KernelView } from '@dharpa-vre/jupyter-support';
declare global {
    interface Window {
        __vre_sessionContext?: SessionContext;
        __vre_widget?: KernelView;
        __vre_serviceManager?: ServiceManager.IManager;
    }
}
