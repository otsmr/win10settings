export default {

    emit (id: string, a: any = null, b: any = null, c: any = null, d: any = null) {

        const rand = parseInt(String(Math.random()).split(".")[1]);

        let func:any = ()=>{};
        if (typeof a === "function") func = a;
        if (typeof b === "function") func = b;
        if (typeof c === "function") func = c;
        if (typeof d === "function") func = d;

        (window as any).ipcRenderer.send(id, rand, a, b, c, d);
        (window as any).ipcRenderer.on(id + rand, (event: any, a: any, b: any, c: any, d: any) => {
            func(a, b, c, d);
        });

    },

    on (id: string, call: Function) {

        (window as any).ipcRenderer.on(id, (event: any, rand: any, a: any, b: any, c: any, d: any) => {
            if (a === null) call((a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (b === null) call(a, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (c === null) call(a, b, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (d === null) call(a, b, c, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });                
        })

    }

}