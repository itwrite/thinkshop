<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/29
 * Time: 12:07
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\AttributeValueM;
use think\Controller;
use think\Request;

class AttributeValue extends Base{
    protected $AttributeValueM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->AttributeValueM = new AttributeValueM();
    }


    function index(Request $request){
        $attribute_id = $request->param('attribute_id',0);
        $this->assign('attribute_id',$attribute_id);

        $list = $this->AttributeValueM->where(array('attribute_id'=>$attribute_id))->select();
//        var_dump($list);exit;
        $this->assign('list',$list);
        return $this->fetch();
    }

    function getJsonData(Request $request){
        $attribute_id = $request->param('attribute_id',0);

        $list = $this->AttributeValueM->where(array('attribute_id'=>$attribute_id))->select();

        return $this->jsonSuccess("成功",array('values'=>$list));
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $attribute_id = $request->param('attribute_id',0);
        $value_name = $request->param('value_name','');

        if($request->isPost()){
            if(!empty($value_name)){

                $res = $this->AttributeValueM->insert(array(
                    'attribute_value'=>$value_name,
                    'attribute_id'=>$attribute_id
                ));
                if($res){
                    $this->success('添加成功');
                }else{
                    $this->error('添加失败');
                }
            }else{
                $this->error('名称不能为空');
            }
        }else{
            $this->error('非法操作');
        }
    }

    /**
     * @param Request $request
     */
    function doDelete(Request $request){
        $attribute_value_id = $request->param('attribute_value_id',0);
        if($request->isPost()){

            $res = $this->AttributeValueM->where(array('attribute_value_id'=>$attribute_value_id))->delete();
            if($res){
                $this->jsonSuccess("删除成功");
            }else{
                $this->jsonError("删除失败");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }
}