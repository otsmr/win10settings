import ajax from './ajax';

export default {

    start : function (s: () => void, e: () => void) {
        setInterval(function () {
            ajax({
                url : '/ping',
                type : 'GET',
                success : function(data: any){
                    if(s) s();
                },
                errorCallback : function () {
                    if(e) e();
                }
            
            });
        }, 5000);
    }
};