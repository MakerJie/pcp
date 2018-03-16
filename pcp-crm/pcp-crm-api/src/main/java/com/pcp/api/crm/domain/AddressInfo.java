package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 会员地址
 * @author Wang, Junjie
 * @since on 2017/8/14
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AddressInfo extends BaseInfo {
    // code 编码 detail详情  consignee 收货人 status 是否为默认
    protected String province,city,detail,consignee,tel;

}
