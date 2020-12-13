import ping from '../ping';

export default  function (options: { load: () => void; pingSuccessCallback: any; pingFailCallback: any; }) {
    let pingSuccessCallback = null;
    let pingFailCallback = null;

    if(options.load) {
        options.load();
    }
    if(options.pingSuccessCallback) {
        pingSuccessCallback = options.pingSuccessCallback;
    }
    if(options.pingFailCallback) {
        pingFailCallback = options.pingFailCallback;
    }
    // TODO: is browser??
    // if(NL_MODE == 'browser')
    //     ping.start(pingSuccessCallback, pingFailCallback);
}
