<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/3/29
 * Time: 11:48
 */

namespace app\shop\controller;

use app\shop\common\Base;
use app\user\model\UserM;
use think\Controller;
use think\Request;

class Index extends Base{

    function index(){
        $this->assign($this->getUserInfo());
        return $this->fetch();
    }

    /**
     * @param Request $request
     */
    function doAuthorizeToUser(Request $request){
        $shop_id = $request->param('shop_id',0);

        /**
         * 第一步：检查用户是否已登录
         */
        if(UserM::isLogged($this->token)){
            /**
             * 第二步：
             * 确定该用户是否跟店铺有关系
             * 店主或店员
             */
            $res = db('user_token')->alias('ut')->join('shop s','ut.user_id=s.shop_owner_id')->where(array('s.shop_id'=>$shop_id,'ut.token'=>$this->token))->find();
            if(!$res){
                $res = db('user_token')->alias('ut')->join('shop_employee se','ut.user_id = se.user_id')->where(array('se.shop_id'=>$shop_id,'ut.token'=>$this->token))->find();
            }

            /**
             * 第三步：
             * 如果关系合法，执行授权
             * 否则提示授权失败，执行跳转
             */
            if($res){
                db('user_token')->where(array('token'=>$this->token))->update(array('authorized_shop_id'=>$shop_id));
                $this->redirect('shop/index/index');
            }else{
                $this->error('您没有权限访问');
            }
        }else{
            $this->error('请先登录','user/login/index');
            exit;
        }
    }

    /**
     * @return mixed
     */
    function welcome(){
//        echo "DDD";exit;
        return $this->fetch();
    }
}