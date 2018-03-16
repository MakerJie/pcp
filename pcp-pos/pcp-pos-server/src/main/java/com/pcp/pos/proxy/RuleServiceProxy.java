package com.pcp.pos.proxy;

import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.RuleInfo;
import com.pcp.api.pos.domain.RuleLineInfo;
import com.pcp.api.pos.service.IRuleService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * 规则服务的代理类
 * Created by Silence on 2017/7/9.
 */
@RestController
@RequestMapping("/" + PosAPI.BEAN_RULE_SERVICE)
public class RuleServiceProxy implements IRuleService, IProxyLayer {

    @Resource(name = PosAPI.BEAN_RULE_SERVICE)
    private IRuleService target;

    @Override
    public List<RuleInfo> findRules(@RequestBody RuleInfo ruleInfo) {
        return target.findRules(ruleInfo);
    }

    public List<RuleLineInfo> findRuleLines(@RequestBody RuleLineInfo ruleInfo) {
        return target.findRuleLines(ruleInfo);
    }

    @Override
    public void saveRule(@RequestBody RuleInfo ruleInfo) throws BreezeeException {
        target.saveRule(ruleInfo);
    }

    @Override
    public RuleInfo findRuleById(@PathVariable("id") String id) throws BreezeeException {
        return target.findRuleById(id);
    }

    @Override
    public void saveLineRule(@RequestBody RuleLineInfo ruleLineInfo) throws BreezeeException {
        target.saveLineRule(ruleLineInfo);
    }

    @Override
    public RuleLineInfo findLineRuleById(@PathVariable("id") String id) throws BreezeeException {
        return target.findLineRuleById(id);
    }

}
