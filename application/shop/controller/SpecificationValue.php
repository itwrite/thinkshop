<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/6/4
 * Time: 17:20
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\SpecificationValueM;
use think\Request;

class SpecificationValue extends Base{
    protected $SpecificationValueM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->SpecificationValueM = new SpecificationValueM();
    }


    function index(Request $request){
        $specification_id = $request->param('specification_id',0);
        $this->assign('specification_id',$specification_id);

        $list = $this->SpecificationValueM->where(array('specification_id'=>$specification_id))->select();
//        var_dump($list);exit;
        $this->assign('list',$list);
        return $this->fetch();
    }

    function getJsonData(Request $request){
        $specification_id = $request->param('specification_id',0);

        $list = $this->SpecificationValueM->where(array('specification_id'=>$specification_id))->select();

        return $this->jsonSuccess("成功",array('values'=>$list));
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $specification_id = $request->param('specification_id',0);
        $value_name = $request->param('value_name','');

        if($request->isPost()){
            if(!empty($value_name)){

                $res = $this->SpecificationValueM->insert(array(
                    'specification_value'=>$value_name,
                    'specification_id'=>$specification_id
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
        $specification_value_id = $request->param('specification_value_id',0);
        if($request->isPost()){

            $res = $this->SpecificationValueM->where(array('specification_value_id'=>$specification_value_id))->delete();
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