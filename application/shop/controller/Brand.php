<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/15
 * Time: 17:59
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\BrandM;
use app\shop\model\ProductM;
use think\Request;

class Brand extends Base{

    protected $BrandM = null;
    function __construct(Request $request){
        parent::__construct($request);
        $this->BrandM = new BrandM();
    }

    function index(){

        $list = $this->BrandM->paginate(10);
//        var_dump($list);exit;
        $this->assign('list',$list);
        return $this->fetch();
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $brand_name = $request->param('brand_name','','trim');

        if($request->isPost()){
            if(!empty($brand_name)){

                $res = $this->BrandM->insert(array(
                    'brand_name'=>$brand_name,
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

    function doDelete(Request $request){
        if($request->isPost()){
            $brand_id = $request->post('brand_id',0);
            $ProductM = new ProductM();
            $count = $ProductM->where(array('brand_id'=>$brand_id))->count();
            $res = false;
            if($count>0){
                //如果该牌品下已有商品，则进行伪删除
                $res = $this->BrandM->where(array('brand_id'=>$brand_id,'shop_id'=>$this->shop_id))->update(array('status'=>'-1'));
            }else{
                $res = $this->BrandM->where(array('brand_id'=>$brand_id,'shop_id'=>$this->shop_id))->delete();
            }

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
                $this->BrandM->startTrans();
                foreach ($post_rows as $id => $row) {
                    if(in_array($id,$ids)){
                        $this->BrandM->where(array('shop_id'=>$this->shop_id,'brand_id'=>$id))->update($row);
                    }
                }
                $this->BrandM->commit();

                $this->success('添加成功');
            }else{
                $this->error('请至少选择一条数据更新');
            }
        }else{
            $this->error('非法操作');
        }
    }

    function getJsonData(){
        $list = $this->BrandM->where(array("shop_id"=>$this->shop_id))->select();
        $this->success('添加成功',"",$list);
    }
}