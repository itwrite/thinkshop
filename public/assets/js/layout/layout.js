/**
 * jQuery EasyUI 1.2.3
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ]
 *
 */
(function ($) {
    $.fn.resizable = function (_1, _2) {
        if (typeof _1 == "string") {
            return $.fn.resizable.methods[_1](this, _2);
        }
        function _3(e) {
            var _4 = e.data;
            var _5 = $.data(_4.target, "resizable").options;
            if (_4.dir.indexOf("e") != -1) {
                var _6 = _4.startWidth + e.pageX - _4.startX;
                _6 = Math.min(Math.max(_6, _5.minWidth), _5.maxWidth);
                _4.width = _6;
            }
            if (_4.dir.indexOf("s") != -1) {
                var _7 = _4.startHeight + e.pageY - _4.startY;
                _7 = Math.min(Math.max(_7, _5.minHeight), _5.maxHeight);
                _4.height = _7;
            }
            if (_4.dir.indexOf("w") != -1) {
                _4.width = _4.startWidth - e.pageX + _4.startX;
                if (_4.width >= _5.minWidth && _4.width <= _5.maxWidth) {
                    _4.left = _4.startLeft + e.pageX - _4.startX;
                }
            }
            if (_4.dir.indexOf("n") != -1) {
                _4.height = _4.startHeight - e.pageY + _4.startY;
                if (_4.height >= _5.minHeight && _4.height <= _5.maxHeight) {
                    _4.top = _4.startTop + e.pageY - _4.startY;
                }
            }
        }
        ;
        function _8(e) {
            var _9 = e.data;
            var _a = _9.target;
            if ($.boxModel == true) {
                $(_a).css({
                    width: _9.width - _9.deltaWidth,
                    height: _9.height - _9.deltaHeight,
                    left: _9.left,
                    top: _9.top
                });
            } else {
                $(_a).css({width: _9.width, height: _9.height, left: _9.left, top: _9.top});
            }
        }
        ;
        function _b(e) {
            $.data(e.data.target, "resizable").options.onStartResize.call(e.data.target, e);
            return false;
        }
        ;
        function _c(e) {
            _3(e);
            if ($.data(e.data.target, "resizable").options.onResize.call(e.data.target, e) != false) {
                _8(e);
            }
            return false;
        }
        ;
        function _d(e) {
            _3(e, true);
            _8(e);
            $(document).unbind(".resizable");
            $.data(e.data.target, "resizable").options.onStopResize.call(e.data.target, e);
            return false;
        }
        ;
        return this.each(function () {
            var _e = null;
            var _f = $.data(this, "resizable");
            if (_f) {
                $(this).unbind(".resizable");
                _e = $.extend(_f.options, _1 || {});
            } else {
                _e = $.extend({}, $.fn.resizable.defaults, _1 || {});
                $.data(this, "resizable", {options: _e});
            }
            if (_e.disabled == true) {
                return;
            }
            var _10 = this;
            $(this).bind("mousemove.resizable", _11).bind("mousedown.resizable", _12);
            function _11(e) {
                var dir = _13(e);
                if (dir == "") {
                    $(_10).css("cursor", "default");
                } else {
                    $(_10).css("cursor", dir + "-resize");
                }
            }
            ;
            function _12(e) {
                var dir = _13(e);
                if (dir == "") {
                    return;
                }
                var _14 = {
                    target: this,
                    dir: dir,
                    startLeft: _15("left"),
                    startTop: _15("top"),
                    left: _15("left"),
                    top: _15("top"),
                    startX: e.pageX,
                    startY: e.pageY,
                    startWidth: $(_10).outerWidth(),
                    startHeight: $(_10).outerHeight(),
                    width: $(_10).outerWidth(),
                    height: $(_10).outerHeight(),
                    deltaWidth: $(_10).outerWidth() - $(_10).width(),
                    deltaHeight: $(_10).outerHeight() - $(_10).height()
                };
                $(document).bind("mousedown.resizable", _14, _b);
                $(document).bind("mousemove.resizable", _14, _c);
                $(document).bind("mouseup.resizable", _14, _d);
            }
            ;
            function _13(e) {
                var dir = "";
                var _16 = $(_10).offset();
                var _17 = $(_10).outerWidth();
                var _18 = $(_10).outerHeight();
                var _19 = _e.edge;
                if (e.pageY > _16.top && e.pageY < _16.top + _19) {
                    dir += "n";
                } else {
                    if (e.pageY < _16.top + _18 && e.pageY > _16.top + _18 - _19) {
                        dir += "s";
                    }
                }
                if (e.pageX > _16.left && e.pageX < _16.left + _19) {
                    dir += "w";
                } else {
                    if (e.pageX < _16.left + _17 && e.pageX > _16.left + _17 - _19) {
                        dir += "e";
                    }
                }
                var _1a = _e.handles.split(",");
                for (var i = 0; i < _1a.length; i++) {
                    var _1b = _1a[i].replace(/(^\s*)|(\s*$)/g, "");
                    if (_1b == "all" || _1b == dir) {
                        return dir;
                    }
                }
                return "";
            }
            ;
            function _15(css) {
                var val = parseInt($(_10).css(css));
                if (isNaN(val)) {
                    return 0;
                } else {
                    return val;
                }
            }
            ;
        });
    };
    $.fn.resizable.methods = {};
    $.fn.resizable.defaults = {
        disabled: false,
        handles: "n, e, s, w, ne, se, sw, nw, all",
        minWidth: 10,
        minHeight: 10,
        maxWidth: 10000,
        maxHeight: 10000,
        edge: 5,
        onStartResize: function (e) {
        },
        onResize: function (e) {
        },
        onStopResize: function (e) {
        }
    };
})(jQuery);

/**
 * jQuery EasyUI 1.2.3
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ]
 *
 */
