<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/13
 * Time: 11:57
 */

namespace app\user\model;


use think\Model;

class TokenM extends Model{
    protected $pk = 'token_id';
    protected $table='user_token';
    static function refresh($token,$from = 'api'){
        return (new self)->where(array('token'=>$token))->update(
            array(
                'expire_time'=>date('Y-m-d H:i:s',strtotime("+1 days")),
                'login_from'=>$from,
            )
        );
    }
}