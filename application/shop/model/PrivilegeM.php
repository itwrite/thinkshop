<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/25
 * Time: 22:16
 */

namespace app\shop\model;


use app\common\model\ActionM;
use think\Model;

class PrivilegeM extends Model{

    protected $pk = 'privilege_id';
    protected $table = 'shop_privilege';

    /**
     * @param $shop_id
     * @return false|\PDOStatement|string|\think\Collection
     */
    function getPrivileges($shop_id){
        $ActionM = new ActionM();
        $where =array('a.parent_id'=>0,'a.is_menu'=>'Y','p.shop_id'=>intval($shop_id));
        return $this->alias('p')->join($ActionM->getTable()." a","a.action_id = p.action_id")->where($where)->select();
    }
}