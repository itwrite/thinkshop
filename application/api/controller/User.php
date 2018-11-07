<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/3/27
 * Time: 11:54
 */

namespace app\api\controller;

use app\api\common\UserBase;
use think\Request;

class User extends UserBase{

    /**
     *
     */
    function index(){
        $this->jsonSuccess('',$this->user);
    }

    /**
     * 用户登录
     *
     * @param Request $request
     * @throws \think\Exception
     */
    function login(Request $request){
        $login = $request->post('user_login','');
        $password = $request->post('password','');
        $login_ip = $request->ip();

        /**
         * 先检查用户表是否有该用户记录，检查密码是否正确
         */
        $user = db('user')->where(array('user_login'=>$login,'password'=>$password))->find();
        if($user){
            $new_expire_time = date('Y-m-d H:i:s',strtotime("+1 days"));
            $set_expired_time = date('Y-m-d H:i:s',strtotime("-1 days"));
            /**
             * create token
             */
            $login_info = array('user_id'=>$user['user_id'],'user_login'=>$user['user_login'],'datetime'=>date('Y-m-d H:i:s'));
            $_token = md5(json_encode($login_info));

            $login_time = date('Y-m-d H:i:s');
            $token_data = array(
                'user_id'=>$user['user_id'],
                'expire_time'=>$new_expire_time,
                'token'=>$_token,
                'login_ip'=>$login_ip,
                'login_from'=>'api',
                'last_login_time'=>array('exp','login_time'),
                'login_time'=>$login_time
            );
            /**
             * 检查token表里是否有未过期的记录
             */
            $token_where = array('user_id'=>$user['user_id'],'expire_time'=>array('exp',">".date("'Y-m-d H:i:s'")));
            $token = db('user_token')->where($token_where)->find();
            if($token){

                //如果存在登录记录，判断ip地址是否相同，如果不同,则登录前一条记录
                if($login_ip == $token['login_ip']){
                    $_token = $token['token'];
                    cookie('token',$_token);
                    db('user_token')->where($token_where)->update(array('expire_time'=>$new_expire_time,'login_count'=>array('exp',"login_count+1"),'last_login_time'=>array('exp',"login_time"),'login_time'=>date("Y-m-d H:i:s")));
                    $this->jsonSuccess("登录成功",array('user'=>array('token'=>$_token,'login'=>$login)));
                }else{
                    //登录前一条,再插入新的登录数据
                    db('user_token')->where($token_where)->update(array('expire_time'=>$set_expired_time));
                    $res = db('user_token')->insert($token_data);
                    if($res){
                        cookie('token',$_token);
                        $this->jsonSuccess("登录成功",array('user'=>array('token'=>$_token,'login'=>$login)));
                    }else{
                        $this->jsonError("登录失败！");
                    }
                }

            }else{
                $res = db('user_token')->insert($token_data);
                if($res){
                    cookie('token',$_token);
                    $this->jsonSuccess("登录成功",array('user'=>array('token'=>$_token,'login'=>$login)));
                }else{
                    $this->jsonError("登录失败！");
                }
            }
        }else{
            $this->jsonError("账号错误或密码不正确！");
        }
    }

    /**
     * ================================================================================================================
     * ================================================================================================================
     * ================================================================================================================
     * ================================================================================================================
     * ================================================================================================================
     */

}