(function ($) {
    function _1(_2) {
        _2.each(function () {
            $(this).remove();
            if ($.browser.msie) {
                this.outerHTML = "";
            }
        });
    }
    ;
    function _3(_4, _5) {
        var _6 = $.data(_4, "panel").options;
        var _7 = $.data(_4, "panel").panel;
        var _8 = _7.children("div.panel-header");
        var _9 = _7.children("div.panel-body");
        if (_5) {
            if (_5.width) {
                _6.width = _5.width;
            }
            if (_5.height) {
                _6.height = _5.height;
            }
            if (_5.left != null) {
                _6.left = _5.left;
            }
            if (_5.top != null) {
                _6.top = _5.top;
            }
        }
        if (_6.fit == true) {
            var p = _7.parent();
            _6.width = p.width();
            _6.height = p.height();
        }
        _7.css({left: _6.left, top: _6.top});
        if (!isNaN(_6.width)) {
            if ($.boxModel == true) {
                _7.width(_6.width - (_7.outerWidth() - _7.width()));
            } else {
                _7.width(_6.width);
            }
        } else {
            _7.width("auto");
        }
        if ($.boxModel == true) {
            _8.width(_7.width() - (_8.outerWidth() - _8.width()));
            _9.width(_7.width() - (_9.outerWidth() - _9.width()));
        } else {
            _8.width(_7.width());
            _9.width(_7.width());
        }
        if (!isNaN(_6.height)) {
            if ($.boxModel == true) {
                _7.height(_6.height - (_7.outerHeight() - _7.height()));
                _9.height(_7.height() - _8.outerHeight() - (_9.outerHeight() - _9.height()));
            } else {
                _7.height(_6.height);
                _9.height(_7.height() - _8.outerHeight());
            }
        } else {
            _9.height("auto");
        }
        //extra code
        _9.find(">div>iframe").height(_9.height()-4);

        _7.css("height", "");
        _6.onResize.apply(_4, [_6.width, _6.height]);
        _7.find(">div.panel-body>div").triggerHandler("_resize");
    }
    ;
    function _a(_b, _c) {
        var _d = $.data(_b, "panel").options;
        var _e = $.data(_b, "panel").panel;
        if (_c) {
            if (_c.left != null) {
                _d.left = _c.left;
            }
            if (_c.top != null) {
                _d.top = _c.top;
            }
        }
        _e.css({left: _d.left, top: _d.top});
        _d.onMove.apply(_b, [_d.left, _d.top]);
    }
    ;
    function _f(_10) {
        var _11 = $(_10).addClass("panel-body").wrap("<div class=\"panel\"></div>").parent();
        _11.bind("_resize", function () {
            var _12 = $.data(_10, "panel").options;
            if (_12.fit == true) {
                _3(_10);
            }
            return false;
        });
        return _11;
    }
    ;
    function _13(_14) {
        var _15 = $.data(_14, "panel").options;
        var _16 = $.data(_14, "panel").panel;
        _1(_16.find(">div.panel-header"));
        if (_15.title && !_15.noheader) {
            var _17 = $("<div class=\"panel-header\"><div class=\"panel-title\">" + _15.title + "</div></div>").prependTo(_16);
            if (_15.iconCls) {
                _17.find(".panel-title").addClass("panel-with-icon");
                $("<div class=\"panel-icon\"></div>").addClass(_15.iconCls).appendTo(_17);
            }
            var _18 = $("<div class=\"panel-tool\"></div>").appendTo(_17);
            if (_15.closable) {
                $("<div class=\"panel-tool-close\"></div>").appendTo(_18).bind("click", _19);
            }
            if (_15.maximizable) {
                $("<div class=\"panel-tool-max\"></div>").appendTo(_18).bind("click", _1a);
            }
            if (_15.minimizable) {
                $("<div class=\"panel-tool-min\"></div>").appendTo(_18).bind("click", _1b);
            }
            if (_15.collapsible) {
                $("<div class=\"panel-tool-collapse\"></div>").appendTo(_18).bind("click", _1c);
            }
            if (_15.tools) {
                for (var i = _15.tools.length - 1; i >= 0; i--) {
                    var t = $("<div></div>").addClass(_15.tools[i].iconCls).appendTo(_18);
                    if (_15.tools[i].handler) {
                        t.bind("click", eval(_15.tools[i].handler));
                    }
                }
            }
            _18.find("div").hover(function () {
                $(this).addClass("panel-tool-over");
            }, function () {
                $(this).removeClass("panel-tool-over");
            });
            _16.find(">div.panel-body").removeClass("panel-body-noheader");
        } else {
            _16.find(">div.panel-body").addClass("panel-body-noheader");
        }
        function _1c() {
            if (_15.collapsed == true) {
                _3b(_14, true);
            } else {
                _2b(_14, true);
            }
            return false;
        }
        ;
        function _1b() {
            _46(_14);
            return false;
        }
        ;
        function _1a() {
            if (_15.maximized == true) {
                _4a(_14);
            } else {
                _2a(_14);
            }
            return false;
        }
        ;
        function _19() {
            _1d(_14);
            return false;
        }
        ;
    }
    ;
    function _1e(_1f) {
        var _20 = $.data(_1f, "panel");
        if (_20.options.href && (!_20.isLoaded || !_20.options.cache)) {
            _20.isLoaded = false;
            var _21 = _20.panel.find(">div.panel-body");
            if (_20.options.loadingMessage) {
                _21.html($("<div class=\"panel-loading\"></div>").html(_20.options.loadingMessage));
            }
            $.ajax({
                url: _20.options.href, cache: false, success: function (_22) {
                    _21.html(_22);
                    if ($.parser) {
                        $.parser.parse(_21);
                    }
                    _20.options.onLoad.apply(_1f, arguments);
                    _20.isLoaded = true;
                }
            });
        }
    }
    ;
    function _23(_24) {
        $(_24).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function () {
            $(this).triggerHandler("_resize", [true]);
        });
    }
    ;
    function _25(_26, _27) {
        var _28 = $.data(_26, "panel").options;
        var _29 = $.data(_26, "panel").panel;
        if (_27 != true) {
            if (_28.onBeforeOpen.call(_26) == false) {
                return;
            }
        }
        _29.show();
        _28.closed = false;
        _28.minimized = false;
        _28.onOpen.call(_26);
        if (_28.maximized == true) {
            _28.maximized = false;
            _2a(_26);
        }
        if (_28.collapsed == true) {
            _28.collapsed = false;
            _2b(_26);
        }
        if (!_28.collapsed) {
            _1e(_26);
            _23(_26);
        }
    }
    ;
    function _1d(_2c, _2d) {
        var _2e = $.data(_2c, "panel").options;
        var _2f = $.data(_2c, "panel").panel;
        if (_2d != true) {
            if (_2e.onBeforeClose.call(_2c) == false) {
                return;
            }
        }
        _2f.hide();
        _2e.closed = true;
        _2e.onClose.call(_2c);
    }
    ;
    function _30(_31, _32) {
        var _33 = $.data(_31, "panel").options;
        var _34 = $.data(_31, "panel").panel;
        if (_32 != true) {
            if (_33.onBeforeDestroy.call(_31) == false) {
                return;
            }
        }
        _1(_34);
        _33.onDestroy.call(_31);
    }
    ;
    function _2b(_35, _36) {
        var _37 = $.data(_35, "panel").options;
        var _38 = $.data(_35, "panel").panel;
        var _39 = _38.children("div.panel-body");
        var _3a = _38.children("div.panel-header").find("div.panel-tool-collapse");
        if (_37.collapsed == true) {
            return;
        }
        _39.stop(true, true);
        if (_37.onBeforeCollapse.call(_35) == false) {
            return;
        }
        _3a.addClass("panel-tool-expand");
        if (_36 == true) {
            _39.slideUp("normal", function () {
                _37.collapsed = true;
                _37.onCollapse.call(_35);
            });
        } else {
            _39.hide();
            _37.collapsed = true;
            _37.onCollapse.call(_35);
        }
    }
    ;
    function _3b(_3c, _3d) {
        var _3e = $.data(_3c, "panel").options;
        var _3f = $.data(_3c, "panel").panel;
        var _40 = _3f.children("div.panel-body");
        var _41 = _3f.children("div.panel-header").find("div.panel-tool-collapse");
        if (_3e.collapsed == false) {
            return;
        }
        _40.stop(true, true);
        if (_3e.onBeforeExpand.call(_3c) == false) {
            return;
        }
        _41.removeClass("panel-tool-expand");
        if (_3d == true) {
            _40.slideDown("normal", function () {
                _3e.collapsed = false;
                _3e.onExpand.call(_3c);
                _1e(_3c);
                _23(_3c);
            });
        } else {
            _40.show();
            _3e.collapsed = false;
            _3e.onExpand.call(_3c);
            _1e(_3c);
            _23(_3c);
        }
    }
    ;
    function _2a(_42) {
        var _43 = $.data(_42, "panel").options;
        var _44 = $.data(_42, "panel").panel;
        var _45 = _44.children("div.panel-header").find("div.panel-tool-max");
        if (_43.maximized == true) {
            return;
        }
        _45.addClass("panel-tool-restore");
        $.data(_42, "panel").original = {
            width: _43.width,
            height: _43.height,
            left: _43.left,
            top: _43.top,
            fit: _43.fit
        };
        _43.left = 0;
        _43.top = 0;
        _43.fit = true;
        _3(_42);
        _43.minimized = false;
        _43.maximized = true;
        _43.onMaximize.call(_42);
    }
    ;
    function _46(_47) {
        var _48 = $.data(_47, "panel").options;
        var _49 = $.data(_47, "panel").panel;
        _49.hide();
        _48.minimized = true;
        _48.maximized = false;
        _48.onMinimize.call(_47);
    }
    ;
    function _4a(_4b) {
        var _4c = $.data(_4b, "panel").options;
        var _4d = $.data(_4b, "panel").panel;
        var _4e = _4d.children("div.panel-header").find("div.panel-tool-max");
        if (_4c.maximized == false) {
            return;
        }
        _4d.show();
        _4e.removeClass("panel-tool-restore");
        var _4f = $.data(_4b, "panel").original;
        _4c.width = _4f.width;
        _4c.height = _4f.height;
        _4c.left = _4f.left;
        _4c.top = _4f.top;
        _4c.fit = _4f.fit;
        _3(_4b);
        _4c.minimized = false;
        _4c.maximized = false;
        _4c.onRestore.call(_4b);
    }
    ;
    function _50(_51) {
        var _52 = $.data(_51, "panel").options;
        var _53 = $.data(_51, "panel").panel;
        if (_52.border == true) {
            _53.children("div.panel-header").removeClass("panel-header-noborder");
            _53.children("div.panel-body").removeClass("panel-body-noborder");
        } else {
            _53.children("div.panel-header").addClass("panel-header-noborder");
            _53.children("div.panel-body").addClass("panel-body-noborder");
        }
        _53.css(_52.style);
        _53.addClass(_52.cls);
        _53.children("div.panel-header").addClass(_52.headerCls);
        _53.children("div.panel-body").addClass(_52.bodyCls);
    }
    ;
    function _54(_55, _56) {
        $.data(_55, "panel").options.title = _56;
        $(_55).panel("header").find("div.panel-title").html(_56);
    }
    ;
    var TO = false;
    var _57 = true;
    $(window).unbind(".panel").bind("resize.panel", function () {
        if (!_57) {
            return;
        }
        if (TO !== false) {
            clearTimeout(TO);
        }
        TO = setTimeout(function () {
            _57 = false;
            var _58 = $("body.layout");
            if (_58.length) {
                _58.layout("resize");
            } else {
                $("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize");
            }
            _57 = true;
            TO = false;
        }, 200);
    });
    $.fn.panel = function (_59, _5a) {
        if (typeof _59 == "string") {
            return $.fn.panel.methods[_59](this, _5a);
        }
        _59 = _59 || {};
        return this.each(function () {
            var _5b = $.data(this, "panel");
            var _5c;
            if (_5b) {
                _5c = $.extend(_5b.options, _59);
            } else {
                _5c = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), _59);
                $(this).attr("title", "");
                _5b = $.data(this, "panel", {options: _5c, panel: _f(this), isLoaded: false});
            }
            if (_5c.content) {
                $(this).html(_5c.content);
                if ($.parser) {
                    $.parser.parse(this);
                }
            }
            _13(this);
            _50(this);
            if (_5c.doSize == true) {
                _5b.panel.css("display", "block");
                _3(this);
            }
            if (_5c.closed == true || _5c.minimized == true) {
                _5b.panel.hide();
            } else {
                _25(this);
            }
        });
    };
    $.fn.panel.methods = {
        options: function (jq) {
            return $.data(jq[0], "panel").options;
        }, panel: function (jq) {
            return $.data(jq[0], "panel").panel;
        }, header: function (jq) {
            return $.data(jq[0], "panel").panel.find(">div.panel-header");
        }, body: function (jq) {
            return $.data(jq[0], "panel").panel.find(">div.panel-body");
        }, setTitle: function (jq, _5d) {
            return jq.each(function () {
                _54(this, _5d);
            });
        }, open: function (jq, _5e) {
            return jq.each(function () {
                _25(this, _5e);
            });
        }, close: function (jq, _5f) {
            return jq.each(function () {
                _1d(this, _5f);
            });
        }, destroy: function (jq, _60) {
            return jq.each(function () {
                _30(this, _60);
            });
        }, refresh: function (jq, _61) {
            return jq.each(function () {
                $.data(this, "panel").isLoaded = false;
                if (_61) {
                    $.data(this, "panel").options.href = _61;
                }
                _1e(this);
            });
        }, resize: function (jq, _62) {
            return jq.each(function () {
                _3(this, _62);
            });
        }, move: function (jq, _63) {
            return jq.each(function () {
                _a(this, _63);
            });
        }, maximize: function (jq) {
            return jq.each(function () {
                _2a(this);
            });
        }, minimize: function (jq) {
            return jq.each(function () {
                _46(this);
            });
        }, restore: function (jq) {
            return jq.each(function () {
                _4a(this);
            });
        }, collapse: function (jq, _64) {
            return jq.each(function () {
                _2b(this, _64);
            });
        }, expand: function (jq, _65) {
            return jq.each(function () {
                _3b(this, _65);
            });
        }
    };
    $.fn.panel.parseOptions = function (_66) {
        var t = $(_66);
        return {
            width: (parseInt(_66.style.width) || undefined),
            height: (parseInt(_66.style.height) || undefined),
            left: (parseInt(_66.style.left) || undefined),
            top: (parseInt(_66.style.top) || undefined),
            title: (t.attr("title") || undefined),
            iconCls: (t.attr("iconCls") || t.attr("icon")),
            cls: t.attr("cls"),
            headerCls: t.attr("headerCls"),
            bodyCls: t.attr("bodyCls"),
            href: t.attr("href"),
            loadingMessage: (t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined),
            cache: (t.attr("cache") ? t.attr("cache") == "true" : undefined),
            fit: (t.attr("fit") ? t.attr("fit") == "true" : undefined),
            border: (t.attr("border") ? t.attr("border") == "true" : undefined),
            noheader: (t.attr("noheader") ? t.attr("noheader") == "true" : undefined),
            collapsible: (t.attr("collapsible") ? t.attr("collapsible") == "true" : undefined),
            minimizable: (t.attr("minimizable") ? t.attr("minimizable") == "true" : undefined),
            maximizable: (t.attr("maximizable") ? t.attr("maximizable") == "true" : undefined),
            closable: (t.attr("closable") ? t.attr("closable") == "true" : undefined),
            collapsed: (t.attr("collapsed") ? t.attr("collapsed") == "true" : undefined),
            minimized: (t.attr("minimized") ? t.attr("minimized") == "true" : undefined),
            maximized: (t.attr("maximized") ? t.attr("maximized") == "true" : undefined),
            closed: (t.attr("closed") ? t.attr("closed") == "true" : undefined)
        };
    };
    $.fn.panel.defaults = {
        title: null,
        iconCls: null,
        width: "auto",
        height: "auto",
        left: null,
        top: null,
        cls: null,
        headerCls: null,
        bodyCls: null,
        style: {},
        href: null,
        cache: true,
        fit: false,
        border: true,
        doSize: true,
        noheader: false,
        content: null,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        collapsed: false,
        minimized: false,
        maximized: false,
        closed: false,
        tools: [],
        href: null,
        loadingMessage: "Loading...",
        onLoad: function () {
        },
        onBeforeOpen: function () {
        },
        onOpen: function () {
        },
        onBeforeClose: function () {
        },
        onClose: function () {
        },
        onBeforeDestroy: function () {
        },
        onDestroy: function () {
        },
        onResize: function (_67, _68) {
        },
        onMove: function (_69, top) {
        },
        onMaximize: function () {
        },
        onRestore: function () {
        },
        onMinimize: function () {
        },
        onBeforeCollapse: function () {
        },
        onBeforeExpand: function () {
        },
        onCollapse: function () {
        },
        onExpand: function () {
        }
    };
})(jQuery);


