package com.pcp.crm.entity;

import com.pcp.api.crm.domain.SumReportInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import java.util.Date;

/**
 * Created by Ning on 2017/8/8.
 */
@Entity(name = "CRM_TF_SUM_REPORT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SumReportEntity extends BaseEntity<SumReportInfo>{

    //userId:会员ID，mobile：会员手机，level：会员等级，registerChannels：注册渠道，code：订单编码，createTime:消费时间，storeCode:门店Code,storeName:门店名称
    //discount:折扣金额，type:支付方式，beginTime:开始时间，endTime:结账时间，,city:消费城市，account：消费金额
    protected String userID,mobile,level,registerChannels,storeCode,storeName,city;

    protected Date beginTime,endTime;

    protected Double discount,account;

    protected Integer type;

    @Override
    protected SumReportInfo createInfo() {
        return new SumReportInfo();
    }

}
