
import * as sha256 from "js-sha256"

const apiUrl = "http://127.0.0.1:13253/api";

const socket = {

    counter: 0,

    ping () {

        setInterval(() => {
            this.post({id: "ping", method: "get"}, () => {});
        }, 5000);

    },
    
    post (rawData: {
        id: string
        method: string,
        body?: object 
    }, callBack: {(error: boolean, data?: any): void}) {
        
        
        const nonce = (window as any).location.hash.split("=")[1]
        
        const data = {
            counter: this.counter++,
            ...rawData
        }
        const verify_data = btoa(JSON.stringify(data));        
        const hmac = sha256.sha256.hmac(nonce, verify_data);
        
        console.log("POST", {
            hmac,
            verify_data,
            data
        });
        
        // return;
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                hmac,
                data: verify_data
            })
        })
        .then(e => e.json())
        .then(res => {
            console.log("then", res);
            console.log(res);
            callBack(res.error, res.data);
        })
        .catch(e => {
            console.log("catch", e);
            callBack(true);
        })

    },
    
    emit (id: string, a: any = null, b: any = null, c: any = null, d: any = null) {
        console.log("TODO::", "POST", a?.toString(), b?.toString(), c?.toString(), d?.toString());
    },

    on (id: string, call: Function) {
        console.log("TODO::", "LISTENER", id, call.toString());
    }

}

export default socket;