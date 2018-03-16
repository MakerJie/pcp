package com.pcp.pos.entity;

import com.pcp.api.pos.domain.RuleInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * 规则实体类
 * Created by Silence on 2017/7/9.
 */
@Entity
@Table(name = "POS_TF_RULE")
@SQLDelete(sql = "UPDATE PRO_TF_RULE SET STATUS = 0 WHERE PK_ID = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RuleEntity extends BaseEntity<RuleInfo> {

    protected Integer type, category;

    protected Double limitAmount;

    protected Date startDate, endDate;

    protected Boolean needInvoice;

    protected String corpId, corpName, disCode, disName, frequency, payCode;

    @OneToMany(mappedBy = "rule", cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("rowNum")
    Set<RuleLineEntity> ruleLines;

    public void addItem(RuleLineEntity item) {
        if (this.ruleLines == null)
            ruleLines = new HashSet<>();
        item.setRule(this);
        this.ruleLines.add(item);
    }

    @Override
    protected RuleInfo createInfo() {
        return new RuleInfo();
    }

    @Override
    public RuleInfo buildInfo(RuleInfo ruleInfo) {
        super.buildInfo(ruleInfo);
        if (this.getRuleLines() != null)
            this.getRuleLines().forEach(a -> {
                ruleInfo.getRuleLines().add(a.buildInfo());
            });
        return ruleInfo;
    }
}
