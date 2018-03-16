package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * Created by LX on 2017/8/2.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ConsumeInfo extends BaseInfo {

    //code:订单号，createTime:消费时间，type:消费方式，storeCode:门店Code,storeName：门店名称
    protected String type,storeCode,storeName,userId;
    //coupons:是否用券
    protected boolean coupons;

    //price:实付金额
    protected double price;

    //integral 获得积分
    protected  Integer integral;


}
