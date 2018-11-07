<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/29
 * Time: 10:18
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\AttributeM;
use think\Request;

class Attribute extends Base{

    protected $AttributeM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->AttributeM = new AttributeM();
    }


    function index(Request $request){
        $category_id = $request->param('category_id',0);
        $this->assign('category_id',$category_id);

        $list = $this->AttributeM->where(array('category_id'=>$category_id))->paginate(20);
//        var_dump($list);exit;
        $this->assign('list',$list);
        return $this->fetch();
    }


    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $attribute_name = $request->param('attribute_name','','trim');
        $category_id = $request->param('category_id',0);
        $value_type = $request->param('value_type','');
        $value_unit = $request->param('value_unit',0);
        $is_require = $request->param('is_require','N');
        $is_input = $request->param('is_input','N');

        if($request->isPost()){
            if(!empty($attribute_name)){
                $value_type = $value_type=='multiselect'?'multiselect':'singleselect';
                $is_require = $is_require=='Y'?'Y':'N';
                $is_input = $is_input=='Y'?'Y':'N';


                $res = $this->AttributeM->insert(array(
                    'attribute_name'=>$attribute_name,
                    'category_id'=>$category_id,
                    'value_type'=>$value_type,
                    'value_unit'=>$value_unit,
                    'is_require'=>$is_require,
                    'is_input'=>$is_input
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
        $attribute_id = $request->param('attribute_id',0);
        if($request->isPost()){

            if(!$this->AttributeM->isHasValues($attribute_id)){
                $res = $this->AttributeM->where(array('attribute_id'=>$attribute_id))->delete();
                if($res){
                    $this->jsonSuccess("删除成功");
                }else{
                    $this->jsonError("删除失败");
                }
            }else{
                $this->jsonError("请先删除其选项");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }

}