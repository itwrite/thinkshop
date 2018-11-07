<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/9
 * Time: 11:09
 */

namespace app\api\common;


use app\shop\model\ShopM;
use app\user\model\UserM;
use think\Request;

abstract class ShopBase extends ApiBase{

    /**
     * shop id
     * @var mixed|string
     */
    protected $shop_id = '';

    /**
     * Current user's information
     * @var array|false|\PDOStatement|string|\think\Model
     */
    protected $user = array();

    /**
     * Current user's login token
     * @var mixed|string
     */
    protected $token = '';

    function __construct(Request $request){
        parent::__construct($request);
        $this->token = $request->cookie('token',$request->param('token',''));

        /**
         * 管理店铺的必要条件：
         * 1、用户已登录；
         * 2、用户是店主或店员；
         * 3、店铺正常运营
         * 4、店员有权限（前期开发非必须验证）
         */
        if(!in_array($request->action(),array('doAuthorizeToUser'))){
            /**
             * 用户如果没有登录
             * 重定向到用户登录界面
             */
            if(!$user = UserM::isLogged($this->token)){
                $this->jsonError("请先登录");
                exit;
            }
            elseif(!ShopM::isUserAccessed($this->token,$request->param('shop_id'))){
                /**
                 * 如果没有授权
                 * 重定向到用户主页
                 */
                $this->jsonError("您没有权限");
                exit;
            }

            $this->user = $user;
            $userInfo = $this->getUserInfo();
            $this->shop_id = $userInfo['authorized_shop_id'];
        }
    }

    /**
     * @return array|false|\PDOStatement|string|\think\Model
     */
    function getUserInfo(){
        return $this->user->getData();
    }
}