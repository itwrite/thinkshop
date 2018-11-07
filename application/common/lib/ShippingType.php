<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2016/11/21
 * Time: 18:41
 */

namespace app\common\lib;

class ShippingType {
    const Express='express';
    const EMS='ems';
    const Surface='surface';

    public static function toArray(){
        return array(
            self::EMS=>'EMS',
            self::Express=>'快递',
            self::Surface=>'平邮'
        );
    }

}