<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/25
 * Time: 17:55
 */

namespace app\shop\controller;

use app\shop\common\Base;
use app\shop\model\AttributeM;
use app\shop\model\AttributeValueM;
use app\shop\model\BrandM;
use app\shop\model\CategoryM;
use app\shop\model\CategorySpecificationRelationM;
use app\shop\model\ProductAttributeM;
use app\shop\model\ProductItemM;
use app\shop\model\ProductM;
use app\shop\model\ProductSpecificationM;
use app\shop\model\SpecificationM;
use app\shop\model\SpecificationValueM;
use app\common\lib\DbHelper;
use think\Request;

class Product extends Base{

    function index(Request $request){

        $ProductM = new ProductM();
        $ProductItem = new ProductItemM();
        $where = array('p.shop_id'=>$this->shop_id);
        $keywords = $request->param('keywords');
        if ($keywords) {
            if (preg_match("/^\\(([0-9,\s]+)\\)$|(^[0-9,\s]+)$/", $keywords, $matches)) {
                $str = $matches[0];
                $arr = explode(',', $str);
                $ids = array();
                foreach ($arr as $v) {
                    $ids[] = intval($v);
                }
                $where['p.product_id']= ['in',implode(',',$ids)];
            } else {
                $where['p.product_name']= ['like',"%".$keywords."%"];
                $where['b.product_name']= ['like',"%".$keywords."%"];
                $where['_logic']= "or";
            }
        }

        $list = $ProductM->alias("p")->field("p.*,c.category_name")
            ->join("shop_category c","p.category_id=c.category_id", "left")
            ->where($where)
//            ->group("p.product_id")
            ->order("p.sale_start_time DESC,p.product_id DESC")
            ->paginate(15);

        foreach ($list as &$row) {
            $row['items'] = $ProductItem->where(['product_id' => $row['product_id']])->select();
        }

        $pagination = $list->render();

        $this->assign('list', $list);
        $this->assign('pagination', $pagination);
        return $this->fetch();
    }

    /**
     * @return mixed
     */
    function add1(){
        return $this->fetch();
    }

    /**
     * @param Request $request
     * @return mixed
     */
    function add2(Request $request){

        $category_id = $request->param('category_id',0);
        $category = (new CategoryM())->where(array('shop_id'=>$this->shop_id,'category_id'=>$category_id))->find();
        if(!$category){
            $this->error("分类不存在，请重新选择分类",url('shop/product/add1'));
        }
        $this->assign('category',$category);

        $AttributeM = new AttributeM();
        $AttributeValueM = new AttributeValueM();
        $attributes = $AttributeM->where(array('category_id'=>$category_id))->select();

        foreach ($attributes as &$row) {
            $attribute_id = $row['attribute_id'];
            $values = $AttributeValueM->where('attribute_id',$attribute_id)->select();
            $row['values'] = $values;
        }

        $this->assign('attributes',$attributes);

        $SpecificationM = new SpecificationM();
        $SpecificationValueM = new SpecificationValueM();
        $specRelaM = new CategorySpecificationRelationM();

        $specifications = $SpecificationM->alias('s')
            ->join($specRelaM->getTable()." r","r.specification_id = s.specification_id and r.category_id = ".$category_id)
            ->where(array('shop_id'=>$this->shop_id))->select();

        foreach ($specifications as &$row) {
            $id = $row['specification_id'];
            $values = $SpecificationValueM->where('specification_id',$id)->select();
            $row['children'] = $values;
        }

        $this->assign('specifications',$specifications);

        $brands = (new BrandM())->where(array("shop_id"=>$this->shop_id))->select();
        $this->assign('brands',$brands);
        return $this->fetch();
    }

