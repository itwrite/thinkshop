<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/11
 * Time: 11:25
 */

namespace app\shop\model;


use think\Model;

class ProductAttributeM extends Model{
    protected $table = 'product_attribute';
    protected $pk = 'attribute_id';
}