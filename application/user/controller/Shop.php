<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/4
 * Time: 7:15
 */

namespace app\user\controller;


use app\user\common\Base;
use think\Request;

class Shop extends Base{

    /**
     * 用户所拥有的店铺 和 被授权登录的店铺
     * @param Request $request
     * @return mixed
     */
    function index(Request $request){

        return $this->fetch();
    }
}