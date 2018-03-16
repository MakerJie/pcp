package com.pcp.crm.entity;

import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 用户积分历史
 * Created by Arirelia on 2017/7/11.
 */

@Entity(name = "CRM_TF_USER_POINT_HISTORY")
@Table(indexes = {
        @Index(name = "crm_idx_code_ph", unique = true, columnList = "code")
        , @Index(name = "crm_idx_happentime_hp", unique = false, columnList = "happenTime")
        , @Index(name = "crm_idx_order_code_hp", unique = false, columnList = "orderCode")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserPointHistoryEntity extends BaseEntity<UserPointHistoryInfo> {

    protected Integer amount, totalAmount, rightAmount, activiAmount, remainAmount;

    private String pointType, shopCode, orderCode, relHis;

    protected Date happenTime, endTime;

    protected BigDecimal payAmount;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    protected UserEntity user;

    @Override
    protected UserPointHistoryInfo createInfo() {
        return new UserPointHistoryInfo();
    }

    @Override
    public UserPointHistoryInfo buildInfo(UserPointHistoryInfo pointHistoryInfo) {
        super.buildInfo(pointHistoryInfo);
        if (user != null) {
            pointHistoryInfo.setUserName(user.getRealName());
            pointHistoryInfo.setMobile(user.getMobile());
            pointHistoryInfo.setCardNo(user.getCardNo());
            pointHistoryInfo.setUserId(user.getId());
            pointHistoryInfo.setCardLevel(user.getCardLevel());
            pointHistoryInfo.setAliCard(user.getAliCard());
        }
        return pointHistoryInfo;
    }
}
