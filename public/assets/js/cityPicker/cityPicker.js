/**
 * Created by zzpzero on 2016/11/4.
 */
(function ($) {

    $.fn.extend({
        cityPicker: function (option,obj) {

            $.fn.cityPicker.fn.$elem = $(this).addClass('cityPicker');
            if($.fn.cityPicker.fn._isString(option)){
                if(typeof $.fn.cityPicker.fn[option] == 'function'&& !/^_+.*$/.test(option)){
                    $.fn.cityPicker.fn[option](obj);
                }
                return $(this);
            }

            var defaults = {
                /**
                 * Require data's construct like below:
                 * Construct:Area->Province->City
                 * Object:
                 * {
                 * id:1,
                 * name:"name",
                 * children:[]
                 * }
                 */
                data:[],
                onAreaClick:null, //
                onProvinceClick:null,
                onCityClick:null
            };
            option = $.extend(defaults,option);
            return  $.fn.cityPicker.fn.init(this,option,obj);
        }
    });
    $.fn.cityPicker.fn = $.fn.cityPicker.prototype = {
        _disabled_data:[],
        _isString: function (input) {
            return Object.prototype.toString.call(input) == '[object String]';
        },
        _isNumber: function (input) {
            return Object.prototype.toString.call(input) == '[object Number]';
        },
        _isArray: function (input) {
            return Object.prototype.toString.call(input) == '[object Array]';
        },
        _isObject: function (input) {
            return Object.prototype.toString.call(input) == '[object Object]';
        },
        init: function (elem,option,obj) {

            var self = this;
            self.setData(option.data);

            self.render();

            return self.$elem;
        },

        render: function () {

            var self = this;
            self.$elem.html('');

            for(var i in self._data){
                var obj = self.convert_obj(self._data[i]);
                var $li = $('<li></li>');
                var $dcity = $('<div></div>').addClass('dcity clearfix');
                $li.append($dcity);

                var $gdiv = $('<div></div>').addClass('ecity gcity');
                var $province_div = self.generate_provinces_$html(obj.children);
                $dcity.append($gdiv).append($province_div);

                var gid = "J_Group_"+(obj.id);
                var $span = $('<span></span>').addClass('group-label');
                var $input = $('<input/>').attr({type:'checkbox',id:gid}).addClass('J_Group').change(function () {
                    var $ecity = $(this).closest('.ecity');
                    if ($(this).is(":checked")) {
                        $ecity.next('.province-list').find("input[type='checkbox'].J_Province:not(:checked)").click();
                    } else {
                        $ecity.next('.province-list').find("input[type='checkbox'].J_Province:checked").click();
                    }
                });
                var $label = $('<label></label>').css({"font-weight":800}).attr({for:gid}).html(obj.name);

                $span.append($input).append($label);
                $gdiv.append($span);

                if($province_div.find("input[type='checkbox'][disabled].J_Province").length==obj.children.length){
                    $input.attr({disabled:true});
                }else{
                    $input.attr({disabled:false});
                }

                self.$elem.append($li);
            }
        },
        setData: function (data) {

            if(this._isArray(data)){
                this._data = data;
            }
        },
        setDisabledData: function (data) {
            if(this._isArray(data)){
                this._disabled_data = data;
            }
        },
        disable: function (city_id) {
            if(this._isString(city_id)||this._isNumber(city_id)){
                this._disabled_data.push(city_id+"");
            }
        },
        removeDisabledItemByCid: function (city_id) {
            if(this._isString(city_id)||this._isNumber(city_id)){
                for(var i in this._disabled_data){
                    if(city_id == this._disabled_data[i]){
                        delete this._disabled_data[i];
                        break;
                    }
                }
            }
        },
        convert_obj: function (o) {
            var obj = {
                id:0,
                name:"",
                children:[]
            };
            return $.extend({},obj,o);
        },
        generate_cities_$html:function(cities) {
            var self = this;
            var $html = $('<div></div>').addClass('citys');

            for(var i in cities){

                var obj = self.convert_obj(cities[i]);
                var $area = $('<span></span>').addClass('areas');
                var $name = $('<label></label>').html(obj.name);
                var $checkbox = $('<input/>').attr({type:"checkbox"}).addClass('J_City').change(function () {
                    var $ecity = $(this).closest('.ecity');
                    var $checked = $ecity.find(".citys input[type='checkbox'].J_City:checked");
                    var $disabled = $ecity.find(".citys input[type='checkbox'][disabled].J_City");
                    var $citys = $ecity.find(".citys").children(".areas");

                    $ecity.find(".check_num").html($checked.length > 0 ? "(" + $checked.length + ")" : "");

                    /**
                     * 只有当本身被选 中才有可能是全选
                     */
                    var $dcity = $ecity.closest('.dcity');
                    if($(this).is(":checked")){
                        if (!$ecity.find(".J_Province").is(":checked")&&($checked.length+$disabled.length) == $citys.length) {
                            $ecity.find(".J_Province").click();
                        }
                    }else if($ecity.find(".J_Province").is(":checked")){
                        $ecity.find(".J_Province").removeAttr('checked');
                        $dcity.find('.J_Group').removeAttr('checked');
                    }
                });
                if($.inArray(obj.id,self._disabled_data)==-1){
                    $name.attr({for:"J_City_"+obj.id});
                    $checkbox.attr({value:obj.id,id:"J_City_"+obj.id});
                }else{
                    $checkbox.attr({disabled:true});
                }

                $area.append($checkbox).append($name);
                $html.append($area);
            }
            var $btns_box = $('<p></p>').css({"text-align":"right",margin:0,padding:4});
            var $btn_close = $('<button></button>').attr({type:"button"}).addClass('close_button').html("关闭").click(function () {
                $(this).closest('.ecity').removeClass('showCityPop');
            });
            $btns_box.append($btn_close);
            $html.append($btns_box);
            return $html;
        },
        generate_provinces_$html: function (provinces) {
            var self = this;
            var $province_div = $('<div></div>').addClass('province-list');

            for(var i in provinces){
                var obj = self.convert_obj(provinces[i]);
                var $gareas = $('<span></span>').addClass('gareas');
                var $J_Province = $('<input/>').attr({type:"checkbox"}).addClass('J_Province').change(function () {
                    var $ecity = $(this).closest('.ecity');

                    if ($(this).is(":checked")) {
                        $ecity.find("input[type='checkbox']:not(:checked)").click();
                    } else {
                        $ecity.find("input[type='checkbox']:checked").click();
                    }

                    var $provinces = $ecity.closest('.province-list');
                    var $group_checkbox = $provinces.prev('.ecity').find("input[type='checkbox'].J_Group");
                    var $checked = $provinces.find(".ecity input[type='checkbox'].J_Province:checked");
                    var $disabled = $provinces.find(".ecity input[type='checkbox'][disabled].J_Province");

                    /**
                     * 只有当本身被选 中才有可能是全选
                     */
                    if($(this).is(":checked")){

                        if (!$group_checkbox.is(":checked")&&($checked.length+$disabled.length) == $provinces.children().length) {
                            $group_checkbox.click();
                        }
                    }else if($group_checkbox.is(":checked")){
                        $group_checkbox.removeAttr('checked');
                    }
                });
                var $J_Province_name = $('<label></label>').html(obj.name);
                var $J_province_check_num =$('<span></span>').addClass('check_num');
                var $trigger_img = $('<img src="//gtd.alicdn.com/tps/i1/T1XZCWXd8iXXXXXXXX-8-8.gif">').addClass('trigger').click(function () {
                    //
                    $(this).closest('.ecity').toggleClass('showCityPop').siblings().removeClass("showCityPop");
                    $(this).closest('.ecity').closest('li').siblings().find(".showCityPop").removeClass("showCityPop");
                });
                $gareas.append($J_Province).append($J_Province_name).append($J_province_check_num).append($trigger_img);

                var $cities = self.generate_cities_$html(obj.children);
                if($cities.find("input[type='checkbox'][disabled].J_City").length==obj.children.length){
                    $J_Province.attr({disabled:true});
                }else{
                    $J_Province.attr({disabled:false,id:"J_Province_"+obj.id,value:obj.id});
                    $J_Province_name.attr({for:"J_Province_"+obj.id})
                }
                var $ecity = $('<div></div>').addClass('ecity');
                $ecity.append($gareas).append($cities);
                $province_div.append($ecity);
            }
            return $province_div;
        }
    };

    $.fn.cityPicker.render = function () {

    }
})(jQuery);