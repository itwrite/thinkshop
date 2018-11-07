<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/7/13
 * Time: 11:41
 */

namespace app\shop\controller;


use app\shop\common\Base;
use app\shop\model\EmployeeM;
use think\Request;

class Employee extends Base{

    function index(Request $request){

        $list = [];
        if($this->is_owner){
            $EmployeeM = new EmployeeM();
            $list = $EmployeeM->alias('e')->where(array('shop_id'=>$this->shop_id))->select();
        }
        $this->assign('list',$list);
        return $this->fetch();
    }
}