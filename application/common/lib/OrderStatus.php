<?php
/**
 * Created by PhpStorm.
 * User: zzpzero
 * Date: 2016/9/19
 * Time: 15:13
 */

namespace app\common\lib;


class OrderStatus {
    const booked='booked'; //已下单但未支付
    const paid='paid'; //已支付
    const canceled = 'canceled'; //已取消(买家，卖家，系统)
    const completed = 'completed';//已完成
}