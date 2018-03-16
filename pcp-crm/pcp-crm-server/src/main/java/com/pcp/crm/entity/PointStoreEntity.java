package com.pcp.crm.entity;

import com.pcp.api.crm.domain.PointStoreInfo;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * 积分商城实体
 * @author Wang, Junjie
 * @since on 2017/8/1
 */

@Entity(name = "CRM_TF_POINT_STORE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PointStoreEntity extends BaseEntity<PointStoreInfo> {
    //code 物料编码 name 商品名称 remark 存放商品详情

    protected String buleCardPoint,goldCardPoint,platinumCardPoint,
            blackCardPoint,type,exchangeLevel,voucher;

    private Integer stockNum,stockRemain;
    @Override
    protected PointStoreInfo createInfo() {
        return new PointStoreInfo();
    }

}
