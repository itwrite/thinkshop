<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/9
 * Time: 11:11
 */

namespace app\api\common;

use app\user\model\UserM;
use think\Request;

abstract class UserBase extends ApiBase{
    public $user = null;
    public function __construct(Request $request = null){
        parent::__construct($request);
        /**
         * 正常情况下，所有用户操作都需要用户已登录，除一些特殊操作外。如：登录
         */
        if(!in_array($request->action(),array('login'))){
            if($user = $this->isLogged()){
                $this->user = $user;
            }else{
                $this->jsonError("请登录");
            }
        }
    }

    /**
     * 检查用户是否已登录
     * @return array|false|\PDOStatement|string|\think\Model
     */
    public function isLogged(){
        $_token = Request::instance()->cookie('token',Request::instance()->param('token',''));
        return UserM::isLogged($_token);
    }
}