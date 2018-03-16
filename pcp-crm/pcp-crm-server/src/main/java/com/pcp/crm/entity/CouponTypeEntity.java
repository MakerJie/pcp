package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponInfo;
import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.api.crm.domain.CouponTimeRuleInfo;
import com.pcp.api.crm.domain.CouponTypeInfo;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * 会员优惠券类型
 * Created by Silence on 2017/7/4.
 */
@Entity(name = "CRM_TD_COUPON_TYPE")
@SQLDelete(sql = "UPDATE CRM_TD_COUPON_TYPE SET status = 0 WHERE PK_ID = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponTypeEntity extends BaseEntity<CouponTypeInfo> {

    public CouponTypeEntity(String id) {
        this.id = id;
    }

    protected String description, specification, couponSource, couponType, typeLimit;

    protected Boolean remind, donation, ownUse;

    protected Integer dayAfter, days;

    protected Long sentNum, verifyNum, maxNum;

    @Column(name = "RULE", length = 3000)
    protected String rule;

    protected Date activeDate, expireDate;

    @Lob
    protected String largeImage;

    @Lob
    protected String smallImage;

    @OneToMany(mappedBy = "couponType", cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @OrderBy("rowNum")
    Set<CouponEntity> coupons;

    @OneToMany(mappedBy = "couponType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy(value = "rowNum")
    Set<CouponScopeRuleEntity> couponScopeRuleLine;

    @OneToMany(mappedBy = "couponType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy(value = "rowNum")
    Set<CouponTimeRuleEntity> couponTimeRuleLine;

    @OneToMany(mappedBy = "couponType", cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    Set<CouponSentEntity> couponSents;

    public void addScopeLine(CouponScopeRuleEntity lineEntity) {
        if (this.couponScopeRuleLine == null) {
            this.couponScopeRuleLine = new HashSet<>();
        }
        this.couponScopeRuleLine.add(lineEntity);
        lineEntity.setCouponType(this);
    }

    public void addTimeLine(CouponTimeRuleEntity lineEntity1) {
        if (this.couponTimeRuleLine == null)
            this.couponTimeRuleLine = new HashSet<>();
        this.couponTimeRuleLine.add(lineEntity1);
        lineEntity1.setCouponType(this);
    }

    @OneToMany(mappedBy = "couponType", cascade = {CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("rowNum")
    Set<CouponSentEntity> sentList;

    public void addItem(CouponEntity item) {
        if (this.coupons == null)
            coupons = new HashSet<>();
        item.setCouponType(this);
        this.coupons.add(item);
    }

    @Override
    protected CouponTypeInfo createInfo() {
        return new CouponTypeInfo();
    }

    @SuppressWarnings("unchecked")
    @Override
    public CouponTypeInfo buildInfo(CouponTypeInfo typeInfo) {
        super.buildInfo(typeInfo);
        if (this.getProperties().get("_ignorePic") != null) {
            typeInfo.setLargeImage(null);
            typeInfo.setSmallImage(null);
            System.out.println("================");
        }
        if (this.getCouponScopeRuleLine() != null) {
            this.getCouponScopeRuleLine().forEach(a -> {
                typeInfo.addScopeLine(a.buildInfo(new CouponScopeRuleInfo()));
            });
        }
        if (this.getCouponTimeRuleLine() != null) {
            this.getCouponTimeRuleLine().forEach(b -> {
                typeInfo.addTimeLine(b.buildInfo(new CouponTimeRuleInfo()));
            });
        }
        return typeInfo;
    }

    public void checkLimit(CouponInfo coupon) {
        if ("1".equals(this.getTypeLimit())) {
            coupon.setActiveDate(new Date());
            try {
                coupon.setExpireDate(BreezeeUtils.DATE_FORMAT_SHORT.parse("2099-01-01"));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        } else if ("2".equals(this.getTypeLimit())) {
            LocalDate now = LocalDate.now();
            try {
                coupon.setActiveDate(BreezeeUtils.DATE_FORMAT_SHORT.parse(now.plusDays(this.getDayAfter()).toString()));
                coupon.setExpireDate(BreezeeUtils.DATE_FORMAT_SHORT.parse(now.plusDays(this.getDayAfter() + this.getDays()).toString()));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        } else if ("4".equals(this.getTypeLimit())) {
            coupon.setActiveDate(this.getActiveDate());
            coupon.setExpireDate(this.getExpireDate());
        }
    }

}
