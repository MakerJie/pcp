package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.Date;

/**
 * 广告位
 * @author Wang, Junjie
 * @since on 2017/8/4
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdvertiseInfo extends BaseInfo {

    //code 编码 name 名称  frontImageNorm 前端图片规格  detailImageNorm 详情图片规格
    protected String position,frontImageUrl,frontImageNorm,detailImageUrl,
            detailImageNorm,frontImageData,detailImageData;
    protected Date topCarriageDate,underCarriageDate;//上架时间，下架时间

}
