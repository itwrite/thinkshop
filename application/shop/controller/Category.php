<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/25
 * Time: 22:52
 */

namespace app\shop\controller;

use app\shop\common\Base;
use app\shop\model\CategoryM;
use app\shop\model\CategorySpecificationRelationM;
use app\shop\model\SpecificationM;
use think\Controller;
use think\Request;

class Category extends Base{


    /**
     * @var CategoryM|null
     */
    protected $Category = null;

    function __construct(Request $request){
        parent::__construct($request);

        $this->Category = new CategoryM();
    }

    /**
     * @return \think\response\Json
     */
    function index(){
        return $this->fetch();
    }

    /**
     * @return \think\response\Json
     */
    function getJsonGridTreeData(){
        return json(array('Rows'=>$this->_getTreeData(0)));
    }

    /**
     * @return \think\response\Json
     */
    function getJsonTreeData(){
        return json($this->_getTreeData(0));
    }

    /**
     * @param Request $request
     * @return \think\response\Json
     */
    function getChildren(Request $request){
        $parent_id = $request->param('parent_id',0);
        $list = $this->Category->where(array('parent_id'=>$parent_id,'shop_id'=>$this->shop_id))->select();
        return $this->jsonSuccess("查询成功",$list);
    }

    /**
     * @param Request $request
     */
    function doAdd(Request $request){
        $parent_id = $request->param('parent_id',0);
        $name = $request->param('category_name','','trim');
        if($request->isPost()){
            if(!empty($name)){
                $res = $this->Category->insert(array('create_time'=>date('Y-m-d H:i:s'),'category_name'=>$name,'parent_id'=>$parent_id,'shop_id'=>$this->shop_id));
                if($res){
                    $this->jsonSuccess("添加成功");
                }else{
                    $this->jsonError("添加失败");
                }
            }else{
                $this->jsonError("不能为空");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }

    /**
     * @param Request $request
     */
    function doEdit(Request $request){
        $category_id = $request->param('category_id',0);
        $category_name = $request->param('category_name','','trim');
        if($request->isPost()){
            if(!empty($category_name)){
                $res = $this->Category->where(array('category_id'=>$category_id))->update(array('category_name'=>$category_name));
                if($res){
                    $this->jsonSuccess("修改成功");
                }else{
                    $this->jsonError("修改失败");
                }
            }else{
                $this->jsonError("不能为空");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }

    /**
     * @param Request $request
     */
    function doDelete(Request $request){
        $category_id = $request->param('category_id',0);
        if($request->isPost()){

            if(!$this->Category->isHasChildren($category_id)){
                $res = $this->Category->where(array('category_id'=>$category_id))->delete();
                if($res){
                    $this->jsonSuccess("删除成功");
                }else{
                    $this->jsonError("删除失败");
                }
            }else{
                $this->jsonError("请先删除子类");
            }
        }else{
            $this->jsonError("非法操作");
        }
    }

    /**
     * @param Request $request
     */
    function getJsonRelativeSpecificationsData(Request $request){
        $category_id = $request->param('category_id',0);

        $relations = (new CategorySpecificationRelationM())->where(array('category_id'=>$category_id))->select();
        $ids = array();
        foreach ($relations as $row) {
            $ids[] = $row['specification_id'];
        }

        $SpecificationM = new SpecificationM();
        $specifications = $SpecificationM->where(array('shop_id'=>$this->shop_id))->select();

        $checkedIds = array();
        $result = array();
        foreach ($specifications as $row) {
            $arr = array();
            $arr['id'] = $row['specification_id'];
            $arr['text'] = $row['specification_name'];
            $arr['checked'] = 0;
            if(in_array($arr['id'],$ids)){
                $arr['checked'] = 1;
                $checkedIds[] = $arr['id'];
            }
            $result[] = $arr;
        }

        $this->jsonSuccess('查询成功',array('specifications'=>$result,'checkedIds'=>implode(';',$checkedIds)));
    }

    /**
     * @param Request $request
     */
    function doAjaxConnectToSpecification(Request $request){
        $category_id = $request->param('category_id',0);
        $category = $this->Category->where(array('category_id'=>$category_id,'shop_id'=>$this->shop_id))->find();
        if($category){
            $specification_ids = $request->param('specification_ids','');
            $CategorySpecificationRelationM = new CategorySpecificationRelationM();
            $CategorySpecificationRelationM->where(array('category_id'=>$category_id))->delete();

            $arr = explode(',',$specification_ids);
            foreach ($arr as $id) {
                $data = array();
                $data['category_id'] = $category_id;
                $data['specification_id'] = $id;
                $CategorySpecificationRelationM->insert($data);
            }
            $this->jsonSuccess('操作成功');
        }
        $this->jsonSuccess('操作成功');
    }
    /**
     * @param int $parent_id
     * @return array
     */
    private function _getTreeData($parent_id=0){

        $list = $this->Category
            ->where(array('parent_id'=>$parent_id,'shop_id'=>$this->shop_id))
            ->select();

        $result = array();
        foreach ($list as $row) {

            $item = array();
            $item['id'] = $row['category_id'];
            $item['name'] = $row['category_name'];

            $item['text'] = $item['name'];
            $item['parent_id'] = $row['parent_id'];


            $children = $this->_getTreeData($item['id']);
            if($children){
                $item['children'] = $children;
            }
            $result[] = $item;

        }
        return $result;
    }
}