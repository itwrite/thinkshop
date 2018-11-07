<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/3/27
 * Time: 10:55
 */

namespace app\api\common;

use think\Controller;
use think\exception\HttpResponseException;
use think\Request;

class ApiBase extends Controller{

    /**
     * @param Request $request
     */
    public function __construct(Request $request = null){
        parent::__construct($request);
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
        throw new HttpResponseException(json(array('status' => $status, 'msg' => $msg, 'data' => $data),$code, $header, $options));
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