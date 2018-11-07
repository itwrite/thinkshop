<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/12
 * Time: 18:37
 */

namespace app\common\model;


use think\Model;

class ActionM extends Model{
    protected $pk = 'action_id';
    protected $table = 'sys_action';

    /**
     * @param int $privilege_id
     * @return int|string
     */
    function isHasChildren($privilege_id=0){
        $where =array('parent_id'=>$privilege_id);
        return $this->where($where)->count($this->getPk());
    }

    /**
     * @param int $privilege_id
     * @return false|\PDOStatement|string|\think\Collection
     */
    function getChildren($privilege_id=0){
        $where =array('parent_id'=>$privilege_id);
        return $this->where($where)->select();
    }

    /**
     * @param int $parent_id
     * @return false|\PDOStatement|string|\think\Collection
     */
    function getMenus($parent_id=0){
        $where =array('parent_id'=>$parent_id,'is_menu'=>'Y');
        return $this->where($where)->select();
    }
}