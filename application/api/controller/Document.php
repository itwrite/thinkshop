<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/3/27
 * Time: 11:56
 */

namespace app\api\controller;


use app\common\helper\Api;
use think\Controller;
use think\Request;

class Document extends Controller{

    function index(Request $request)
    {
        $token = $request->cookie('token',$request->param('token',''));;
        //add to api document
        $key = '用户相关';


        $this->addApi($key, 'api/user/login', "用户登录", 'post', array(
            array(
                'name' => 'user_login',
                'description' => '登录名',
                'type' => 'text',
                'required' => true,
                'value' => 'shop1'
            ),
            array(
                'name' => 'password',
                'description' => '密码',
                'type' => 'password',
                'required' => true,
                'value' => 123456
            )
        ));

        $key = '店铺相关';
        $this->addApi($key, 'api/shop/doAuthorizeToUser','店铺授权登录','get',array(
            array(
                'name' => 'shop_id',
                'description' => '店铺ID',
                'type' => 'number',
                'required' => true,
                'value' => 1
            ),
            array(
                'name' => 'token',
                'description' => '登录令牌',
                'type' => 'text',
                'required' => true,
                'value' => $token
            ),

        ));
        $this->addApi($key, 'api/ShopMenu/index','店铺菜单','post',array(
            array(
                'name' => 'token',
                'description' => '登录令牌',
                'type' => 'text',
                'required' => true,
                'value' => $token
            ),
        ));
        $this->addApi($key,'api/ShopCategory/add','新增分类','post',array(
            array(
                'name' => 'category_name',
                'description' => '分类名称',
                'type' => 'text',
                'required' => true,
                'value' => ''
            ),
            array(
                'name' => 'parent_id',
                'description' => '父分类ID',
                'type' => 'number',
                'required' => true,
                'value' => 0
            )
        ));
        $this->addApi($key,'api/ShopCategory/index','分类列表','get',array(
            array(
                'name' => 'parent_id',
                'description' => '父分类ID',
                'type' => 'number',
                'required' => false,
                'value' => 0
            )
        ));
        $this->addApi($key,'api/ShopCategory/getChildren','分类列表','get',array(
            array(
                'name' => 'parent_id',
                'description' => '父分类ID',
                'type' => 'number',
                'required' => true,
                'value' => 0
            )
        ));
        /**
         *  $data['hospital_id'] = 1;
        $data['prepare_day'] = "2017-11-28";
        $data['prepare_time'] = "09:30:00-10:30:00";
        $data['order_id'] = 19;
        $data['user_id'] = 12;
        $data['open_id'] = 22;
         */
        $this->addApi($key, '/api/order/addOrder','添加预约','post',array(
            array(
                'name' => 'open_id',
                'description' => '微信的openid',
                'type' => 'text',
                'required' => true,
                'value' => $token
            ),
            array(
                'name' => 'user_id',
                'description' => '用户信息的ID，即需要先完成信息',
                'type' => 'number',
                'required' => true,
                'value' => ''
            ),
            array(
                'name' => 'hospital_id',
                'description' => '所选的医院的ID',
                'type' => 'number',
                'required' => true,
                'value' => ''
            ),
            array(
                'name' => 'prepare_day',
                'description' => '预约的日期(例:2017-11-28)',
                'type' => 'text',
                'required' => true,
                'value' => ''
            ),
            array(
                'name' => 'prepare_time',
                'description' => '预约的时间段(例:09:30:00-10:30:00)',
                'type' => 'text',
                'required' => true,
                'value' => ''
            ),
        ));


        // print_r(Api::get('documents'));exit;
        $this->assign('documents', Api::get('documents'));
        return $this->fetch();
    }

    /**
     * =========================================================================================================
     */

    /**
     * @param $group_key
     * @param $route
     * @param string $name
     * @param string $method
     * @param array $parameters
     * @param string $summary
     * @return $this
     */
    private function addApi($group_key, $route, $name = '', $method = 'get', Array $parameters = array(), $summary = '')
    {

        if (!empty($group_key)) {
            $key = 'documents.'.$group_key;
            $group = Api::get($key,null);

            if (!$group) {
                Api::set($key,array(
                    'name'=>$group_key,
                    'summary'=>'',
                    'paths'=>array()
                ));
            }
            $params = array();
            foreach($parameters as $param){
                $params[] = (new Parameter($param))->toArray();
            }
            Api::set($key.".paths.".$route,array(
                'name'=>$name,
                'method'=>$method,
                'parameters'=>$params,
                'summary'=>$summary
            ));
        }
        return $this;
    }
}

class Parameter
{
    public $name = '';
    public $description = "";
    public $type = 'string';
    public $required = false;
    public $value = '';

    function __construct($values)
    {
        foreach ($values as $pro => $val) {
            if (property_exists($this, $pro)) {
                $this->$pro = $val;
            }
        }
    }

    function toArray()
    {
        return (array)$this;
    }
}