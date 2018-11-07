<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/13
 * Time: 14:10
 */

namespace app\shop\model;


use think\Model;

class VendorM extends Model{
    protected $pk = 'vendor_id';
    protected $table = 'shop_vendor';
}