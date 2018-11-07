<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2016/12/27
 * Time: 13:47
 */

namespace app\common\lib;


class CropUpload {

    protected $upload_dir='';

    protected $saveName = '';

    protected $saveExt = '';

    protected $allowedExtensionsArr=array();

    protected $allowedMaxSize = 1048576;//1M

    protected $allowedMimesArr = array();

    protected $error = "";

    protected $savePath = "";

    protected $encodeSaveName = true;

    public function __construct($config=array()){
        $this->mergeConfig($config);
    }

    public function setEncodeSaveName($bool){
        $this->encodeSaveName = $bool==true?true:false;
    }

    public function getSavePath(){
        return $this->savePath;
    }

    /**
     * @param $key
     * @param $val
     */
    public function setConfig($key,$val){
        if(property_exists($this,$key)){
            $this->$key = $val;
        }
    }

    /**
     * @param array $config
     */
    public function mergeConfig($config=array()){
        if(is_array($config) && $config){
            foreach($config as $key=>$val){
                $this->setConfig($key,$val);
            }
        }
    }

    /**
     * @param $source_file
     * @param $target_file
     * @param $scaledW
     * @param $scaledH
     * @param $x1
     * @param $y1
     * @param $cropW
     * @param $cropH
     * @return bool
     */
    public function cropAndSave($source_file,$target_file,$scaledW,$scaledH,$x1,$y1,$cropW,$cropH){
        //获取源图片
        $source_image = imagecreatefromstring(file_get_contents($source_file));
        list($originalW, $originalH) = getimagesize($source_file);

        //创建一个比例缩放画布
        $scaledImage = imagecreatetruecolor($scaledW, $scaledH);
        //将原图按比例缩放到画布上
        imagecopyresampled($scaledImage, $source_image, 0, 0, 0, 0, $scaledW, $scaledH, $originalW, $originalH);

        //创建一个目标大小的画布
        $destination_image = imagecreatetruecolor($cropW, $cropH);
        //画布填充白色
        $color = imagecolorallocate($destination_image, 255, 255, 255);
        imagefill($destination_image, 0, 0, $color);

        //将缩放后的图按坐标和尺寸切割，并填充到目标文件
        imagecopymerge($destination_image, $scaledImage, 0, 0, $x1, $y1, $scaledW, $scaledH, 100);

        //保存目标图片
        if($this->saveExt=='png'){
            $res = imagepng($destination_image, $target_file, 75);
        }else{
            $res = imagejpeg($destination_image, $target_file, 75);
        }

        //销毁句柄，释放内存
        imagedestroy($source_image);
        imagedestroy($scaledImage);
        imagedestroy($destination_image);

        return $res;
    }

    /**
     * @param $name
     * @param $scaledW
     * @param $scaledH
     * @param $x1
     * @param $y1
     * @param $cropW
     * @param $cropH
     * @return array|bool
     */
    public function upload($name,$scaledW,$scaledH,$x1,$y1,$cropW,$cropH){

        $files = $this->dealFiles($_FILES);

        if(isset($files[$name])){

            $file = $files[$name];
            $file['name']  = strip_tags($file['name']);
            if(!isset($file['key']))   $file['key']    =   $name;
            /* 通过扩展获取文件类型，可解决FLASH上传$FILES数组返回文件类型错误的问题 */
            if(function_exists('finfo_open')){
                $f_info   =  finfo_open ( FILEINFO_MIME_TYPE );
                $file['type']   =   finfo_file ( $f_info ,  $file['tmp_name'] );
            }

            /* 获取上传文件后缀，允许上传无后缀文件 */
            $file['ext']    =   pathinfo($file['name'], PATHINFO_EXTENSION);

            if(self::checkFile($file)){

                $file['md5']  = md5_file($file['tmp_name']).time();
                $file['sha1'] = sha1_file($file['tmp_name']);

                $saveName = $this->encodeSaveName?$file['md5'].".".(empty($this->saveExt) ? $file['ext'] : $this->saveExt): $this->getSaveName($file);


                /* 对图像文件进行严格检测 */
                $ext = strtolower($file['ext']);
                if(in_array($ext, array('gif','jpg','jpeg','bmp','png','swf'))) {
                    $img_info = getimagesize($file['tmp_name']);
                    if(empty($img_info) || ($ext == 'gif' && empty($img_info['bits']))){
                        $this->error = '非法图像文件！';
                        return false;
                    }
                }

                $target_file = $this->upload_dir.$saveName;

                if($this->checkSavePath($this->upload_dir)){
                    $res = $this->cropAndSave($file['tmp_name'],$target_file,$scaledW,$scaledH,$x1,$y1,$cropW,$cropH);
                    if($res){
                        return array(
                            'savePath'=>str_replace($_SERVER['DOCUMENT_ROOT'],'',$target_file),
                            'saveName'=>$saveName
                        );
                    }
                }
            }
            if(isset($f_info)){
                finfo_close($f_info);
            }
        }
        return false;
    }

