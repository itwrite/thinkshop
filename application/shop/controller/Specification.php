<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/21
 * Time: 21:20
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\SpecificationM;
use app\shop\model\SpecificationValueM;
use think\Request;

class Specification extends Base{
    protected $SpecificationM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->SpecificationM = new SpecificationM();
    }

    function index(){

        $list = $this->SpecificationM->paginate(20);
//        var_dump($list);exit;
        $this->assign('list',$list);
        return $this->fetch();
    }

    function getJsonAllData(){
        $SpecificationValueM = new SpecificationValueM();
        $list = $this->SpecificationM->where(array('shop_id'=>$this->shop_id))->select();
        foreach ($list as &$row) {
            $row['children'] = $SpecificationValueM->where(array('specification_id'=>$row['specification_id']))->select();
        }
        $this->success("获取成功","",$list);
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $specification_name = $request->param('specification_name','','trim');

        if($request->isPost()){
            if(!empty($specification_name)){

                $res = $this->SpecificationM->insert(array(
                    'specification_name'=>$specification_name,
                    'shop_id'=>$this->shop_id,
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
        $specification_id = $request->param('specification_id',0);
        if($request->isPost()){

            if(!$this->SpecificationM->isHasValues($specification_id)){
                $res = $this->SpecificationM->where(array('shop_id'=>$this->shop_id,'specification_id'=>$specification_id))->delete();
                if($res){
                    $this->jsonSuccess("删除成功");
                }else{
                    $this->jsonError("删除失败");
                }
            }else{
                $this->jsonError("请先删除子项");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }

    function doUpdate(Request $request){
        if($request->isPost()){
            $post_ids = $request->post('ids/a',array());
            $ids = array_keys($post_ids);
            if(!empty($ids)){
                $post_rows = $request->post('rows/a',array());
                $this->SpecificationM->startTrans();
                foreach ($post_rows as $id => $row) {
                    if(in_array($id,$ids)){
                        $this->SpecificationM->where(array('shop_id'=>$this->shop_id,'specification_id'=>$id))->update($row);
                    }
                }
                $this->SpecificationM->commit();

                $this->success('添加成功');
            }else{
                $this->error('请至少选择一条数据更新');
            }
        }else{
            $this->error('非法操作');
        }
    }

}