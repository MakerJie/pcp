package com.pcp.crm.entity;

import com.pcp.api.crm.domain.LevelManageInfo;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.exception.ValidationException;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Lob;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */

@Entity(name = "CRM_TD_LEVEL_MANAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LevelManageEntity extends BaseEntity<LevelManageInfo> {
    //name 会员等级中文
    protected Integer cent, quota, fluctuate, cardLevel;//积分兑换比例：元：分    额度最小值 升降级
    protected double discount, safeguard;//保级值

    @Lob
    protected String image;

    @Override
    protected void checkQuery() throws ValidationException {
        super.checkQuery();
        if (this.cardLevel != null) {
            this.addProperties("cardLevel", this.cardLevel);
        }
    }

    @Override
    protected LevelManageInfo createInfo() {
        return new LevelManageInfo();
    }
}
