package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponInfo;
import com.pcp.api.crm.domain.CouponStatusEnum;
import com.pcp.api.crm.domain.CouponTypeInfo;
import com.pcp.common.SystemTool;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * 优惠券实体
 * Created by Silence on 2017/7/4.
 */
@Entity(name = "CRM_TF_COUPON")
@Table(indexes = {
        @Index(name = "crm_idx_code_coupon", unique = true, columnList = "code")
        , @Index(name = "crm_idx_status_coupon", columnList = "status")
})
@SQLDelete(sql = "UPDATE CRM_TF_COUPON SET del_flag = 1 WHERE PK_ID = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponEntity extends BaseEntity<CouponInfo> {

    public CouponEntity(String typeId) throws BreezeeException {
        CouponTypeEntity te = new CouponTypeEntity(typeId);
        CouponTypeInfo ti = te.findOne();
        //TODO:根据规则引擎，解析出规则
        this.createWithInfo(new CouponInfo());
        this.setCode(SystemTool.getCode());
        this.setName(ti.getName());
        this.setCouponType(te);
    }

    protected String rule, verifyAccount, fetchMethod, rightId, activeId, transferUser;

    protected Date activeDate, expireDate, fetchDate, verifyDate, drawDate;

    protected Double amount, verifyAmount;

    protected Integer delFlag;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "TYPE_ID")
    CouponTypeEntity couponType;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "SENT_ID")
    CouponSentEntity couponSent;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "REWARD_ID")
    RewardEntity reward;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    UserEntity user;

    @Override
    protected CouponInfo createInfo() {
        return new CouponInfo();
    }

    @Override
    public CouponInfo buildInfo(CouponInfo couponInfo) {
        super.buildInfo(couponInfo);
        couponInfo.setCouponType(couponType.buildInfo());
        if (couponSent != null) {
            couponInfo.setSentCode(couponSent.getCode());
        }
        if (this.getStatus() == 1) {
            LocalDate d = LocalDate.now();
            if (this.getActiveDate() != null && d.isBefore(BreezeeUtils.date2LocalDate(this.getActiveDate()))) {
                couponInfo.setStatus(CouponStatusEnum.TOBE.getValue());
            } else if (this.expireDate != null && d.isAfter(BreezeeUtils.date2LocalDate(this.expireDate))) {
                couponInfo.setStatus(CouponStatusEnum.EXPIRE.getValue());
            }
        }
        if (this.getDelFlag() != null && this.getDelFlag() == 1) {
            couponInfo.setStatus(CouponStatusEnum.DELETED.getValue());
        }
        if (user != null) {
            couponInfo.setUserId(user.getId());
            couponInfo.setCardNo(user.getCardNo());
            couponInfo.setMobile(user.getMobile());
            couponInfo.setUserName(user.getRealName());
        }
        return couponInfo;
    }
}
