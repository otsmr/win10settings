import ajax from '../ajax';


export default {

    dialogOpen: function(t: any, s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/os/dialogOpen',
            type : 'POST',
            data : {
            title : t
            },
            done : function(data: any){
                s(data);
            },
            problem : function(error: any) {
                e(error);
            }
        
        })
    },
    dialogSave: function(t: any, s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/os/dialogSave',
            type : 'POST',
            data : {
              title : t
            },
            done : function(data: any){
                s(data);
            },
            problem : function(error: any) {
                e(error);
            }
        });
    },
    showNotification: function(options: { [x: string]: any; }, s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/os/showNotification',
            type : 'POST',
            data : {
              summary: options["summary"],
              body: options["body"]
            },
            done : function(data: any){
                s(data);
            },
            problem : function(error: any) {
                e(error);
            }   
        });
    }
}