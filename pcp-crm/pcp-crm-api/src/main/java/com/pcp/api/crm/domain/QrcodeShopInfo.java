package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/22
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QrcodeShopInfo extends BaseInfo{
    //code 由qrcodeCode+shopCode组成
    protected  String  shopCode,qrcodeCode;
}
