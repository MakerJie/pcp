package com.pcp.crm.entity;

import com.pcp.api.crm.domain.SaverTicketInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Wang, Junjie
 * @since on 2017/8/17
 */

@Entity(name = "CRM_TF_SAVER_TICKET")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SaverTicketEntity extends BaseEntity<SaverTicketInfo>{

    //code 优惠券ID name 券名称 direction 使用说明  scope使用范围 validity 有效期
    protected  String direction,enDirection,scope,enScope,validity,couponType;
    protected Date startDate,endDate;
    protected Integer afterDays,validityDays,totalNumber;//afterDays 几天后生效  validityDays 有效期几天
    protected Integer donation,remind,ownUse;//donation 优惠券是否可以转赠 remind是否到期提醒  ownUse自己能否使用
    protected String couponSource;

    protected String sellMethod,brand,shopCode,bigCategory,smallCategory,goods;
    protected Integer joinActivity;

    @Override
    protected SaverTicketInfo createInfo() {
        return new SaverTicketInfo();
    }


}
