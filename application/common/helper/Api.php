<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2018/1/25
 * Time: 12:37
 */

namespace app\common\helper;


class Api {

    /**
     * @var array
     */
    static private $__data = array();

    /**
     * @param $key
     * @param null $default
     * @return mixed
     */
    static public function get($key = '', $default = null)
    {
        if (empty($key)) return self::all();

        return Arr::get(self::$__data, $key, $default);
    }

    /**
     * @param $key
     * @param string $value
     */
    static public function set($key, $value = '')
    {
        //the key is null, do nothing
        if (is_null($key)) return;

        //the value is null, remove it
        if (is_null($value)) Arr::forget(self::$__data, $key);

        //the key is an array, all set into the config by foreach
        else if (is_array($key)) foreach ($key as $k => $v) {
            Arr::set(self::$__data, $k, $v);
        }

        //else all set into config anyway
        else Arr::set(self::$__data, $key, $value);
    }

    /**
     * Extend is different from merge
     * Merge will overwrite the old value any way
     * Extend just set the same type of both values;
     * @param $key
     * @param $value
     */
    static public function extend($key, $value = '')
    {
        $val = self::get($key);
        if (is_array($val) && is_array($value)) {
            $new = Arr::extend($val, $value);
            self::set($key, $new);
        } elseif (gettype($val) == gettype($value)) {
            self::set($key, $value);
        }
    }

    /**
     * get all configure
     * @return array
     */
    static public function all()
    {
        return self::$__data;
    }
}