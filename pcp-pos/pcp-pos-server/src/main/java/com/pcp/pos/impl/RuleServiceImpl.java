package com.pcp.pos.impl;

import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.RuleInfo;
import com.pcp.api.pos.domain.RuleLineInfo;
import com.pcp.api.pos.service.IRuleService;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.pos.entity.RuleEntity;
import com.pcp.pos.entity.RuleLineEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 规则服务实现类
 * Created by Silence on 2017/7/9.
 */
@Service(PosAPI.BEAN_RULE_SERVICE)
public class RuleServiceImpl implements IRuleService {

    @SuppressWarnings("unchecked")
    @Override
    public List<RuleInfo> findRules(RuleInfo ruleInfo) {
        return new RuleEntity().createWithInfo(ruleInfo).list();
    }

    @Override
    public List<RuleLineInfo> findRuleLines(RuleLineInfo ruleLineInfo) {
        return new RuleLineEntity().createWithInfo(ruleLineInfo).list();
    }

    @Override
    public void saveRule(RuleInfo ruleInfo) throws BreezeeException {
        ruleInfo.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(ruleInfo.getCode())) {
            ruleInfo.setCode(ruleInfo.getDisCode() + "_" + ruleInfo.getPayCode());
        }
        new RuleEntity().createWithInfo(ruleInfo).save();
    }

    @Override
    public RuleInfo findRuleById(String id) throws BreezeeException {
        return new RuleEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public void saveLineRule(RuleLineInfo ruleLineInfo) throws BreezeeException {
        ruleLineInfo.setOperType(OperTypeEnum.WRITE);
        new RuleLineEntity(ruleLineInfo).createWithInfo(ruleLineInfo).save();
    }

    @Override
    public RuleLineInfo findLineRuleById(String id) throws BreezeeException {
        return new RuleLineEntity().buildId(id).buildCode(id).findOne();
    }
}
