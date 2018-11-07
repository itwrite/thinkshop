<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/12
 * Time: 16:50
 */

namespace app\shop\common;

use app\shop\model\ShopM;
use app\user\model\UserM;
use think\Controller;
use think\exception\HttpResponseException;
use think\Request;

class Base extends Controller{

    /**
     * shop id
     * @var mixed|string
     */
    protected $shop_id = 0;

    protected $user_id = 0;
    protected $user_name = '';

    /**
     * @var array|false|null|\PDOStatement|string|\think\Model
     */
    protected $user = null;

    /**
     * @var array|false|null|\PDOStatement|string|\think\Model
     */
    protected $shop = null;

    protected $is_owner = false;

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
        if(!in_array($request->action(),array('doauthorizetouser'))){
            /**
             * 用户如果没有登录
             * 重定向到用户登录界面
             */
            $user = UserM::isLogged($this->token);
            $shop = ShopM::isUserAccessed($this->token,$request->param('shop_id'));
            if(!$user){
                $this->redirect(url('user/index/login'));
                exit;
            }
            elseif(!$shop){
                /**
                 * 如果没有授权
                 * 重定向到用户主页
                 */
                $this->redirect(url('user/index/index'));
                exit;
            }

            $this->user = $user;
            $this->shop = $shop;

            /**
             * 方便调用
             */
            $userInfo = $this->getUserInfo();
            $this->user_id = $userInfo['user_id'];
            $this->user_name = $userInfo['user_name'];
            $this->shop_id = $userInfo['authorized_shop_id'];

            $shopInfo = $this->shop->getData();
            $this->is_owner = $shopInfo['shop_owner_id'] ==$this->user_id;
        }
    }

    /**
     * @return array|false|\PDOStatement|string|\think\Model
     */
    function getUserInfo(){
        return $this->user->getData();
    }

    /**
     * @param int $status
     * @param string $msg
     * @param array $data
     * @param int $code
     * @param array $header
     * @param array $options
     */
    protected function json($status=1,$msg='',$data=array(),$code = 200, $header = [], $options = []){
        throw new HttpResponseException(json(array('code' => $status, 'msg' => $msg, 'data' => $data),$code, $header, $options));
    }

    /**
     * @param $msg
     * @param null $data
     * @return \think\response\Json
     */
    protected function jsonError($msg,$data=null){
        $this->json(0,$msg,$data);
    }

    /**
     * @param $msg
     * @param null $data
     * @return \think\response\Json
     */
    protected function jsonSuccess($msg,$data=null){
        $this->json(1,$msg,$data);
    }
}