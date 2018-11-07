<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/6/20
 * Time: 10:27
 */

namespace app\shop\model;


use think\Model;

class CategorySpecificationRelationM extends Model{
    protected $pk = 'rela_id';
    protected $table = 'shop_category_specification_rela';
}