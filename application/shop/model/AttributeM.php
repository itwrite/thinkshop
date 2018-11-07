<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/29
 * Time: 10:40
 */

namespace app\shop\model;


use think\Model;

class AttributeM extends Model{

    protected $table = 'shop_attribute';
    protected $pk = 'attribute_id';

    function isHasValues($attribute_id){
        $attribute_id = intval($attribute_id);
        $valueM = new AttributeValueM();
        $count = $valueM->where(array('attribute_id'=>$attribute_id))->count();
        return $count>0;
    }
}