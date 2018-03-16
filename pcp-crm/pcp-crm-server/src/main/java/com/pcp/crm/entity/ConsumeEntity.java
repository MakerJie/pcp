package com.pcp.crm.entity;

import com.pcp.api.crm.domain.ConsumeInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * Created by LX on 2017/8/2.
 */

@Entity(name = "CRM_TF_CONSUME")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ConsumeEntity extends BaseEntity<ConsumeInfo> {

    //code:订单号，createTime:消费时间，type:消费方式，storeCode:门店Code,storeName：门店名称
    protected String type,storeCode,storeName;
    //coupons:是否用券
    protected boolean coupons;

    //price:实付金额
    protected double price;

    //integral 获得积分
    protected  Integer integral;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    UserEntity user;

    @Override
    protected ConsumeInfo createInfo() {
        return new ConsumeInfo();
    }
}
