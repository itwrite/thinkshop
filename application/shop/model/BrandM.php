<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/20
 * Time: 13:50
 */

namespace app\shop\model;


use think\Model;

class BrandM extends Model{
    protected $pk = 'brand_id';
    protected $table = 'shop_brand';
}