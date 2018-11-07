<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/13
 * Time: 10:55
 */

namespace app\shop\model;


use app\user\model\TokenM;
use think\Model;

class ShopM extends Model
{
    protected $table = 'shop';

    protected $pk = 'shop_id';

    /**
     * * 分两种情况：
     * 1、店主
     * 2、店员
     * @param $token
     * @return array|false|\PDOStatement|string|Model
     */
    static function isUserAccessed($token)
    {
        $UserTokenM = new TokenM();
        $ShopM = new self();
        $row = $ShopM->alias('s')
            ->field("s.*,ut.*")
            ->join($UserTokenM->getTable().' ut','s.shop_id = ut.authorized_shop_id')
            ->find();
        if(!$row){
            $EmployeeM = new EmployeeM();
            $row = $ShopM->alias('s')
                ->field("s.*,ut.*")
                ->join($UserTokenM->getTable().' ut','s.shop_id = ut.authorized_shop_id')
                ->join($EmployeeM->getTable().' se', 'ut.user_id = se.user_id')
                ->find();
        }
        return $row;
    }
}