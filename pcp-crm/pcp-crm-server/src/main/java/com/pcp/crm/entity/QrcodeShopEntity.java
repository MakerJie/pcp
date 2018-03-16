package com.pcp.crm.entity;

import com.pcp.api.crm.domain.QrcodeShopInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;

/**
 * @author Wang, Junjie
 * @since on 2017/8/22
 */

@Entity(name = "CRM_TF_QRCODE_SHOP")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QrcodeShopEntity extends BaseEntity<QrcodeShopInfo> {
    //code 由qrcodeCode+shopCode组成
    protected  String  shopCode,qrcodeCode;

    @Override
    protected QrcodeShopInfo createInfo() {
        return new QrcodeShopInfo();
    }
}
