<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/25
 * Time: 22:20
 */

namespace app\shop\controller;

use app\common\model\ActionM;
use app\shop\common\Base;
use think\Request;
use app\shop\model\PrivilegeM;

class Privilege extends Base
{

    function __construct(Request $request)
    {
        parent::__construct($request);
        $this->Privilege = new PrivilegeM();
    }

    /**
     * @param Request $request
     * @return \think\response\Json
     */
    function getJsonMenuTreeData(Request $request)
    {
        $parent_id = $request->param('parent_id', 0,'intval');

        $ActionM = new ActionM();
        $where =array('a.is_menu'=>'Y','p.shop_id'=>intval($this->shop_id));
        $result = $this->Privilege->alias('p')
            ->join($ActionM->getTable()." a","a.action_id = p.action_id")
            ->order('a.sort','desc')
            ->where($where)->select();
        $result = $this->_getChildrenMenus($result,$parent_id);
        return json($result);
    }

    private function _hasChildren(Array $list,$id){

        $hasChildren = false;
        foreach ($list as $row) {
            if($row['parent_id'] == $id){
                //todo
                $hasChildren = true;
                break;
            }
        }

      return $hasChildren;
    }

    /**
     * @param array $list
     * @param int $parent_id
     * @return array
     */
    private function _getChildrenMenus(Array $list,$parent_id = 0){
        $result = array();
        foreach ($list as $row) {
            if($row['parent_id'] == $parent_id){
                $item = array();
                $item['id'] = $row['privilege_id'];
                $item['parent_id'] = $row['parent_id'];
                $item['text'] = $row['action_name'];
                $item['sort'] = $row['sort'];
                $item['isexpand'] = $row['is_expand'] == 'Y' ? true : false;
                $item['url'] = url(implode('/', array($row['module'], $row['controller'], $row['action'])));

                if($this->_hasChildren($list,$item['id'])){
                    $item['children'] = $this->_getChildrenMenus($list,$item['id']);
                }
                $result[] = $item;
            }
        }

        return $result;
    }

}