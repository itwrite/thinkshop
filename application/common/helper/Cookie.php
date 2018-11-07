<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2017/12/25
 * Time: 12:32
 */

namespace app\common\helper;
/**
 * relative Arr,Config
 * Class Cookie
 * @package Jasmine\Common
 */
class Cookie
{

    /**
     * @param $key
     * @param null $default
     * @return mixed
     */
    static public function get($key, $default = null)
    {
        return Arr::get($_COOKIE, $key, $default);
    }

    /**
     * @param $key
     * @param $value
     * @param int $life
     * @param null $path
     * @param null $domain
     * @param bool $httpOnly
     * @return bool
     */
    static public function set($key, $value, $life = 0, $path = null, $domain = null, $httpOnly = true)
    {
        $life = $life ? time() + $life : 0;
        $secure = Server::get('SERVER_PORT') == '443' ? 1 : 0;
        return setcookie($key, $value, $life, $path, $domain, $secure,$httpOnly);
    }

    /**
     * @param $key
     * @param null $path
     * @param $domain
     */
    static public function forget($key, $path = null, $domain = null)
    {
        if (is_array($key)) {
            foreach (array_values($key) as $k) {
                self::set($k, null, -360000, $path, $domain);
            }
        } else if (is_string($key)) {
            self::set($key, null, -360000, $path, $domain);
        }
    }
}