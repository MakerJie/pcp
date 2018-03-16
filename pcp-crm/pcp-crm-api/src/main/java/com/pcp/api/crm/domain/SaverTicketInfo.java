package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**优惠券
 * @author Wang, Junjie
 * @since on 2017/8/18
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SaverTicketInfo extends BaseInfo{
    //code 优惠券ID name 券名称 direction 使用说明  scope使用范围 validity 有效期
    protected  String direction,enDirection,scope,enScope,validity,couponType;
    protected Date startDate,endDate;
    protected Integer afterDays,validityDays,totalNumber;//afterDays 几天后生效  validityDays 有效期几天
    protected Integer donation,remind,ownUse;//donation 优惠券是否可以转赠 remind是否到期提醒  ownUse自己能否使用
    protected String couponSource;


    //优惠券条件行项目
    protected String sellMethod,brand,shopCode,bigCategory,smallCategory,goods;
    protected Integer joinActivity;

}
