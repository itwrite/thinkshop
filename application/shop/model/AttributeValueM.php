<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/29
 * Time: 11:19
 */

namespace app\shop\model;

use think\Model;

class AttributeValueM extends Model{
    protected $pk = 'attribute_value_id';
    protected $table = 'shop_attribute_value';
}