    /**
     * @param Request $request
     */
    function doAdd2Post(Request $request){
        if($request->isPost()){
            $brand_id = $request->post('brand_id',0);
            $category_id = $request->post('category_id',0);
            $prop = $request->post('prop/a',[]);
            $attributes = $request->post('attributes/a',[]);
            $sku_list = $request->post('sku/a',[]);
            $specifications = $request->post('specifications/a',[]);
            /**
             * 分类检查
             * 商品必须归属于某一分类
             */
            $CategoryM = new CategoryM();
            $category = $CategoryM->where(array('shop_id'=>$this->shop_id,'category_id'=>$category_id))->find();
            if (!$category) {
                $this->error("请先选择相应的类目！！",url('shop/product/add1'));
                exit;
            }

            /**
             * 商品分类
             */
            $prop['category_id'] = $category_id;

            /**
             * 商品的归属
             * 商品只属于某家店
             */
            $prop['shop_id'] = $this->shop_id;

            /**
             * 添加人的信息
             */
            $prop['creator_id'] = $this->user_id;
            $prop['creator_name'] = $this->user_name;
            $prop['creator_token'] = $this->token;

            $ProductM = new ProductM();
//            $fields = ['product_name','shop_id','brand_id','category_id', 'detail','is_on_sale','sale_start_time','sale_price','total','barcode','product_code'];

            /**
             * 把商品的自然属性插入数据库
             */
            $new_product_id = $ProductM->insert($prop,false,true);
            if($new_product_id){
                /**
                 * 保存商品的基本属性
                 */
                $ProductAttributeM = new ProductAttributeM();
                $dataSet = array();
                foreach ($attributes as $attr => $attr_value) {
                    $map = array();
                    $map['attribute_name'] = $attr;
                    $map['attribute_value'] = $attr_value;
                    $map['product_id'] = $new_product_id;
                    $dataSet[] = $map;
                }
                $ProductAttributeM->insertAll($dataSet);

                /**
                 * 保存SKU单品
                 */
                $ProductItemM = new ProductItemM();
                foreach ($sku_list as $sku_sn => $sku) {
                    /**
                     * 已选中了的规格
                     */
                    $names = array();
                    foreach ($sku['specifications'] as $key=>$spec) {
                        /**
                         * 收集规格，组成SKU名称
                         */
                        $names[] = $spec['specification_value'];
                        if(isset($specifications[$key])){
                            $specifications[$key]['is_selected'] = DbHelper::YES;
                            $specifications[$key]['sku_sn'] = $sku_sn;
                            $specifications[$key]['product_id'] = $new_product_id;
                        }
                    }

                    $map = array();
                    $map['item_name'] = implode(' ',$names);
                    $map['product_id'] = $new_product_id;
                    $map['quantity'] = $sku['quantity'];
                    $map['sale_price'] = $sku['sale_price'];
                    $map['barcode'] = $sku['barcode'];
                    $map['product_code'] = $sku['product_code'];
                    $map['sku_sn'] = $sku_sn;
                    $map['create_time'] = date('Y-m-d H:i:s');
                    $dataSet[] = $map;
                    $ProductItemM->insert($map);

                }

                /**
                 * 保存规格SKU
                 */
                $ProductSpecificationM = new ProductSpecificationM();
                $specifications_post = array();
                foreach ($specifications as $key=>$spec) {
                    $spec['is_selected'] = isset($spec['is_selected'])?$spec['is_selected']:DbHelper::NO;
                    $spec['sku_sn'] = isset($spec['sku_sn'])?$spec['sku_sn']:'';
                    $spec['product_id'] = $new_product_id;
                    $specifications_post[] = $spec;
                }
                $ProductSpecificationM->insertAll($specifications_post);

                $this->success('添加成功',"",$new_product_id);
            }else{
                $this->error("添加失败");
            }
        }else{
            $this->error("非法操作");
        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    function edit(Request $request){
        return $this->fetch();
    }

    /**
     * @param Request $request
     */
    function toggleOnSale(Request $request){
        if($request->isPost()){
            $ProductM = new ProductM();
            $product_id = $request->post('product_id',0);
            $where = array('product_id' => $product_id,'shop_id'=>$this->shop_id);
            $row = $ProductM->where($where)->find();
            if($row){
                $new_status = $row['is_on_sale']==DbHelper::YES?DbHelper::NO:DbHelper::YES;
                $ProductM->where($where)->update(array('is_on_sale'=>$new_status));
                $this->success('更新成功！','',array('is_on_sale'=>$new_status));
            }else{
                $this->error("非法操作！");
            }
        }else{
            $this->error("非法操作",url('shop/product/index'));
        }
    }

    function doItemUpdate(Request $request){
        if($request->isPost()){
            $product_id = $request->post('product_id',0);
            $ProductM = new ProductM();
            $ProductItemM = new ProductItemM();

            /**
             * 确保修改的信息是合法商家的
             */
            $where = array("product_id"=>$product_id,"shop_id"=>$this->shop_id);
            $product = $ProductM->where($where)->find();
            if($product){

                $items = $request->post('items/a',[]);

                foreach ($items as $id => $post) {
                    $ProductItemM->where(array('item_id'=>$id,'product_id'=>$product_id))->update($post);
                }

                $this->success("更新成功");
            }else{
                $this->error("非法操作",url('shop/product/index'));
            }
        }else{
            $this->error("非法操作",url('shop/product/index'));
        }
    }

    function getJsonGoodsData(Request $request){

        $ProductM = new ProductM();
        $ProductItemM = new ProductItemM();

        $condition = $request->param('condition/a',array());

        $st = $ProductItemM->alias('pi')
            ->join($ProductM->getTable()." p","p.product_id=pi.product_id and p.shop_id = ".$this->shop_id);

        foreach($condition as $cond){
            $cond = json_decode($cond);
            if($cond && !empty($cond)){
                $cond = (array)$cond[0];
                $field = "p.".$cond['field'];
                $st->where($field,$cond['op'],"%".$cond['value']."%");
            }
        }
        $list =  $st->paginate($request->param('pagesize',20));
        return json(array('Rows'=>$list->getCollection(),'Total'=>$list->total()));
    }
}