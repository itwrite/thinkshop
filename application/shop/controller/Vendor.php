<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/26
 * Time: 14:09
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\VendorM;
use think\Request;

class Vendor extends Base{

    protected $VendorM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->VendorM = new VendorM();
    }

    function index(Request $request){
        $list = $this->VendorM->paginate(10);
        $this->assign('list',$list);
        return $this->fetch();
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $vendor_name = $request->param('vendor_name','','trim');

        if($request->isPost()){
            if(!empty($vendor_name)){

//                echo $this->shop_id;die;
                $res = $this->VendorM->insert(array(
                    'vendor_name'=>$vendor_name,
                    'shop_id'=>$this->shop_id
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

    function doDelete(Request $request){
        if($request->isPost()){
            $vendor_id = $request->post('vendor_id',0);
            $res = $this->VendorM->where(array('vendor_id'=>$vendor_id,'shop_id'=>$this->shop_id))->delete();
            if($res){
                $this->success('删除成功');
            }else{
                $this->error('删除失败');
            }
        }else{
            $this->error('非法操作');
        }
    }

    function doUpdate(Request $request){
        if($request->isPost()){
            $post_ids = $request->post('ids/a',array());
            $ids = array_keys($post_ids);
            if(!empty($ids)){
                $post_rows = $request->post('rows/a',array());
                $this->VendorM->startTrans();
                foreach ($post_rows as $id => $row) {
                    if(in_array($id,$ids)){
                        $this->VendorM->where(array('shop_id'=>$this->shop_id,'vendor_id'=>$id))->update($row);
                    }
                }
                $this->VendorM->commit();

                $this->success('添加成功');
            }else{
                $this->error('请至少选择一条数据更新');
            }
        }else{
            $this->error('非法操作');
        }
    }

    function getJsonData(){
        $list = $this->VendorM->where(array("shop_id"=>$this->shop_id))->select();
        $this->success('添加成功',"",$list);
    }
}