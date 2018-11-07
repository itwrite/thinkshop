<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/11
 * Time: 10:55
 */

namespace app\shop\model;


use think\Model;

class ProductM extends Model{
    protected $table = 'product';

    protected $pk = 'product_id';
}