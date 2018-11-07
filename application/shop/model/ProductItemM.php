<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/11
 * Time: 12:05
 */

namespace app\shop\model;


use think\Model;

class ProductItemM extends Model{
    protected $table = 'product_item';
    protected $pk = 'item_id';
}