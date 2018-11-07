<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/12
 * Time: 18:22
 */

namespace app\shop\controller;


use app\shop\common\Base;
use think\Request;

class PoOrder extends Base{

    function index(Request $request){
        return $this->fetch();
    }

    function inbound(){

        return $this->fetch();
    }

    function outbound(){
        $userInfo = $this->getUserInfo();
        $this->assign($userInfo);

        return $this->fetch();
    }
}