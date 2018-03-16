package com.pcp.pos.entity;

import com.pcp.api.pos.domain.RuleLineInfo;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.BaseEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * 规则行实体
 * Created by Silence on 2017/7/9.
 */
@Entity(name = "POS_TF_RULE_LINE")
@SQLDelete(sql = "UPDATE PRO_TF_RULE_LINE SET status = 0 WHERE PK_ID = ?")
@Getter
@Setter
@AllArgsConstructor
@ToString
public class RuleLineEntity extends BaseEntity<RuleLineInfo> {

    @Lob
    protected String ruleContent, weekDay, brand, shopCode;

    protected String type;

    protected BigDecimal value, value1;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "RULE_ID")
    RuleEntity rule;

    @Override
    protected RuleLineInfo createInfo() {
        return new RuleLineInfo();
    }

    public RuleLineEntity() {

    }

    public RuleLineEntity(RuleLineInfo r, String... ignorePro) {
        if (r.getOperType() == OperTypeEnum.WRITE) {
            this.setRule(new RuleEntity().buildId(r.getRuleId()).findEntity());
        }
    }

    @Override
    public RuleLineInfo buildInfo(RuleLineInfo ruleLineInfo) {
        super.buildInfo(ruleLineInfo);
        if (this.getRule() != null) {
            ruleLineInfo.setRuleId(this.getRule().getId());
            ruleLineInfo.setRuleName(this.getRule().getName());
        }
        return ruleLineInfo;
    }
}
