
import ajax from '../ajax';

export default {
    exit: function (s: (arg0: any) => void, e: (arg0: any) => void) {
        ajax({
            url : '/app/exit',
            type : 'POST',
            data : {
            },
            done : function(data: any){
                s(data);
            },
            problem : function (error: any) {
                e(error);
            }
        
        });
    }
};