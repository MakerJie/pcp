package com.pcp.crm.entity;

import com.pcp.api.crm.domain.RewardLineInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * @author Wang, Junjie
 * @since on 2017/10/17
 */
@Entity(name = "CRM_TF_REWARD_LINE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardLineEntity extends BaseEntity<RewardLineInfo> {
    protected String  cardLevel;
    @Lob
    protected String couponCodeStr;
    protected Integer integral;
}
