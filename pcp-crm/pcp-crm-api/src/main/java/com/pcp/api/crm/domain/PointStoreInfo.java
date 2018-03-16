package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 积分商品
 *
 * @author Wang, Junjie
 * @since on 2017/8/1
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PointStoreInfo extends BaseInfo {

    //code 商品编码 name 商品名称 remark 存放商品详情
    protected String buleCardPoint, goldCardPoint, platinumCardPoint,
            blackCardPoint, type, exchangeLevel, voucher, voucherName, image,
            largeImage, typeId, description, specification;
    private Integer stockNum, stockRemain;
}
