//
Date.prototype.format=function(formatString) {
    var o = {
        "m+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours()%12 === 0 ? 12 : (this.getHours()%12<10?"0"+this.getHours()%12:this.getHours()%12), //hours
        "H+" : (this.getHours()<10?"0"+this.getHours():this.getHours()), //hours
        "g+" : this.getHours()%12 === 0 ? 12 : (this.getHours()%12<10?this.getHours()%12:this.getHours()%12), //hours
        "G+" : this.getHours(), //hours
        "i+" : (this.getMinutes()<10?"0"+this.getMinutes():this.getMinutes()), //minute
        "s+" : (this.getSeconds()<10?"0"+this.getSeconds():this.getSeconds()), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //
        "S" : this.getMilliseconds(), //millis second
        "a" : this.getHours()<12?"am":"pm",
        "A" : this.getHours()<12?"AM":"PM",
        "Y" : this.getFullYear()
    };
    var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for(var k in o){
        if(new RegExp("("+ k +")").test(formatString)){
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    if(/(y+)/.test(formatString)){
        formatString=formatString.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(w+)/.test(formatString)){
        formatString=formatString.replace(RegExp.$1, weeks[this.getDay()]);
    }

    if(/(E+)/.test(formatString)){
        //console.log(this.getMonth())
        formatString=formatString.replace(RegExp.$1, months[this.getMonth()]);
    }
    return formatString;
};

function TimeHelper(timezone_offset,format24) {
    var self = this,timer,now = new Date();

    format24=(format24==true);
    timezone_offset=timezone_offset?timezone_offset:0;

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var now = new Date(utc + (3600000*timezone_offset));

    this.getDate=function(){
        var d = new Date();
        return new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + (3600000*timezone_offset));
    }

    this.generateTimeString = function() {
        if(format24){
            return now.format('H:i:s, w d, E Y');
        }
        return now.format('h:i:s A, w d, E Y');
    }

    this.clockStart = function (callback) {
        var startTimeStamp=self.getDate().getTime();
        clearInterval(timer);
        var timeIntervaler=0;
        timer = setInterval(function () {
            timeIntervaler+=1000;
            now.setTime(timeIntervaler + startTimeStamp);
            //console.log(timeIntervaler + startTimeStamp);
            if(typeof callback=='function'){
                callback.call(self,now);
            }
        }, 1000);
    };

    this.get_week_date=function (n) {//n=0,this week; n>0,next n week; n<0,last n week;
        if (!n) {
            n = 0;
        }
        var timestamp = self.getDate().getTime() + n * 7 * 24 * 60 * 60 * 1000;
        var d = new Date(timestamp);
        return d.format('Y-m-d');
    }
}

