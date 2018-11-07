/**
 * Created by zzpzero on 2016/1/5.
 */

/**
 * Created by zzpzero on 2016/2/1.
 */
var Url = function () {
    return this;
}
Url.prototype = {
    get: function (url,name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = url.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    },
    get_locate_var: function (name) {
        return this.get(window.location.search,name);
    }
};

function sort_callback(field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field];
    };
    return function (a, b) {
        var A = key(a), B = key(b);
        return (A < B ? -1 : 1) * [1, -1][+!!reverse];
    };
}

$(function () {
    $(document).on("click","input[type='checkbox'][role='checkall']",function () {
        var item = $(this).data('item');
        var $checked = $('body').find("input[type='checkbox'][item='"+item+"']:checked");
        var $unchecked = $('body').find("input[type='checkbox'][item='"+item+"']:not(:checked)");
        if ($(this).is(":checked")) {
            $unchecked.click();
        } else {
            $checked.click();
        }
    });
});
