<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/4/8
 * Time: 12:02
 */

namespace app\user\controller;
use app\shop\model\EmployeeM;
use app\shop\model\ShopM;
use app\user\common\Base;
use think\Request;


/**
 * 用户中心
 * Class Index
 * @package app\user\controller
 */
class Index extends Base{

    /**
     * 用户中心主页
     * @return string
     */
    function index(){

        $ShopM = new ShopM();
        $EmployeeM = new EmployeeM();

        /**
         * 获取所拥有的店铺
         */
        $shop_list = $ShopM->where(array('shop_owner_id'=>$this->user_id))->select();
        $this->assign('shop_list',$shop_list);

        $shop_list2 = $ShopM->alias('s')->join($EmployeeM->getTable()." se","s.shop_id = se.shop_id")->where(array('se.user_id'=>$this->user_id))->select();
        $this->assign('shop_list2',$shop_list2);

        return $this->fetch();
    }

    /**
     * @param Request $request
     * @return bool|mixed
     */
    function login(Request $request){
        if($this->isLogged()){
            $this->redirect('user/index/index');
            return false;
        }
        return $this->fetch();
    }
}