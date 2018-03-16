package com.pcp.api.auth.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * @author Wang, Junjie
 * @since on 2017/7/30
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShopAccountInfo extends BaseInfo{
    //code 由accountCode+shopCode组成
    protected  String  shopCode,shopName,accountCode;
}
