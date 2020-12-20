
import ajax from '../ajax';

export default {
    putData: function (data: { bucket: any; content: any; }, s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/storage/putData',
            type : 'POST',
            data : {
              bucket : data.bucket,
              content : data.content
            },
            done : function(data: any){
                s(data);
            },
            problem : function (error: any) {
                e(error);
            }
        
        });
    
    },
    getData: function (bucket: any, s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/storage/getData',
            type : 'POST',
            data : {
              bucket : bucket
            },
            done : function(data: { content: string; }){
                s(JSON.parse(data.content));
            },
            problem : function(error: any) {
                e(error);
            }
        
        });
    
    }
}