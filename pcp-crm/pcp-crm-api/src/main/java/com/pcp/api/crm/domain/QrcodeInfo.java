package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 二维码
 *
 * @author Wang, Junjie
 * @since on 2017/8/7
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QrcodeInfo extends BaseInfo {
    //imageData存储，qrUrl存储的是扫码后打开的地址
    protected String crmChannel, barCode, qrUrl, barTicket, imageData, params,
            shopCode, shopName, eventkey, openId, type;
}