    /**
     * 根据上传文件命名规则取得保存文件名
     * @param $file
     * @return bool|string
     */
    private function getSaveName($file) {
        $rule = $this->saveName;
        if (empty($rule)) { //保持文件名不变
            /* 解决pathinfo中文文件名BUG */
            $saveName = substr(pathinfo("_{$file['name']}", PATHINFO_FILENAME), 1);
        } else {
            $saveName = $this->getName($rule, $file['name']);
            if(empty($saveName)){
                $this->error = '文件命名规则错误！';
                return false;
            }
        }

        /* 文件保存后缀，支持强制更改文件后缀 */
        $ext = empty($this->saveExt) ? $file['ext'] : $this->saveExt;
        return $saveName . '.' . $ext;
    }

    /**
     * 检测上传目录
     * @param  string $dir 上传目录
     * @return boolean          检测结果，true-通过，false-失败
     */
    public function checkSavePath($dir){
        /* 检测并创建目录 */
        if (!$this->mkdir($dir)) {
            return false;
        } else {
            /* 检测目录是否可写 */
            if (!is_writable($dir)) {
                $savePath = str_replace($_SERVER['DOCUMENT_ROOT'],'',$dir);
                $this->error = '上传目录 ' . $savePath . ' 不可写！';
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * 创建目录
     * @param  string $dir 要创建的穆里
     * @return boolean          创建状态，true-成功，false-失败
     */
    public function mkdir($dir){

        if(is_dir($dir)){
            return true;
        }

        if(mkdir($dir, 0777, true)){
            return true;
        } else {
            $savePath = str_replace($_SERVER['DOCUMENT_ROOT'],'',$dir);
            $this->error = "目录 {$savePath} 创建失败！";
            return false;
        }
    }

    /**
     * 获取最后一次上传错误信息
     * @return string 错误信息
     */
    public function getError(){
        return $this->error;
    }


    private function checkFile($file) {
        /* 文件上传失败，捕获错误代码 */
        if ($file['error']) {
            $this->error($file['error']);
            return false;
        }

        /* 无效上传 */
        if (empty($file['name'])){
            $this->error = '未知上传错误！';
            return false;
        }

        /* 检查是否合法上传 */
        if (!is_uploaded_file($file['tmp_name'])) {
            $this->error = '非法上传文件！';
            return false;
        }

        /* 检查文件大小 */
        if (!$this->checkSize($file['size'])) {
            $this->error = '上传文件大小不符！';
            return false;
        }

        /* 检查文件Mime类型 */
        if (!$this->checkMime($file['type'])) {
            $this->error = '上传文件MIME类型不允许！';
            return false;
        }

        /* 检查文件后缀 */
        if (!$this->checkExt($file['ext'])) {
            $this->error = '上传文件后缀不允许';
            return false;
        }

        /* 通过检测 */
        return true;
    }

    /**
     * 检查文件大小是否合法
     * @param $size
     * @return bool
     */
    private function checkSize($size) {
        return !($size > $this->allowedMaxSize) || (0 == $this->allowedMaxSize);
    }

    /**
     * 检查上传的文件MIME类型是否合法
     * @param $mime
     * @return bool
     */
    private function checkMime($mime) {
        return empty($this->allowedMimesArr) ? true : in_array(strtolower($mime), $this->allowedMimesArr);
    }

    /**
     * 检查上传的文件后缀是否合法
     * @param $ext
     * @return bool
     */
    private function checkExt($ext) {
        return empty($this->allowedExtensionsArr) ? true : in_array(strtolower($ext), $this->allowedExtensionsArr);
    }

    /**
     * 获取错误代码信息
     * @param string $errorNo  错误号
     */
    private function error($errorNo) {
        switch ($errorNo) {
            case 1:
                $this->error = '上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值！';
                break;
            case 2:
                $this->error = '上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值！';
                break;
            case 3:
                $this->error = '文件只有部分被上传！';
                break;
            case 4:
                $this->error = '没有文件被上传！';
                break;
            case 6:
                $this->error = '找不到临时文件夹！';
                break;
            case 7:
                $this->error = '文件写入失败！';
                break;
            default:
                $this->error = '未知上传错误！';
        }
    }

    /**
     * 转换上传文件数组变量为正确的方式
     * @access private
     * @param array $files  上传的文件变量
     * @return array
     */
    public function dealFiles($files=array()) {
        $files = empty($files)?$_FILES:$files;
        $fileArray  = array();
        $n          = 0;
        foreach ($files as $key=>$file){
            if(is_array($file['name'])) {
                $keys       =   array_keys($file);
                $count      =   count($file['name']);
                for ($i=0; $i<$count; $i++) {
                    $fileArray[$n]['key'] = $key;
                    foreach ($keys as $_key){
                        $fileArray[$n][$_key] = $file[$_key][$i];
                    }
                    $n++;
                }
            }else{
                $fileArray[$key] = $file;
            }
        }
        return $fileArray;
    }

    /**
     * 根据指定的规则获取文件或目录名称
     * @param  array  $rule     规则
     * @param  string $filename 原文件名
     * @return string           文件或目录名称
     */
    private function getName($rule, $filename){
        $name = '';
        if(is_array($rule)){ //数组规则
            $func     = $rule[0];
            $param    = (array)$rule[1];
            foreach ($param as &$value) {
                $value = str_replace('__FILE__', $filename, $value);
            }
            $name = call_user_func_array($func, $param);
        } elseif (is_string($rule)){ //字符串规则
            if(function_exists($rule)){
                $name = call_user_func($rule);
            } else {
                $name = $rule;
            }
        }
        return $name;
    }
}