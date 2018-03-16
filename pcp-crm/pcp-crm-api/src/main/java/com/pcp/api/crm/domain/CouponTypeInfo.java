package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 优惠券类型信息
 * 1. 代金券，直接显示金额
 * 2. 兑换券，直接兑换规则上的商品
 * 3. 买赠券，主表上记录的赠品
 * 4. 满减，主表上记录，例如 200|20
 * 5. 固定金额折扣， 200%20
 * 6. 比例券, 20
 * 7. 无规则券
 * <p>
 * 1. 固定，配置开始和结束
 * 2. 浮动，领取后指定天数
 * 3. 永久
 * 券有效日期配置
 * <p>
 * Created by Silence on 2017/7/4.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponTypeInfo extends BaseInfo {

    //如果是代金券的，则要有金额和限制金额
    protected String rule, description, specification, couponSource, couponType, largeImage, smallImage, typeLimit;
    protected Boolean remind, donation, ownUse;

    protected Long sentNum, verifyNum, maxNum;

    protected List<CouponInfo> couponInfos;

    protected Integer dayAfter, days;

    protected Date activeDate, expireDate;

    protected List<CouponScopeRuleInfo> couponScopeRuleLines = new ArrayList<>();

    protected List<CouponTimeRuleInfo> couponTimeRuleLines = new ArrayList<>();

    public void addScopeLine(CouponScopeRuleInfo lineInfo) {
        this.couponScopeRuleLines.add(lineInfo);
    }

    public void addTimeLine(CouponTimeRuleInfo lineInfo1) {
        this.couponTimeRuleLines.add(lineInfo1);
    }

}