/**
 * jQuery EasyUI 1.2.3
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2011 stworthy [ stworthy@gmail.com ]
 *
 */
(function ($) {
    var _1 = false;

    function _2(_3) {
        var _4 = $.data(_3, "layout").options;
        var _5 = $.data(_3, "layout").panels;
        var cc = $(_3);
        if (_4.fit == true) {
            var p = cc.parent();
            cc.width(p.width()).height(p.height());
        }
        var _6 = {top: 0, left: 0, width: cc.width(), height: cc.height()};

        function _7(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width: cc.width(), height: pp.panel("options").height, left: 0, top: 0});
            _6.top += pp.panel("options").height;
            _6.height -= pp.panel("options").height;
        }
        ;
        if (_b(_5.expandNorth)) {
            _7(_5.expandNorth);
        } else {
            _7(_5.north);
        }
        function _8(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {
                width: cc.width(),
                height: pp.panel("options").height,
                left: 0,
                top: cc.height() - pp.panel("options").height
            });
            _6.height -= pp.panel("options").height;
        }
        ;
        if (_b(_5.expandSouth)) {
            _8(_5.expandSouth);
        } else {
            _8(_5.south);
        }
        function _9(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {
                width: pp.panel("options").width,
                height: _6.height,
                left: cc.width() - pp.panel("options").width,
                top: _6.top
            });
            _6.width -= pp.panel("options").width;
        }
        ;
        if (_b(_5.expandEast)) {
            _9(_5.expandEast);
        } else {
            _9(_5.east);
        }
        function _a(pp) {
            if (pp.length == 0) {
                return;
            }
            pp.panel("resize", {width: pp.panel("options").width, height: _6.height, left: 0, top: _6.top});
            _6.left += pp.panel("options").width;
            _6.width -= pp.panel("options").width;
        }
        ;
        if (_b(_5.expandWest)) {
            _a(_5.expandWest);
        } else {
            _a(_5.west);
        }
        _5.center.panel("resize", _6);
    }
    ;
    function _c(_d) {
        var cc = $(_d);
        if (cc[0].tagName == "BODY") {
            $("html").css({height: "100%", overflow: "hidden"});
            $("body").css({height: "100%", overflow: "hidden", border: "none"});
        }
        cc.addClass("layout");
        cc.css({margin: 0, padding: 0});
        function _e(_f) {
            var pp = $(">div[region=" + _f + "]", _d).addClass("layout-body");
            var _10 = null;
            if (_f == "north") {
                _10 = "layout-button-up";
            } else {
                if (_f == "south") {
                    _10 = "layout-button-down";
                } else {
                    if (_f == "east") {
                        _10 = "layout-button-right";
                    } else {
                        if (_f == "west") {
                            _10 = "layout-button-left";
                        }
                    }
                }
            }
            var cls = "layout-panel layout-panel-" + _f;
            if (pp.attr("split") == "true") {
                cls += " layout-split-" + _f;
            }
            pp.panel({
                cls: cls,
                doSize: false,
                border: (pp.attr("border") == "false" ? false : true),
                width: (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
                height: (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
                tools: [{
                    iconCls: _10, handler: function () {
                        _1c(_d, _f);
                    }
                }]
            });
            if (pp.attr("split") == "true") {
                var _11 = pp.panel("panel");
                var _12 = "";
                if (_f == "north") {
                    _12 = "s";
                }
                if (_f == "south") {
                    _12 = "n";
                }
                if (_f == "east") {
                    _12 = "w";
                }
                if (_f == "west") {
                    _12 = "e";
                }
                _11.resizable({
                    handles: _12, onStartResize: function (e) {
                        _1 = true;
                        if (_f == "north" || _f == "south") {
                            var _13 = $(">div.layout-split-proxy-v", _d);
                        } else {
                            var _13 = $(">div.layout-split-proxy-h", _d);
                        }
                        var top = 0, _14 = 0, _15 = 0, _16 = 0;
                        var pos = {display: "block"};
                        if (_f == "north") {
                            pos.top = parseInt(_11.css("top")) + _11.outerHeight() - _13.height();
                            pos.left = parseInt(_11.css("left"));
                            pos.width = _11.outerWidth();
                            pos.height = _13.height();
                        } else {
                            if (_f == "south") {
                                pos.top = parseInt(_11.css("top"));
                                pos.left = parseInt(_11.css("left"));
                                pos.width = _11.outerWidth();
                                pos.height = _13.height();
                            } else {
                                if (_f == "east") {
                                    pos.top = parseInt(_11.css("top")) || 0;
                                    pos.left = parseInt(_11.css("left")) || 0;
                                    pos.width = _13.width();
                                    pos.height = _11.outerHeight();
                                } else {
                                    if (_f == "west") {
                                        pos.top = parseInt(_11.css("top")) || 0;
                                        pos.left = _11.outerWidth() - _13.width();
                                        pos.width = _13.width();
                                        pos.height = _11.outerHeight();
                                    }
                                }
                            }
                        }
                        _13.css(pos);
                        $("<div class=\"layout-mask\"></div>").css({
                            left: 0,
                            top: 0,
                            width: cc.width(),
                            height: cc.height()
                        }).appendTo(cc);
                    }, onResize: function (e) {
                        if (_f == "north" || _f == "south") {
                            var _17 = $(">div.layout-split-proxy-v", _d);
                            _17.css("top", e.pageY - $(_d).offset().top - _17.height() / 2);
                        } else {
                            var _17 = $(">div.layout-split-proxy-h", _d);
                            _17.css("left", e.pageX - $(_d).offset().left - _17.width() / 2);
                        }
                        return false;
                    }, onStopResize: function () {
                        $(">div.layout-split-proxy-v", _d).css("display", "none");
                        $(">div.layout-split-proxy-h", _d).css("display", "none");
                        var _18 = pp.panel("options");
                        _18.width = _11.outerWidth();
                        _18.height = _11.outerHeight();
                        _18.left = _11.css("left");
                        _18.top = _11.css("top");
                        pp.panel("resize");
                        _2(_d);
                        _1 = false;
                        cc.find(">div.layout-mask").remove();
                    }
                });
            }
            return pp;
        }
        ;
        $("<div class=\"layout-split-proxy-h\"></div>").appendTo(cc);
        $("<div class=\"layout-split-proxy-v\"></div>").appendTo(cc);
        var _19 = {center: _e("center")};
        _19.north = _e("north");
        _19.south = _e("south");
        _19.east = _e("east");
        _19.west = _e("west");
        $(_d).bind("_resize", function (e, _1a) {
            var _1b = $.data(_d, "layout").options;
            if (_1b.fit == true || _1a) {
                _2(_d);
            }
            return false;
        });
        return _19;
    }
    ;
    function _1c(_1d, _1e) {
        var _1f = $.data(_1d, "layout").panels;
        var cc = $(_1d);

        function _20(dir) {
            var _21;
            if (dir == "east") {
                _21 = "layout-button-left";
            } else {
                if (dir == "west") {
                    _21 = "layout-button-right";
                } else {
                    if (dir == "north") {
                        _21 = "layout-button-down";
                    } else {
                        if (dir == "south") {
                            _21 = "layout-button-up";
                        }
                    }
                }
            }
            var p = $("<div></div>").appendTo(cc).panel({
                cls: "layout-expand", title: "&nbsp;", closed: true, doSize: false, tools: [{
                    iconCls: _21, handler: function () {
                        _22(_1d, _1e);
                    }
                }]
            });
            p.panel("panel").hover(function () {
                $(this).addClass("layout-expand-over");
            }, function () {
                $(this).removeClass("layout-expand-over");
            });
            return p;
        }
        ;
        if (_1e == "east") {
            if (_1f.east.panel("options").onBeforeCollapse.call(_1f.east) == false) {
                return;
            }
            _1f.center.panel("resize", {width: _1f.center.panel("options").width + _1f.east.panel("options").width - 28});
            _1f.east.panel("panel").animate({left: cc.width()}, function () {
                _1f.east.panel("close");
                _1f.expandEast.panel("open").panel("resize", {
                    top: _1f.east.panel("options").top,
                    left: cc.width() - 28,
                    width: 28,
                    height: _1f.east.panel("options").height
                });
                _1f.east.panel("options").onCollapse.call(_1f.east);
            });
            if (!_1f.expandEast) {
                _1f.expandEast = _20("east");
                _1f.expandEast.panel("panel").click(function () {
                    _1f.east.panel("open").panel("resize", {left: cc.width()});
                    _1f.east.panel("panel").animate({left: cc.width() - _1f.east.panel("options").width});
                    return false;
                });
            }
        } else {
            if (_1e == "west") {
                if (_1f.west.panel("options").onBeforeCollapse.call(_1f.west) == false) {
                    return;
                }
                _1f.center.panel("resize", {
                    width: _1f.center.panel("options").width + _1f.west.panel("options").width - 28,
                    left: 28
                });
                _1f.west.panel("panel").animate({left: -_1f.west.panel("options").width}, function () {
                    _1f.west.panel("close");
                    _1f.expandWest.panel("open").panel("resize", {
                        top: _1f.west.panel("options").top,
                        left: 0,
                        width: 28,
                        height: _1f.west.panel("options").height
                    });
                    _1f.west.panel("options").onCollapse.call(_1f.west);
                });
                if (!_1f.expandWest) {
                    _1f.expandWest = _20("west");
                    _1f.expandWest.panel("panel").click(function () {
                        _1f.west.panel("open").panel("resize", {left: -_1f.west.panel("options").width});
                        _1f.west.panel("panel").animate({left: 0});
                        return false;
                    });
                }
            } else {
                if (_1e == "north") {
                    if (_1f.north.panel("options").onBeforeCollapse.call(_1f.north) == false) {
                        return;
                    }
                    var hh = cc.height() - 28;
                    if (_b(_1f.expandSouth)) {
                        hh -= _1f.expandSouth.panel("options").height;
                    } else {
                        if (_b(_1f.south)) {
                            hh -= _1f.south.panel("options").height;
                        }
                    }
                    _1f.center.panel("resize", {top: 28, height: hh});
                    _1f.east.panel("resize", {top: 28, height: hh});
                    _1f.west.panel("resize", {top: 28, height: hh});
                    if (_b(_1f.expandEast)) {
                        _1f.expandEast.panel("resize", {top: 28, height: hh});
                    }
                    if (_b(_1f.expandWest)) {
                        _1f.expandWest.panel("resize", {top: 28, height: hh});
                    }
                    _1f.north.panel("panel").animate({top: -_1f.north.panel("options").height}, function () {
                        _1f.north.panel("close");
                        _1f.expandNorth.panel("open").panel("resize", {top: 0, left: 0, width: cc.width(), height: 28});
                        _1f.north.panel("options").onCollapse.call(_1f.north);
                    });
                    if (!_1f.expandNorth) {
                        _1f.expandNorth = _20("north");
                        _1f.expandNorth.panel("panel").click(function () {
                            _1f.north.panel("open").panel("resize", {top: -_1f.north.panel("options").height});
                            _1f.north.panel("panel").animate({top: 0});
                            return false;
                        });
                    }
                } else {
                    if (_1e == "south") {
                        if (_1f.south.panel("options").onBeforeCollapse.call(_1f.south) == false) {
                            return;
                        }
                        var hh = cc.height() - 28;
                        if (_b(_1f.expandNorth)) {
                            hh -= _1f.expandNorth.panel("options").height;
                        } else {
                            if (_b(_1f.north)) {
                                hh -= _1f.north.panel("options").height;
                            }
                        }
                        _1f.center.panel("resize", {height: hh});
                        _1f.east.panel("resize", {height: hh});
                        _1f.west.panel("resize", {height: hh});
                        if (_b(_1f.expandEast)) {
                            _1f.expandEast.panel("resize", {height: hh});
                        }
                        if (_b(_1f.expandWest)) {
                            _1f.expandWest.panel("resize", {height: hh});
                        }
                        _1f.south.panel("panel").animate({top: cc.height()}, function () {
                            _1f.south.panel("close");
                            _1f.expandSouth.panel("open").panel("resize", {
                                top: cc.height() - 28,
                                left: 0,
                                width: cc.width(),
                                height: 28
                            });
                            _1f.south.panel("options").onCollapse.call(_1f.south);
                        });
                        if (!_1f.expandSouth) {
                            _1f.expandSouth = _20("south");
                            _1f.expandSouth.panel("panel").click(function () {
                                _1f.south.panel("open").panel("resize", {top: cc.height()});
                                _1f.south.panel("panel").animate({top: cc.height() - _1f.south.panel("options").height});
                                return false;
                            });
                        }
                    }
                }
            }
        }
    }
    ;
    function _22(_23, _24) {
        var _25 = $.data(_23, "layout").panels;
        var cc = $(_23);
        if (_24 == "east" && _25.expandEast) {
            if (_25.east.panel("options").onBeforeExpand.call(_25.east) == false) {
                return;
            }
            _25.expandEast.panel("close");
            _25.east.panel("panel").stop(true, true);
            _25.east.panel("open").panel("resize", {left: cc.width()});
            _25.east.panel("panel").animate({left: cc.width() - _25.east.panel("options").width}, function () {
                _2(_23);
                _25.east.panel("options").onExpand.call(_25.east);
            });
        } else {
            if (_24 == "west" && _25.expandWest) {
                if (_25.west.panel("options").onBeforeExpand.call(_25.west) == false) {
                    return;
                }
                _25.expandWest.panel("close");
                _25.west.panel("panel").stop(true, true);
                _25.west.panel("open").panel("resize", {left: -_25.west.panel("options").width});
                _25.west.panel("panel").animate({left: 0}, function () {
                    _2(_23);
                    _25.west.panel("options").onExpand.call(_25.west);
                });
            } else {
                if (_24 == "north" && _25.expandNorth) {
                    if (_25.north.panel("options").onBeforeExpand.call(_25.north) == false) {
                        return;
                    }
                    _25.expandNorth.panel("close");
                    _25.north.panel("panel").stop(true, true);
                    _25.north.panel("open").panel("resize", {top: -_25.north.panel("options").height});
                    _25.north.panel("panel").animate({top: 0}, function () {
                        _2(_23);
                        _25.north.panel("options").onExpand.call(_25.north);
                    });
                } else {
                    if (_24 == "south" && _25.expandSouth) {
                        if (_25.south.panel("options").onBeforeExpand.call(_25.south) == false) {
                            return;
                        }
                        _25.expandSouth.panel("close");
                        _25.south.panel("panel").stop(true, true);
                        _25.south.panel("open").panel("resize", {top: cc.height()});
                        _25.south.panel("panel").animate({top: cc.height() - _25.south.panel("options").height}, function () {
                            _2(_23);
                            _25.south.panel("options").onExpand.call(_25.south);
                        });
                    }
                }
            }
        }
    }
    ;
    function _26(_27) {
        var _28 = $.data(_27, "layout").panels;
        var cc = $(_27);
        if (_28.east.length) {
            _28.east.panel("panel").bind("mouseover", "east", _1c);
        }
        if (_28.west.length) {
            _28.west.panel("panel").bind("mouseover", "west", _1c);
        }
        if (_28.north.length) {
            _28.north.panel("panel").bind("mouseover", "north", _1c);
        }
        if (_28.south.length) {
            _28.south.panel("panel").bind("mouseover", "south", _1c);
        }
        _28.center.panel("panel").bind("mouseover", "center", _1c);
        function _1c(e) {
            if (_1 == true) {
                return;
            }
            if (e.data != "east" && _b(_28.east) && _b(_28.expandEast)) {
                _28.east.panel("panel").animate({left: cc.width()}, function () {
                    _28.east.panel("close");
                });
            }
            if (e.data != "west" && _b(_28.west) && _b(_28.expandWest)) {
                _28.west.panel("panel").animate({left: -_28.west.panel("options").width}, function () {
                    _28.west.panel("close");
                });
            }
            if (e.data != "north" && _b(_28.north) && _b(_28.expandNorth)) {
                _28.north.panel("panel").animate({top: -_28.north.panel("options").height}, function () {
                    _28.north.panel("close");
                });
            }
            if (e.data != "south" && _b(_28.south) && _b(_28.expandSouth)) {
                _28.south.panel("panel").animate({top: cc.height()}, function () {
                    _28.south.panel("close");
                });
            }
            return false;
        }
        ;
    }
    ;
    function _b(pp) {
        if (!pp) {
            return false;
        }
        if (pp.length) {
            return pp.panel("panel").is(":visible");
        } else {
            return false;
        }
    }
    ;
    $.fn.layout = function (_29, _2a) {
        if (typeof _29 == "string") {
            return $.fn.layout.methods[_29](this, _2a);
        }
        return this.each(function () {
            var _2b = $.data(this, "layout");
            if (!_2b) {
                var _2c = $.extend({}, {fit: $(this).attr("fit") == "true"});
                $.data(this, "layout", {options: _2c, panels: _c(this)});
                _26(this);
            }
            _2(this);
        });
    };
    $.fn.layout.methods = {
        resize: function (jq) {
            return jq.each(function () {
                _2(this);
            });
        }, panel: function (jq, _2d) {
            return $.data(jq[0], "layout").panels[_2d];
        }, collapse: function (jq, _2e) {
            return jq.each(function () {
                _1c(this, _2e);
            });
        }, expand: function (jq, _2f) {
            return jq.each(function () {
                _22(this, _2f);
            });
        }
    };
})(jQuery);


