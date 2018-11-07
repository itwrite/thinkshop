<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/8
 * Time: 12:03
 */

namespace app\user\common;


use app\user\model\UserM;
use think\Controller;
use think\Request;

class Base extends Controller{

    function __construct(Request $request){
        parent::__construct($request);

        /**
         *
         */
        $escape_actions = array('Index:doLogin','Index:login');
        if(!in_array(implode(':',array($request->controller(),$request->action())),$escape_actions)){
            if(!$user = $this->isLogged()){
                $this->redirect(url('user/index/login'));
                exit;
            }
            $this->user = $user;
            $userInfo = $user->getData();
            $this->user_id = $userInfo['user_id'];
            $this->user_name = $userInfo['user_name'];
        }
    }

    /**
     * @return array|false|\PDOStatement|string|\think\Model
     */
    public function isLogged(){
        $_token = Request::instance()->cookie('token',Request::instance()->param('token',''));
        return UserM::isLogged($_token);
    }

}