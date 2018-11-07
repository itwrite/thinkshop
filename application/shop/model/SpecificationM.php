<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/6/4
 * Time: 15:36
 */

namespace app\shop\model;


use think\Model;

class SpecificationM extends Model{
    protected $pk = 'specification_id';
    protected $table = 'shop_specification';

    function isHasValues($attribute_id){
        $attribute_id = intval($attribute_id);
        $valueM = new SpecificationValueM();
        $count = $valueM->where(array('specification_id'=>$attribute_id))->count();
        return $count>0;
    }
}