//
//
//
(function ($) {
    $.parser = {
        auto: true, onComplete: function (_153) {
        }, plugins: ["resize", "tree", "layout", "panel"], parse: function (_154) {
            var aa = [];
            for (var i = 0; i < $.parser.plugins.length; i++) {
                var name = $.parser.plugins[i];
                var r = $(".easyui-" + name, _154);
                if (r.length) {
                    if (r[name]) {
                        r[name]();
                    } else {
                        aa.push({name: name, jq: r});
                    }
                }
            }
            if (aa.length && window.easyloader) {
                var _155 = [];
                for (var i = 0; i < aa.length; i++) {
                    _155.push(aa[i].name);
                }
                easyloader.load(_155, function () {
                    for (var i = 0; i < aa.length; i++) {
                        var name = aa[i].name;
                        var jq = aa[i].jq;
                        jq[name]();
                    }
                    $.parser.onComplete.call($.parser, _154);
                });
            } else {
                $.parser.onComplete.call($.parser, _154);
            }
        }
    };
    $(function () {
        if (!window.easyloader && $.parser.auto) {
            $.parser.parse();
        }
    });
})(jQuery);


if (typeof (LigerUIManagers) == "undefined")
    LigerUIManagers = {};
(function ($) {
    ///	<param name="$" type="jQuery"></param>
    $.fn.ligerGetTreeManager = function () {
        return LigerUIManagers[this[0].id + "_Tree"];
    };
    $.ligerDefaults = $.ligerDefaults || {};
    $.ligerDefaults.Tree = {
        url: null,
        data: null,
        checkbox: true,
        autoCheckboxEven: true,
        parentIcon: 'folder',
        childIcon: 'leaf',
        iconFieldName:'icon',
        textFieldName: 'text',
        attribute: ['id', 'url'],
        treeLine: true, //是否显示line
        nodeWidth: 90,
        statusName: '__status',
        isLeaf: null, //是否子节点的判断函数
        onBeforeExpand: null,
        onContextmenu: null,
        onExpand: null,
        onBeforeCollapse: null,
        onCollapse: null,
        onBeforeSelect: null,
        onSelect: null,
        onBeforeCancelSelect: null,
        onCancelselect: null,
        onCheck: null,
        onSuccess: null,
        onError: null,
        onClick: null,
        idFieldName: null,
        parentIDFieldName: null,
        topParentIDValue: 0,
        defaultOpen: null,
        defaultChecked: null
    };

    $.fn.ligerTree = function (p) {
        var self = this;
        self.each(function () {
            p = $.extend({}, $.ligerDefaults.Tree, p || {});
            if (this.usedTree)
                return;
            if ($(this).hasClass('l-hidden')) {
                return;
            }
            //public Object
            var g = {
                getData: function () {
                    return g.data;
                },
                //是否包含子节点
                hasChildren: function (treenodedata) {
                    if (p.isLeaf)
                        return p.isLeaf(treenodedata);
                    return treenodedata.children ? true : false;
                },
                //获取父节点
                getParentTreeItem: function (treenode, level) {
                    var treeitem = $(treenode);
                    if (treeitem.parent().hasClass("l-tree"))
                        return null;
                    if (level == undefined) {
                        if (treeitem.parent().parent("li").length == 0)
                            return null;
                        return treeitem.parent().parent("li")[0];
                    }
                    var currentLevel = parseInt(treeitem.attr("outlinelevel"));
                    var currenttreeitem = treeitem;
                    for (var i = currentLevel - 1; i >= level; i--) {
                        currenttreeitem = currenttreeitem.parent().parent("li");
                    }
                    return currenttreeitem[0];
                },
                getChecked: function () {
                    if (!p.checkbox)
                        return null;
                    var nodes = [];
                    $(".l-checkbox-checked", g.tree).parent().parent("li").each(function () {
                        var treedataindex = parseInt($(this).attr("treedataindex"));
                        nodes.push({target: this, data: po.getDataNodeByTreeDataIndex(g.data, treedataindex)});
                    });
                    return nodes;
                },
                getSelected: function () {
                    var node = {};
                    node.target = $(".l-selected", g.tree).parent("li")[0];
                    if (node.target) {
                        var treedataindex = parseInt($(node.target).attr("treedataindex"));
                        node.data = po.getDataNodeByTreeDataIndex(g.data, treedataindex);
                        return node;
                    }
                    return null;
                },
                //升级为父节点级别
                upgrade: function (treeNode) {
                    $(".l-note", treeNode).each(function () {
                        $(this).removeClass("l-note").addClass("l-expandable-open");
                    });
                    $(".l-note-last", treeNode).each(function () {
                        $(this).removeClass("l-note-last").addClass("l-expandable-open");
                    });
                    $("." + po.getChildNodeClassName(), treeNode).each(function () {
                        $(this)
                            .removeClass(po.getChildNodeClassName())
                            .addClass(po.getParentNodeClassName(true));
                    });
                },
                //降级为叶节点级别
                demotion: function (treeNode) {
                    if (!treeNode && treeNode[0].tagName.toLowerCase() != 'li')
                        return;
                    var islast = $(treeNode).hasClass("l-last");
                    $(".l-expandable-open", treeNode).each(function () {
                        $(this).removeClass("l-expandable-open")
                            .addClass(islast ? "l-note-last" : "l-note");
                    });
                    $(".l-expandable-close", treeNode).each(function () {
                        $(this).removeClass("l-expandable-close")
                            .addClass(islast ? "l-note-last" : "l-note");
                    });
                    $("." + po.getParentNodeClassName(true), treeNode).each(function () {
                        $(this)
                            .removeClass(po.getParentNodeClassName(true))
                            .addClass(po.getChildNodeClassName());
                    });
                },
                collapseAll: function () {
                    $(".l-expandable-open", g.tree).click();
                },
                expandAll: function () {
                    $(".l-expandable-close", g.tree).click();
                },
                loadData: function (node, url, param) {
                    g.loading.show();
                    param = param || {};
                    //请求服务器
                    $.ajax({
                        type: 'post',
                        url: url,
                        data: param,
                        dataType: 'json',
                        success: function (data) {
                            g.loading.hide();
                            g.append(node, data);
                            if (p.onSuccess)
                                p.onSuccess(data);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            try {
                                g.loading.hide();
                                if (p.onError)
                                    p.onError(XMLHttpRequest, textStatus, errorThrown);
                            }
                            catch (e) {

                            }
                        }
                    });
                },
                //清空
                clear: function () {
                    //g.tree.html("");
                    $("> li", g.tree).each(function () {
                        g.remove(this);
                    });
                },
                remove: function (treeNode) {
                    var treedataindex = parseInt($(treeNode).attr("treedataindex"));
                    var treenodedata = po.getDataNodeByTreeDataIndex(g.data, treedataindex);
                    if (treenodedata)
                        po.setTreeDataStatus([treenodedata], 'delete');
                    var parentNode = g.getParentTreeItem(treeNode);
                    //复选框处理
                    if (p.checkbox) {
                        $(".l-checkbox", treeNode).remove();
                        po.setParentCheckboxStatus($(treeNode));
                    }
                    $(treeNode).remove();
                    if (parentNode == null) //代表顶级节点
                    {
                        parentNode = g.tree.parent();
                    }
                    //set parent
                    var treeitemlength = $("> ul > li", parentNode).length;
                    if (treeitemlength > 0) {
                        //遍历设置子节点
                        $("> ul > li", parentNode).each(function (i, item) {
                            if (i == 0 && !$(this).hasClass("l-first"))
                                $(this).addClass("l-first");
                            if (i == treeitemlength - 1 && !$(this).hasClass("l-last"))
                                $(this).addClass("l-last");
                            if (i == 0 && i == treeitemlength - 1 && !$(this).hasClass("l-onlychild"))
                                $(this).addClass("l-onlychild");
                            $("> div .l-note,> div .l-note-last", this)
                                .removeClass("l-note l-note-last")
                                .addClass(i == treeitemlength - 1 ? "l-note-last" : "l-note");
                            po.setTreeItem(this, {isLast: i == treeitemlength - 1});
                        });
                    }

                },
                //增加节点集合
                append: function (parentNode, newdata) {
                    if (!newdata || !newdata.length)
                        return false;
                    if (p.idFieldName && p.parentIDFieldName)
                        newdata = po.convertData(newdata);
                    po.addTreeDataIndexToData(newdata);
                    po.setTreeDataStatus(newdata, 'add');
                    po.appendData(parentNode, newdata);
                    if (!parentNode)//增加到根节点
                    {
                        //remove last node class
                        if ($("> li:last", g.tree).length > 0)
                            po.setTreeItem($("> li:last", g.tree)[0], {isLast: false});

                        var gridhtmlarr = po.getTreeHTMLByData(newdata, 1, [], true);
                        gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                        g.tree.append(gridhtmlarr.join(''));

                        $(".l-body", g.tree).hover(function () {
                            $(this).addClass("l-over");
                        }, function () {
                            $(this).removeClass("l-over");
                        });

                        po.upadteTreeWidth();
                        return;
                    }
                    var treeitem = $(parentNode);
                    var outlineLevel = parseInt(treeitem.attr("outlinelevel"));

                    var hasChildren = $("> ul", treeitem).length > 0;
                    if (!hasChildren) {
                        treeitem.append("<ul class='l-children'></ul>");
                        //设置为父节点
                        g.upgrade(parentNode);
                    }
                    //remove last node class
                    if ($("> .l-children > li:last", treeitem).length > 0)
                        po.setTreeItem($("> .l-children > li:last", treeitem)[0], {isLast: false});

                    var isLast = [];
                    for (var i = 1; i <= outlineLevel - 1; i++) {
                        var currentParentTreeItem = $(g.getParentTreeItem(parentNode, i));
                        isLast.push(currentParentTreeItem.hasClass("l-last"));
                    }
                    isLast.push(treeitem.hasClass("l-last"));
                    var gridhtmlarr = po.getTreeHTMLByData(newdata, outlineLevel + 1, isLast, true);
                    gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                    $(">.l-children", parentNode).append(gridhtmlarr.join(''));

                    po.upadteTreeWidth();

                    $(">.l-children .l-body", parentNode).hover(function () {
                        $(this).addClass("l-over");
                    }, function () {
                        $(this).removeClass("l-over");
                    });
                }
            };
            //private Object
            var po = {
                //根据数据索引获取数据
                getDataNodeByTreeDataIndex: function (data, treedataindex) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].treedataindex == treedataindex)
                            return data[i];
                        if (data[i].children) {
                            var targetData = po.getDataNodeByTreeDataIndex(data[i].children, treedataindex);
                            if (targetData)
                                return targetData;
                        }
                    }
                    return null;
                },
                //设置数据状态
                setTreeDataStatus: function (data, status) {
                    $(data).each(function () {
                        this[p.statusName] = status;
                        if (this.children) {
                            po.setTreeDataStatus(this.children, status);
                        }
                    });
                },
                //设置data 索引
                addTreeDataIndexToData: function (data) {
                    $(data).each(function () {
                        if (this.treedataindex != undefined)
                            return;
                        this.treedataindex = g.treedataindex++;
                        if (this.children) {
                            po.addTreeDataIndexToData(this.children);
                        }
                    });
                },
                //添加项到g.data
                appendData: function (treeNode, data) {
                    var treedataindex = parseInt($(treeNode).attr("treedataindex"));
                    var treenodedata = po.getDataNodeByTreeDataIndex(g.data, treedataindex);
                    if (g.treedataindex == undefined)
                        g.treedataindex = 0;
                    if (treenodedata && treenodedata.children == undefined)
                        treenodedata.children = [];
                    $(data).each(function (i, item) {
                        if (treenodedata)
                            treenodedata.children[treenodedata.children.length] = $.extend({}, item);
                        else
                            g.data[g.data.length] = $.extend({}, item);
                    });
                },
                setTreeItem: function (treeNode, options) {
                    if (!options)
                        return;
                    var treeItem = $(treeNode);
                    var outlineLevel = parseInt(treeItem.attr("outlinelevel"));
                    if (options.isLast != undefined) {
                        if (options.isLast == true) {
                            treeItem.removeClass("l-last").addClass("l-last");
                            $("> div .l-note", treeItem).removeClass("l-note").addClass("l-note-last");
                            $(".l-children li", treeItem)
                                .find(".l-box:eq(" + (outlineLevel - 1) + ")")
                                .removeClass("l-line");
                        }
                        else if (options.isLast == false) {
                            treeItem.removeClass("l-last");
                            $("> div .l-note-last", treeItem).removeClass("l-note-last").addClass("l-note");

                            $(".l-children li", treeItem)
                                .find(".l-box:eq(" + (outlineLevel - 1) + ")")
                                .removeClass("l-line")
                                .addClass("l-line");
                        }
                    }
                },
                upadteTreeWidth: function () {
                    var treeWidth = g.maxOutlineLevel * 22;
                    if (p.checkbox)
                        treeWidth += 22;
                    if (p.parentIcon || p.childIcon)
                        treeWidth += 22;
                    treeWidth += p.nodeWidth;
                    g.tree.width(treeWidth);
                },
                getChildNodeClassName: function () {
                    return 'l-tree-icon-' + p.childIcon;
                },
                getParentNodeClassName: function (isOpen) {
                    var nodeclassname = 'l-tree-icon-' + p.parentIcon;
                    if (isOpen)
                        nodeclassname += '-open';
                    return nodeclassname;
                },
                //根据data生成最终完整的tree html
                getTreeHTMLByData: function (data, outlineLevel, isLast, isExpand) {
                    if (g.maxOutlineLevel < outlineLevel)
                        g.maxOutlineLevel = outlineLevel;
                    isLast = isLast || [];
                    outlineLevel = outlineLevel || 1;
                    var treehtmlarr = [];
                    if (!isExpand)
                        treehtmlarr.push('<ul class="l-children" style="display:none">');
                    else
                        treehtmlarr.push("<ul class='l-children'>");
                    for (var i = 0; i < data.length; i++) {
                        var isFirst = i == 0;
                        var isLastCurrent = i == data.length - 1;
                        var isExpandCurrent = true;
                        if (data[i].isexpand == false || data[i].isexpand == "false")
                            isExpandCurrent = false;

                        treehtmlarr.push('<li ');
                        if (data[i].treedataindex != undefined)
                            treehtmlarr.push('treedataindex="' + data[i].treedataindex + '" ');
                        if (isExpandCurrent)
                            treehtmlarr.push('isexpand=' + data[i].isexpand + ' ');
                        treehtmlarr.push('outlinelevel=' + outlineLevel + ' ');
                        //增加属性支持
                        for (var j = 0; j < g.sysAttribute.length; j++) {
                            if ($(this).attr(g.sysAttribute[j]))
                                data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                        }
                        for (var j = 0; j < p.attribute.length; j++) {
                            if (data[i][p.attribute[j]])
                                treehtmlarr.push(p.attribute[j] + '="' + data[i][p.attribute[j]] + '" ');
                        }

                        //css class
                        treehtmlarr.push('class="');
                        isFirst && treehtmlarr.push('l-first ');
                        isLastCurrent && treehtmlarr.push('l-last ');
                        isFirst && isLastCurrent && treehtmlarr.push('l-onlychild ');
                        treehtmlarr.push('"');
                        treehtmlarr.push('>');
                        treehtmlarr.push('<div class="l-body">');
                        for (var k = 0; k <= outlineLevel - 2; k++) {
                            if (isLast[k])
                                treehtmlarr.push('<div class="l-box"></div>');
                            else
                                treehtmlarr.push('<div class="l-box l-line"></div>');
                        }
                        if (g.hasChildren(data[i])) {
                            if (isExpandCurrent)
                                treehtmlarr.push('<div class="l-box l-expandable-open"></div>');
                            else
                                treehtmlarr.push('<div class="l-box l-expandable-close"></div>');
                            if (p.checkbox) {
                                if (data[i].ischecked)
                                    treehtmlarr.push('<div  class="l-box l-checkbox l-checkbox-checked"></div>');
                                else
                                    treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-unchecked"></div>');
                            }
                            var icon_class = po.getParentNodeClassName(p.parentIcon && isExpandCurrent);
                            var icon_img_html = '';
                            if (p.iconFieldName && data[i][p.iconFieldName]){
                                icon_class='l-tree-icon-none';
                                icon_img_html = '<img width="98%" src="' + data[i][p.iconFieldName] + '" />';
                            }
                            p.parentIcon && treehtmlarr.push('<div class="l-box ' + icon_class + '">'+icon_img_html+'</div>');
                        }
                        else {
                            if (isLastCurrent)
                                treehtmlarr.push('<div class="l-box l-note-last"></div>');
                            else
                                treehtmlarr.push('<div class="l-box l-note"></div>');
                            if (p.checkbox) {
                                if (data[i].ischecked)
                                    treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-checked"></div>');
                                else
                                    treehtmlarr.push('<div class="l-box l-checkbox l-checkbox-unchecked"></div>');
                            }
                            var icon_class = po.getChildNodeClassName();
                            var icon_img_html = '';
                            if (p.iconFieldName && data[i][p.iconFieldName]){
                                icon_class='l-tree-icon-none';
                                icon_img_html = '<img width="98%" src="' + data[i][p.iconFieldName] + '" />';
                            }
                            p.childIcon && treehtmlarr.push('<div class="l-box ' + icon_class + '">'+icon_img_html+'</div>');
                        }

                        treehtmlarr.push('<span>' + data[i][p.textFieldName] + '</span></div>');
                        if (g.hasChildren(data[i])) {
                            var isLastNew = [];
                            for (var k = 0; k < isLast.length; k++) {
                                isLastNew.push(isLast[k]);
                            }
                            isLastNew.push(isLastCurrent);
                            treehtmlarr.push(po.getTreeHTMLByData(data[i].children, outlineLevel + 1, isLastNew, isExpandCurrent).join(''));
                        }
                        treehtmlarr.push('</li>');
                    }
                    treehtmlarr.push("</ul>");
                    return treehtmlarr;

                },
                //根据简洁的html获取data
                getDataByTreeHTML: function (treeDom) {
                    var data = [];
                    $("> li", treeDom).each(function (i, item) {
                        var dataindex = data.length;
                        data[dataindex] =
                        {
                            treedataindex: g.treedataindex++
                        };
                        if (!$("> span,> a", this).html()) {
                            data[dataindex][p.textFieldName] = $(item).html();
                        } else {
                            data[dataindex][p.textFieldName] = $("> span,> a", this).html();
                        }
                        for (var j = 0; j < g.sysAttribute.length; j++) {
                            if ($(this).attr(g.sysAttribute[j]))
                                data[dataindex][g.sysAttribute[j]] = $(this).attr(g.sysAttribute[j]);
                        }
                        for (var j = 0; j < p.attribute.length; j++) {
                            if ($(this).attr(p.attribute[j]))
                                data[dataindex][p.attribute[j]] = $(this).attr(p.attribute[j]);
                        }
                        if ($("> ul", this).length > 0) {
                            data[dataindex].children = po.getDataByTreeHTML($("> ul", this));
                        }
                    });
                    return data;
                },
                applyTree: function () {
                    g.data = po.getDataByTreeHTML(g.tree);
                    var gridhtmlarr = po.getTreeHTMLByData(g.data, 1, [], true);
                    gridhtmlarr[gridhtmlarr.length - 1] = gridhtmlarr[0] = "";
                    g.tree.html(gridhtmlarr.join(''));
                    po.upadteTreeWidth();
                    $(".l-body", g.tree).hover(function () {
                        $(this).addClass("l-over");
                    }, function () {
                        $(this).removeClass("l-over");
                    });

                },
                applyTreeEven: function (treeNode) {
                    $("> .l-body", treeNode).hover(function () {
                        $(this).addClass("l-over");
                    }, function () {
                        $(this).removeClass("l-over");
                    });
                },
                setTreeEven: function () {
                    p.onContextmenu && g.tree.bind("contextmenu", function (e) {
                        var obj = (e.target || e.srcElement);
                        var treeitem = null;
                        if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("l-box"))
                            treeitem = $(obj).parent().parent();
                        else if ($(obj).hasClass("l-body"))
                            treeitem = $(obj).parent();
                        else if (obj.tagName.toLowerCase() == "li")
                            treeitem = $(obj);
                        if (!treeitem)
                            return;
                        var treedataindex = parseInt(treeitem.attr("treedataindex"));
                        var treenodedata = po.getDataNodeByTreeDataIndex(g.data, treedataindex);
                        return p.onContextmenu({data: treenodedata, target: treeitem[0]}, e);
                    });
                    g.tree.click(function (e) {
                        var obj = (e.target || e.srcElement);
                        var treeitem = null;
                        if (obj.tagName.toLowerCase() == "a" || obj.tagName.toLowerCase() == "span" || $(obj).hasClass("l-box"))
                            treeitem = $(obj).parent().parent();
                        else if ($(obj).hasClass("l-body"))
                            treeitem = $(obj).parent();
                        else
                            treeitem = $(obj);
                        if (!treeitem)
                            return;
                        var treedataindex = parseInt(treeitem.attr("treedataindex"));
                        var treenodedata = po.getDataNodeByTreeDataIndex(g.data, treedataindex);
                        var treeitembtn = $(".l-body:first .l-expandable-open:first,.l-body:first .l-expandable-close:first", treeitem);
                        if (!$(obj).hasClass("l-checkbox")) {
                            if ($(">div:first", treeitem).hasClass("l-selected")) {
                                if (p.onBeforeCancelSelect
                                    && p.onBeforeCancelSelect({data: treenodedata, target: treeitem[0]}) == false)
                                    return false;
                                $(">div:first", treeitem).removeClass("l-selected");
                                p.onCancelSelect && p.onCancelSelect({data: treenodedata, target: treeitem[0]});
                            }
                            else {
                                if (p.onBeforeSelect
                                    && p.onBeforeSelect({data: treenodedata, target: treeitem[0]}) == false)
                                    return false;
                                $(".l-body", g.tree).removeClass("l-selected");
                                $(">div:first", treeitem).addClass("l-selected");
                                p.onSelect && p.onSelect({data: treenodedata, target: treeitem[0]});
                            }
                        }
                        //chekcbox even
                        if ($(obj).hasClass("l-checkbox")) {
                            if (p.autoCheckboxEven) {
                                //状态：未选中
                                if ($(obj).hasClass("l-checkbox-unchecked")) {
                                    $(obj).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
                                    $(".l-children .l-checkbox", treeitem)
                                        .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                        .addClass("l-checkbox-checked");
                                    p.onCheck && p.onCheck({data: treenodedata, target: treeitem[0]}, true);
                                }
                                //状态：选中
                                else if ($(obj).hasClass("l-checkbox-checked")) {
                                    $(obj).removeClass("l-checkbox-checked").addClass("l-checkbox-unchecked");
                                    $(".l-children .l-checkbox", treeitem)
                                        .removeClass("l-checkbox-incomplete l-checkbox-checked")
                                        .addClass("l-checkbox-unchecked");
                                    p.onCheck && p.onCheck({data: treenodedata, target: treeitem[0]}, false);
                                }
                                //状态：未完全选中
                                else if ($(obj).hasClass("l-checkbox-incomplete")) {
                                    $(obj).removeClass("l-checkbox-incomplete").addClass("l-checkbox-checked");
                                    $(".l-children .l-checkbox", treeitem)
                                        .removeClass("l-checkbox-incomplete l-checkbox-unchecked")
                                        .addClass("l-checkbox-checked");
                                    p.onCheck && p.onCheck({data: treenodedata, target: treeitem[0]}, true);
                                }
                                po.setParentCheckboxStatus(treeitem);
                            }
                        }
                        //状态：已经张开
                        else if (treeitembtn.hasClass("l-expandable-open")) {
                            if (p.onBeforeCollapse
                                && p.onBeforeCollapse({data: treenodedata, target: treeitem[0]}) == false)
                                return false;
                            treeitembtn
                                .removeClass("l-expandable-open")
                                .addClass("l-expandable-close");
                            $("> .l-children", treeitem).slideToggle('fast');
                            $("> div ." + po.getParentNodeClassName(true), treeitem)
                                .removeClass(po.getParentNodeClassName(true))
                                .addClass(po.getParentNodeClassName());
                            p.onCollapse && p.onCollapse({data: treenodedata, target: treeitem[0]});
                        }
                        //状态：没有张开
                        else if (treeitembtn.hasClass("l-expandable-close")) {
                            if (p.onBeforeExpand
                                && p.onBeforeExpand({data: treenodedata, target: treeitem[0]}) == false)
                                return false;
                            treeitembtn
                                .removeClass("l-expandable-close")
                                .addClass("l-expandable-open");
                            $("> .l-children", treeitem).slideToggle('fast', function () {
                                p.onExpand && p.onExpand({data: treenodedata, target: treeitem[0]});
                            });
                            $("> div ." + po.getParentNodeClassName(), treeitem)
                                .removeClass(po.getParentNodeClassName())
                                .addClass(po.getParentNodeClassName(true));
                        }
                        p.onClick && p.onClick({data: treenodedata, target: treeitem[0]});
                    });
                },
                //递归设置父节点的状态
                setParentCheckboxStatus: function (treeitem) {
                    //当前同级别或低级别的节点是否都选中了
                    var isCheckedComplete = $(".l-checkbox-unchecked", treeitem.parent()).length == 0;
                    //当前同级别或低级别的节点是否都没有选中
                    var isCheckedNull = $(".l-checkbox-checked", treeitem.parent()).length == 0;
                    if (isCheckedComplete) {
                        treeitem.parent().prev().find(".l-checkbox")
                            .removeClass("l-checkbox-unchecked l-checkbox-incomplete")
                            .addClass("l-checkbox-checked");
                    }
                    else if (isCheckedNull) {
                        treeitem.parent().prev().find("> .l-checkbox")
                            .removeClass("l-checkbox-checked l-checkbox-incomplete")
                            .addClass("l-checkbox-unchecked");
                    }
                    else {
                        treeitem.parent().prev().find("> .l-checkbox")
                            .removeClass("l-checkbox-unchecked l-checkbox-checked")
                            .addClass("l-checkbox-incomplete");
                    }
                    if (treeitem.parent().parent("li").length > 0)
                        po.setParentCheckboxStatus(treeitem.parent().parent("li"));
                },
                convertData: function (data)      //将ID、ParentID这种数据格式转换为树格式
                {
                    if (!data || !data.length)
                        return [];
                    var isolate = function (pid)//根据ParentID判断是否孤立
                    {
                        if (pid == p.topParentIDValue)
                            return false;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i][p.idFieldName] == pid)
                                return false;
                        }
                        return true;
                    };
                    //计算孤立节点的个数
                    var isolateLength = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (isolate(data[i][p.parentIDFieldName]))
                            isolateLength++;
                    }
                    var targetData = [];                    //存储数据的容器(返回)
                    var itemLength = data.length;           //数据集合的个数
                    var insertedLength = 0;                 //已插入的数据个数
                    var currentIndex = 0;                   //当前数据索引
                    var getItem = function (container, id)    //获取数据项(为空时表示没有插入)
                    {
                        if (!container.length)
                            return null;
                        for (var i = 0; i < container.length; i++) {
                            if (container[i][p.idFieldName] == id)
                                return container[i];
                            if (container[i].children) {
                                var finditem = getItem(container[i].children, id);
                                if (finditem)
                                    return finditem;
                            }
                        }
                        return null;
                    };
                    var addItem = function (container, item)  //插入数据项
                    {
                        container.push($.extend({}, item));
                        insertedLength++;
                    };
                    //判断已经插入的节点和孤立节点 的个数总和是否已经满足条件
                    while (insertedLength + isolateLength < itemLength) {
                        var item = data[currentIndex];
                        var id = item[p.idFieldName];
                        var pid = item[p.parentIDFieldName];
                        if (pid == p.topParentIDValue)//根节点
                        {
                            getItem(targetData, id) == null && addItem(targetData, item);
                        }
                        else {
                            var pitem = getItem(targetData, pid);
                            if (pitem && getItem(targetData, id) == null)//找到父节点数据并且还没插入
                            {
                                pitem.children = pitem.children || [];
                                addItem(pitem.children, item);
                            }
                        }
                        currentIndex = (currentIndex + 1) % itemLength;
                    }
                    return targetData;
                }
            };

