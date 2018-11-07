<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/5/14
 * Time: 15:37
 */

namespace app\shop\controller;


use app\shop\common\Base;

class Picture extends Base{

    function index(){

        $this->assign('picture_folder_list',[]);
        return $this->fetch();
    }
}