<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/13
 * Time: 10:48
 */

namespace app\user\model;


use think\Model;

class UserM extends Model
{

    protected $pk = 'user_id';
    protected $table = 'user';

    /**
     * @param $token
     * @return array|false|\PDOStatement|string|Model
     */
    static function isLogged($token)
    {
        $where = array('token' => $token, 'expire_time' => array('exp', ">" . date("'Y-m-d H:i:s'")));
        return (new self)->alias('u')->join('user_token ut', 'u.user_id=ut.user_id')->where($where)->find();
    }
}