//==============================================================================================//
            var chZ = {
                num: new RegExp("^[1-9]\\d*$|^0$"),
                intr: new RegExp("\\(?[1-9]+~\\d*\\)?$"),
                mult: new RegExp("\\(?[1-9]+[0-9,]*\\d*\\)?$|\\([1-9]+\\d*\\)?$"),
                strr: new RegExp("^[/\\(0-9\\)][/\\(0-9~,\\)]*[/\\(0-9\\)]$"),
                cuthead: /[0-9]|\(?[1-9]+~\d*\)?|\(?[1-9]+[0-9,]*\d*\)?|\([1-9]+\d*\)?/i,
                //默认选择的入口
                defaultChecked: function (element, options) {
                    var self = this;
                    self.elem = $(element);
                    if (typeof (options) == "number") {
                        Zm.setElemChecked(chZ.getElemByNum(self.elem, options));
                    } else if (typeof (options) == "string") {
                        Zm.setElemChecked(chZ.getElemByStr(self.elem, options));
                    } else if ($.isArray(options) == true) {
                        Zm.setElemChecked(chZ.getElemByArr(element, options));//是数组时执行
                    } else if (typeof (options) == "object") {
                        Zm.setElemChecked(chZ.getElemByObj(element, options));//是json对象时执行
                    }
                },
                //默认打开的入口
                defaultOpen: function (element, options) {
                    var self = this;
                    self.elem = $(element);
                    if (options == "" || options == null)
                        return;
                    if (typeof (options) == "number") {
                        Zm.setDefaultOpen(chZ.getElemByNum(self.elem, options));
                    } else if (typeof (options) == "string") {
                        Zm.setDefaultOpen(chZ.getElemByStr(self.elem, options));
                    } else if ($.isArray(options)) {
                        Zm.setDefaultOpen(chZ.getElemByArr(element, options));//是数组时执行
                    } else if (typeof (options) == "object") {
                        Zm.setDefaultOpen(chZ.getElemByObj(element, options));//是json对象时执行
                    }
                },
                //根据数字选择 element对应的孩子节点li,反回选取的对象（数字）
                getElemByNum: function (element, num) {
                    num = num < 0 ? 0 : num - 1;
                    return $(element).find(">li:eq(" + num + "),>ul>li:eq(" + num + ")");
                },
                //根据字符串的规定格式，反回选取的对象所组合的数组eArr
                getElemByStr: function (element, str) {
                    var self = this;
                    var eArr = [];
                    if (str == "" || str == null)
                        return;
                    if (str.indexOf(";") != -1) {
                        if (/;$/.test(str)) {
                            str = str.substring(0, str.lastIndexOf(";"));
                        }
                        if (/^;/.test(str)) {
                            str = str.substring(str.indexOf(str.match(cuthead)), str.length);
                        }
                        var arr = str.split(";");
                        $.each(arr, function (i, it) {
                            $.merge(eArr, chZ.getElemByStr(element, it));
                        });
                        return eArr;
                    } else {
                        if (/^\//.test(str)) {
                            str = str.substring(str.indexOf(str.match(/[0-9\(]/)), str.length);
                        }
                        self.elem = $(element);
                        var arr = str.split("/");
                        $.each(arr, function (i, it) {
                            it = it.replace(/\(\s/g, "").replace(/\)\s/g, "");
                            if (chZ.num.test(it)) {
                                it = parseInt(it, 10);
                                self.elem = chZ.getElemByNum(self.elem, it);
                            } else if (chZ.intr.test(it)) {
                                it = it.split("~");
                                var m = parseInt(it[0], 10) - 1, n = parseInt(it[1], 10);
                                self.elem = self.elem.find(">li,>ul>li").slice(m, n);
                            } else if (chZ.mult.test(it)) {
                                it = it.split(",");
                                var selet = "";
                                $.each(it, function (j, jt) {
                                    var k = parseInt(jt, 10) - 1;
                                    selet += ">ul>li:eq(" + k + "),>li:eq(" + k + "),";
                                });
                                self.elem = self.elem.find(selet);
                            }
                            $.merge(eArr, self.elem);
                        });
                        return eArr;
                    }
                },
                //根据数组的规定格式，反回选取的对象所组合的数组eArr 。(数组形式：数字+字符串)
                getElemByArr: function (element, arr) {
                    var self = this;
                    if (arr.length < 1 || arr == null)
                        return;
                    var eArr = [];
                    self.elem = $(element);
                    $.each(arr, function (i, it) {
                        if (typeof (it) == "number") {
                            self.elem = chZ.getElemByNum(self.elem, it);
                        } else if (typeof (it) == "string") {
                            self.elem = chZ.getElemByStr(self.elem, it);
                            self.elem = self.elem[self.elem.length - 1];
                        }
                        $.merge(eArr, $(self.elem));
                    });
                    return eArr;
                },
                //根据json对象的规定格式，反回选取的对象所组合的数组eArr 。(json对象形式：数字+字符串+数组)
                getElemByObj: function (element, obj) {
                    var self = this;
                    if (!obj || obj == null)
                        return;
                    var eArr = [];
                    $.each(obj, function (key, value) {

                        self.elem = $(element);
                        if ($.isArray(value)) {
                            $.each(value, function (i, it) {
                                $.merge(eArr, $("li[" + key + "='" + it + "']", self.elem));
                            });
                        } else {
                            var vArr = value.toString().split(";");
                            $.each(vArr, function (i, it) {
                                $.merge(eArr, $("li[" + key + "='" + it + "']", self.elem));
                            });
                        }
                    });
                    return eArr;
                }
            };
            var Zm = {
                //根据选择的dom对象组成的数组，操作默认选项。
                setElemChecked: function (eArr) {
                    if (!eArr || eArr == null || eArr.length < 1) {
                        eArr = [];
                    }
                    $.each(eArr, function (i, element) {
                        var elem = $(element).attr("ischecked", "true");
                        var oel = elem.siblings().not("li[ischecked='true']").not(elem);
                        elem.find(">div:first>div.l-checkbox").addClass("l-checkbox-checked").removeClass("l-checkbox-unchecked");
                        $("li[ischecked='true']", elem).find(">div:first>div.l-checkbox").addClass("l-checkbox-checked").removeClass("l-checkbox-unchecked");
                        oel.find(">div:first>div.l-checkbox").addClass("l-checkbox-unchecked").removeClass("l-checkbox-checked");
                        $("li", oel).find("div:first>div.l-checkbox").addClass("l-checkbox-unchecked").removeClass("l-checkbox-checked");
                        elem.each(function (i, it) {
                            //递归设置父节点的状态
                            po.setParentCheckboxStatus($(it));
                        });
                    });
                },
                //根据选择的dom对象组成的数组，操作默认展开项
                setDefaultOpen: function (eArr) {
                    var self = this;
                    if (!eArr || eArr == null || eArr.length < 1) {
                        eArr = [];
                    }
                    $.each(eArr, function (i, element) {
                        self.elem = $(element).attr("isexpand", "true");
                        if (self.elem.children().length > 1) {
                            var expandable = ">.l-body:first .l-expandable-open:first,>.l-body:first .l-expandable-close:first";
                            var folder = ">.l-body:first .l-tree-icon-folder-open:first,>.l-body:first .l-tree-icon-folder:first";
                            var exl = $(expandable, self.elem);
                            var fol = $(folder, self.elem);
                            if (exl.hasClass("l-expandable-close")) {
                                exl.removeClass("l-expandable-close").addClass("l-expandable-open");
                            }
                            if (fol.hasClass("l-tree-icon-folder")) {
                                fol.removeClass("l-tree-icon-folder").addClass("l-tree-icon-folder-open");
                            }
                            self.elem.children("ul.l-children").show();
                        }
                        //递归设置不是默认展开的节点
                        Zm.closeElseDfaultOpen(self.elem);
                    });
                },
                closeElseDfaultOpen: function (element) {
                    var self = this;
                    self.elem = $(element);
                    var li = self.elem.find("li");

                    var itself = self.elem.siblings().not("li[isexpand='true']");
                    var oli = itself.find("li[isexpand!='true']");

                    var expandable = ">.l-body:first .l-expandable-open:first,>.l-body:first .l-expandable-close:first";
                    var folder = ">.l-body:first .l-tree-icon-folder-open:first,>.l-body:first .l-tree-icon-folder:first";
                    if ($(expandable, itself).hasClass("l-expandable-open")) {
                        $(expandable, itself).removeClass("l-expandable-open").addClass("l-expandable-close");
                    }
                    if ($(folder, itself).hasClass("l-tree-icon-folder-open")) {
                        $(folder, itself).removeClass("l-tree-icon-folder-open").addClass("l-tree-icon-folder");
                    }
                    if ($(expandable, li).hasClass("l-expandable-open")) {
                        $(expandable, li).removeClass("l-expandable-open").addClass("l-expandable-close");
                    }
                    if ($(folder, li).hasClass("l-tree-icon-folder-open")) {
                        $(folder, li).removeClass("l-tree-icon-folder-open").addClass("l-tree-icon-folder");
                    }
                    if ($(expandable, oli).hasClass("l-expandable-open")) {
                        $(expandable, oli).removeClass("l-expandable-open").addClass("l-expandable-close");
                    }
                    if ($(folder, oli).hasClass("l-tree-icon-folder-open")) {
                        $(folder, oli).removeClass("l-tree-icon-folder-open").addClass("l-tree-icon-folder");
                    }
                    self.elem.find(">ul>li").find("ul.l-children").hide();
                    oli.not("li[isexpand='true']").find("ul.l-children").hide();
                    self.elem.siblings().not("li[isexpand='true']").find("ul.l-children").hide();
                }
            };
//==============================================================================================//
            if (!$(this).hasClass('l-tree'))
                $(this).addClass('l-tree');
            g.tree = $(this);
            if (!p.treeLine)
                g.tree.addClass("l-tree-noline");
            g.sysAttribute = ['isexpand', 'ischecked', 'href', 'style'];
            g.loading = $("<div class='l-tree-loading'></div>");
            g.tree.after(g.loading);
            g.data = [];
            g.maxOutlineLevel = 1;
            g.treedataindex = 0;
            po.applyTree();
            po.setTreeEven();
            if (p.data) {
                g.append(null, p.data);
            }
            if (p.url) {
                g.loadData(null, p.url);
            }
            if (typeof (p) == "number") {   //默认展开
                chZ.defaultOpen(g.tree, "/" + p);
            } else {
                chZ.defaultOpen(g.tree, p.defaultOpen);
            }
            chZ.defaultChecked(g.tree, p.defaultChecked);//默认选择
            if (this.id == undefined || this.id == "")
                this.id = "LigerUI_" + new Date().getTime();
            LigerUIManagers[this.id + "_Tree"] = g;
            this.usedTree = true;
        });
        if (this.length == 0)
            return null;
        if (this.length == 1)
            return LigerUIManagers[this[0].id + "_Tree"];
        var managers = [];
        this.each(function () {
            managers.push(LigerUIManagers[this.id + "_Tree"]);
        });
        return managers;
    };

})(jQuery);
/*
 //树,ligerTree与easyui-layout配合,例：
 $("#tree1").ligerTree({
 checkbox: false,
 nodeWidth: 120,
 attribute: ['nodename', 'url'],
 onSelect: function (node)
 {
 if (!node.data.url) return;
 var tabid = $(node.target).attr("tabid");
 if (!tabid)
 {
 tabid = new Date().getTime();
 $(node.target).attr("tabid", tabid);
 }
 $.menuToCenter(tabid,node.data.text,node.data.url,10);
 }
 });
 });
 */

