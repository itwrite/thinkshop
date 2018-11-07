<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/28
 * Time: 8:53
 */

namespace app\api\controller;


use app\api\common\ShopBase;
use think\Request;
use app\user\model\UserM;
class Shop extends ShopBase{

    function __construct(Request $request){
        parent::__construct($request);
    }

    function index(){

    }

    /**
     * @param Request $request
     */
    function doAuthorizeToUser(Request $request){
        $shop_id = $request->param('shop_id',0);
        $token = $request->param('token',0);
        /**
         * 第一步：检查用户是否已登录
         */
        if(UserM::isLogged($token)){
            /**
             * 第二步：
             * 确定该用户是否跟店铺有关系
             * 店主或店员
             */
            $res = db('user_token')->alias('ut')->join('shop s','ut.user_id=s.shop_owner_id')->where(array('s.shop_id'=>$shop_id,'ut.token'=>$token))->find();
            if(!$res){
                $res = db('user_token')->alias('ut')->join('shop_employee se','ut.user_id = se.user_id')->where(array('se.shop_id'=>$shop_id,'ut.token'=>$token))->find();
            }

            /**
             * 第三步：
             * 如果关系合法，执行授权
             * 否则提示授权失败，执行跳转
             */
            if($res){
                db('user_token')->where(array('token'=>$token))->update(array('authorized_shop_id'=>$shop_id));
                $this->jsonSuccess('操作成功');
            }else{
                $this->jsonError('您没有权限访问');
            }
        }else{
            $this->jsonError('请先登录');
            exit;
        }
    }
}