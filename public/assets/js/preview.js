/**
 * Created by zzpzero on 2016/4/11.
 */

//图片上传预览    IE是用了滤镜。
function create_preview_image_dom(file,config)
{

    var MAXWIDTH  = typeof config != 'undefined' && typeof config.maxWidth!='undefined'?config.maxWidth:170;
    var MAXHEIGHT = typeof config != 'undefined' && typeof config.maxHeight!='undefined'?config.maxHeight:100;
    var $box = $("<span></span>");
    var $img = $("<img/>");

    var img = $img[0];
    if (file)
    {
        $box.append($img);
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  rect.width;
            img.height =  rect.height;
            //img.style.marginLeft = rect.left+'px';
            img.style.marginTop = rect.top+'px';
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        var src = document.selection.createRange().text;
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        var status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        var $box2 = $("<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>");
        $box.append($box2);
    }
    return $box;
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}