$(function () {
    //classes
    var baseClass = "panel-title-item ",
        itemHover = " ",
        itemCur = "panel-title-item-cur ",
        itemCancel = "panel-title-item-cancel ",
        itemRadius = "ui-corner-top ",
        cancelHover = "panel-title-item-cancel-hover";
    //选择器
    var titles = ".layout-panel-center .panel-header .panel-title",
        center = "div[region='center']",
        iframe = "div[region='center'] iframe";
    //
    $.menuToCenter = function (tabid, title, src, maxPage) {
        var cancelbtn = $("<div></div>", {"class": itemCancel}).html("&nbsp;&nbsp;&nbsp;&nbsp;");
        var titleItem = $("<li></li>", {"class": baseClass + itemRadius});
        var $ul = $(titles).find(">ul:first");
        cancelbtn.hover(function () {
            $(this).addClass(cancelHover);
            $(this).parent().unbind("click");
        }, function () {
            $(this).removeClass(cancelHover);
            $(this).parent().click(function () {
                setCurrent(this, tabid, src);
            });
        }).click(function () {
            cancelbtnClick(this);
        });
        if ($ul.find(">[tabid='" + tabid + "']").length < 1) {
            if ($ul.children().length >= maxPage) {
                if ($ul.find("." + itemCur).attr("tabid") === "_home") {
                    $ul.children().last().addClass(itemCur).attr({
                        "tabid": tabid,
                        "url": src
                    }).text(title).append(cancelbtn);
                    $ul.children().not($ul.children().last()).removeClass(itemCur);
                } else {
                    $ul.find("." + itemCur).attr({"tabid": tabid, "url": src}).text(title).append(cancelbtn);
                }
            } else {
                titleItem.addClass(itemCur).attr({"tabid": tabid, "url": src}).text(title).append(cancelbtn);
                titleItem.hover(function () {
                    $(this).addClass(itemHover);
                }, function () {
                    $(this).removeClass(itemHover);
                });
                titleItem.click(function () {
                    setCurrent(this, tabid, src);
                });
                $ul.append(titleItem);
                $ul.children().not(titleItem).removeClass(itemCur);
            }
        } else {
            $ul.find(">[tabid='" + tabid + "']").addClass(itemCur);
            $ul.children().not($ul.find(">[tabid='" + tabid + "']")).removeClass(itemCur);
        }
        showIframe(tabid, src);
    };
    //
    function cancelbtnClick(el) {
        var index = $(el).parent().index();
        var lis = $(el).parent().parent().children();
        var src, current, tabid;
        if (index === 0) {
            index = lis.length;
        } else if (index === lis.length) {
            index = 0;
        } else {
            index = index - 1;
        }
        if ($(el).parent().is("." + itemCur)) {
            current = lis.eq(index).addClass(itemCur);
            tabid = current.attr("tabid");
            src = current.attr("url");
            lis.not(current).removeClass(itemCur);
        } else {
            tabid = lis.filter("." + itemCur).attr("tabid");
            src = lis.filter("." + itemCur).attr("url");
        }

        showIframe(tabid, src);
        $(center).find(">div[tabid='" + $(el).parent().attr("tabid") + "']").detach();
        $(el).parent().detach();
    }
    ;
    //
    function setCurrent(el, tabid, src) {
        $(el).addClass(itemCur);
        $(el).parent().children().not($(el)).removeClass(itemCur);
        showIframe(tabid, src);
    }

    //
    function showIframe(tabid, src) {
        var _center = "div[region='center']";
        var _div = $("<div></div>");
        if ($(_center).find(">div[tabid='" + tabid + "']").length < 1) {
            _div.attr({"tabid": tabid}).append("<iframe  frameborder='0' src='" + src + "'></iframe>");

            $(_center).append(_div);
        } else {
            _div = $(_center).find(">div[tabid='" + tabid + "']");
        }
        $(_center).find(">div").not(_div).hide();
        _div.show();
        $("iframe", _div).css({'width': '100%', 'height': ($(center).height() - 10) + "px"});
//        if(typeof(src)==='string'&&src!=='undefined'){
//            $("iframe",_div).attr('src', src);
//        }
    }

    if ($(center) && $(iframe)) {
        $.hh = $(center).height();
        $(iframe).css({'width': '100%', 'height': ($.hh - 10) + "px"});
        var _url = $(iframe).attr("src");
        $(titles).wrapInner("<ul><li class='" + baseClass + itemRadius + itemCur + "' tabid='_home' url='" + _url + "'></li></ul>");
        $(iframe).parent().attr("tabid", "_home");
        $(titles).find(">ul>li").click(function () {
            setCurrent(this, "_home", _url);
        });
    }

});