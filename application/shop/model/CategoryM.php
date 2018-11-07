<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/25
 * Time: 22:50
 */

namespace app\shop\model;


use think\Model;

class CategoryM extends Model{
    protected $pk = 'category_id';
    protected $table = 'shop_category';

    /**
     * @param int $category_id
     * @return int|string
     */
    function isHasChildren($category_id=0){
        $where =array('parent_id'=>$category_id);
        return $this->where($where)->count($this->getPk());
    }

    /**
     * @param int $category_id
     * @return false|\PDOStatement|string|\think\Collection
     */
    function getChildren($category_id=0){
        $where =array('parent_id'=>$category_id);
        return $this->where($where)->select();
    }
}