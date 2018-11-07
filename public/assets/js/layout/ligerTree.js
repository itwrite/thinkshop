if (typeof (LigerUIManagers) == "undefined") LigerUIManagers = {};
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
        iconFieldName: 'icon',
        textFieldName: 'text',
        attribute: ['id', 'url'],
        treeLine: true,        //是否显示line
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
            if (this.usedTree) return;
            if ($(this).hasClass('l-hidden')) {
                return;
            }
            //public Object
            var g = {
                setData: function (data) {
                    g.data = data||[];
                },
                getData: function () {
                    return g.data;
                },
                //是否包含子节点
                hasChildren: function (treenodedata) {
                    if (p.isLeaf) return p.isLeaf(treenodedata);
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
                    if (!p.checkbox) return null;
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
                    if (!treeNode && treeNode[0].tagName.toLowerCase() != 'li') return;
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
                            if (p.onSuccess) p.onSuccess(data);
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
                    if (treenodedata) po.setTreeDataStatus([treenodedata], 'delete');
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
                    if (!newdata || !newdata.length) return false;
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
                            if (targetData) return targetData;
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
                        if (this.treedataindex != undefined) return;
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
                    if (g.treedataindex == undefined) g.treedataindex = 0;
                    if (treenodedata && treenodedata.children == undefined) treenodedata.children = [];
                    $(data).each(function (i, item) {
                        if (treenodedata)
                            treenodedata.children[treenodedata.children.length] = $.extend({}, item);
                        else
                            g.data[g.data.length] = $.extend({}, item);
                    });
                },
                setTreeItem: function (treeNode, options) {
                    if (!options) return;
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
                    if (p.checkbox) treeWidth += 22;
                    if (p.parentIcon || p.childIcon) treeWidth += 22;
                    treeWidth += p.nodeWidth;
                    g.tree.width(treeWidth);
                },
                getChildNodeClassName: function () {
                    return 'l-tree-icon-' + p.childIcon;
                },
                getParentNodeClassName: function (isOpen) {
                    var nodeclassname = 'l-tree-icon-' + p.parentIcon;
                    if (isOpen) nodeclassname += '-open';
                    return nodeclassname;
                },
                //根据data生成最终完整的tree html
                getTreeHTMLByData: function (data, outlineLevel, isLast, isExpand) {
                    if (g.maxOutlineLevel < outlineLevel)
                        g.maxOutlineLevel = outlineLevel;
                    isLast = isLast || [];
                    outlineLevel = outlineLevel || 1;
                    var treehtmlarr = [];
                    if (!isExpand) treehtmlarr.push('<ul class="l-children" style="display:none">');
                    else treehtmlarr.push("<ul class='l-children'>");
                    for (var i = 0; i < data.length; i++) {
                        var isFirst = i == 0;
                        var isLastCurrent = i == data.length - 1;
                        var isExpandCurrent = true;
                        if (data[i].isexpand == false || data[i].isexpand == "false") isExpandCurrent = false;

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
                            if (isLast[k]) treehtmlarr.push('<div class="l-box"></div>');
                            else treehtmlarr.push('<div class="l-box l-line"></div>');
                        }
                        if (g.hasChildren(data[i])) {
                            if (isExpandCurrent) treehtmlarr.push('<div class="l-box l-expandable-open"></div>');
                            else treehtmlarr.push('<div class="l-box l-expandable-close"></div>');
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
                            if (isLastCurrent) treehtmlarr.push('<div class="l-box l-note-last"></div>');
                            else treehtmlarr.push('<div class="l-box l-note"></div>');
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
                                icon_img_html = '<img width="100%" src="' + data[i][p.iconFieldName] + '" />';
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
                        if (!treeitem) return;
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
                        if (!treeitem) return;
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
                    if (!data || !data.length) return [];
                    var isolate = function (pid)//根据ParentID判断是否孤立
                    {
                        if (pid == p.topParentIDValue) return false;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i][p.idFieldName] == pid) return false;
                        }
                        return true;
                    };
                    //计算孤立节点的个数
                    var isolateLength = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (isolate(data[i][p.parentIDFieldName])) isolateLength++;
                    }
                    var targetData = [];                    //存储数据的容器(返回)
                    var itemLength = data.length;           //数据集合的个数
                    var insertedLength = 0;                 //已插入的数据个数
                    var currentIndex = 0;                   //当前数据索引
                    var getItem = function (container, id)    //获取数据项(为空时表示没有插入)
                    {
                        if (!container.length) return null;
                        for (var i = 0; i < container.length; i++) {
                            if (container[i][p.idFieldName] == id) return container[i];
                            if (container[i].children) {
                                var finditem = getItem(container[i].children, id);
                                if (finditem) return finditem;
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
                    if (typeof(options) == "number") {
                        Zm.setElemChecked(chZ.getElemByNum(self.elem, options));
                    } else if (typeof(options) == "string") {
                        Zm.setElemChecked(chZ.getElemByStr(self.elem, options));
                    } else if ($.isArray(options) == true) {
                        Zm.setElemChecked(chZ.getElemByArr(element, options));//是数组时执行
                    } else if (typeof(options) == "object") {
                        Zm.setElemChecked(chZ.getElemByObj(element, options));//是json对象时执行
                    }
                },
                //默认打开的入口
                defaultOpen: function (element, options) {
                    var self = this;
                    self.elem = $(element);
                    if (options == "" || options == null)return;
                    if (typeof(options) == "number") {
                        Zm.setDefaultOpen(chZ.getElemByNum(self.elem, options));
                    } else if (typeof(options) == "string") {
                        Zm.setDefaultOpen(chZ.getElemByStr(self.elem, options));
                    } else if ($.isArray(options)) {
                        Zm.setDefaultOpen(chZ.getElemByArr(element, options));//是数组时执行
                    } else if (typeof(options) == "object") {
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
                    if (str == "" || str == null)return;
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
                    if (arr.length < 1 || arr == null)return;
                    var eArr = [];
                    self.elem = $(element);
                    $.each(arr, function (i, it) {
                        if (typeof(it) == "number") {
                            self.elem = chZ.getElemByNum(self.elem, it);
                        } else if (typeof(it) == "string") {
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
                    if (!obj || obj == null)return;
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
                        Zm.closeElseDefaultOpen(self.elem);
                    });
                },
                closeElseDefaultOpen: function (element) {
                    var self = this;
                    self.elem = $(element);
                    var li = self.elem.find("li");
                    var oli = self.elem.siblings().not(self.elem);
                    var expandable = ">.l-body:first .l-expandable-open:first,>.l-body:first .l-expandable-close:first";
                    var folder = ">.l-body:first .l-tree-icon-folder-open:first,>.l-body:first .l-tree-icon-folder:first";
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
                }
            };
//==============================================================================================//		
            if (!$(this).hasClass('l-tree')) $(this).addClass('l-tree');
            g.tree = $(this);
            if (!p.treeLine) g.tree.addClass("l-tree-noline");
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
            if (typeof(p) == "number") {   //默认展开
                chZ.defaultOpen(g.tree, "/" + p);
            } else {
                chZ.defaultOpen(g.tree, p.defaultOpen);
            }
            chZ.defaultChecked(g.tree, p.defaultChecked);//默认选择
            if (this.id == undefined || this.id == "") this.id = "LigerUI_" + new Date().getTime();
            LigerUIManagers[this.id + "_Tree"] = g;
            this.usedTree = true;
        });
        if (this.length == 0) return null;
        if (this.length == 1) return LigerUIManagers[this[0].id + "_Tree"];
        var managers = [];
        this.each(function () {
            managers.push(LigerUIManagers[this.id + "_Tree"]);
        });
        return managers;
    };

})(jQuery);