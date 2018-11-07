/**
 * Created by zzpzero on 2016/4/15.
 */

(function ($) {

    $.pagination = function(option){
        return new $.pagination.fn.init(option);
    }

    $.pagination.fn = $.pagination.prototype = {
        init: function (option) {
            var defaults = {
                total: 0,
                currentPage:1,
                maxPage:11,
                pageSize:20,
                baseUrl:"javascript:void(0);",
                data:{},
                pageParam:"p",
                prevHtml:'<span>&laquo;</span>',
                nextHtml:'<span>&raquo;</span>',
                paginationStyle:'pagination-sm'
            };
            var self = this,sk= 0,rise= 5;
            self.option = $.extend({}, defaults, option);

            self.option.total = parseInt(self.option.total);
            self.option.currentPage = parseInt(self.option.currentPage);
            self.option.maxPage = parseInt(self.option.maxPage);
            self.option.pageSize = parseInt(self.option.pageSize);

            self.$obj = $('<ul></ul>').addClass("pagination "+self.option.paginationStyle);

            if (self.option.total>0) {
                self.option.pageSize = self.option.pageSize < 1 ? 1 : (self.option.total < 1 ? 1 : self.option.pageSize);
                self.option.currentPage =self.option.currentPage>(self.option.total / self.option.pageSize)+1||self.option.currentPage<1?1:self.option.currentPage;
                //
                var totalPageSize = (self.option.total / self.option.pageSize);
                self.option.maxPage = self.option.maxPage > totalPageSize ? totalPageSize : self.option.maxPage;
                if ((self.option.currentPage - rise) < (sk + 1)) {
                    var i = sk - (self.option.currentPage - rise);
                    sk = sk - i - 1;
                }
                sk = sk < 0 ? 0 : sk;
                if (((self.option.currentPage + rise) > (self.option.maxPage + sk) && (self.option.maxPage + sk) < totalPageSize && self.option.maxPage > rise) || !(self.option.maxPage + sk) > self.option.maxPage) {
                    i = (self.option.currentPage + rise) - (self.option.maxPage + sk);
                    sk = sk + i;
                }
                if ((self.option.maxPage + sk) > totalPageSize && self.option.maxPage) {
                    self.option.maxPage = totalPageSize - sk;
                }


                var and = ( String(self.option.baseUrl).indexOf("?")<0) ? "?" : "";
                var param_str = "";
                if (typeof self.option.data == 'object') {
                    $.each(self.option.data,function(key,val){
                        param_str += "&" +key+ "=" . val;
                    });
                } else {
                    param_str = $.trim(self.option.data) == "" ? "" :(/^&/.test(self.option.data) ? self.option.data : "&"+self.option.data);
                }

                var prev_p = self.option.currentPage - 1;
                var $prev_page = $('<li></li>');
                var $prev_a = $('<a></a>').html(self.option.prevHtml)
                $prev_page.append($prev_a);
                self.$obj.append($prev_page);

                if (prev_p >0) {
                    $prev_a.attr({href:self.option.baseUrl+and+param_str+"&"+self.option.pageParam+"="+prev_p});
                }else{
                    $prev_page.addClass('disabled');
                }

                for (i = 0 + sk; i < self.option.maxPage + sk; i++) {

                    var $li = $('<li></li>');
                    var $a = $('<a></a>').html((i + 1))
                    if(((i + 1) == self.option.currentPage)){
                        $li.addClass("active");
                    }else{
                        $a.attr({href:self.option.baseUrl+and+param_str+"&"+self.option.pageParam+"="+(i + 1)});
                    }
                    $li.append($a);
                    self.$obj.append($li);
                }
                var next_p = (self.option.currentPage > (self.option.maxPage + sk)) ? (self.option.maxPage + sk) : (self.option.currentPage + 1);
                var $next_page = $('<li></li>');
                var $next_a = $('<a></a>').html(self.option.nextHtml)
                $next_page.append($next_a);
                self.$obj.append($next_page);
                if (!(self.option.currentPage > (self.option.maxPage + sk) || self.option.currentPage == (self.option.maxPage + sk) || self.option.maxPage < 1 || self.option.maxPage == 1)) {
                    $next_a.attr({href:self.option.baseUrl+and+param_str+"&"+self.option.pageParam+"="+next_p});
                }else{
                    $next_page.addClass('disabled');
                }
            }
        },
        toHtml: function () {
            return this.$obj.prop('outerHTML');
        },
        toJqueryObj: function () {
            return this.$obj;
        }
    }

    // Give the init function the iModel prototype for later instantiation
    $.pagination.fn.init.prototype = $.pagination.fn;
})(jQuery);