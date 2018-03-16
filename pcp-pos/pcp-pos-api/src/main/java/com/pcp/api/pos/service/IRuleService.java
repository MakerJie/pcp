package com.pcp.api.pos.service;

import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.RuleInfo;
import com.pcp.api.pos.domain.RuleLineInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * 分摊规则服务
 * Created by Silence on 2017/7/9.
 */
@FeignClient(value = PosAPI.APPID, path = "/" + PosAPI.BEAN_RULE_SERVICE)
public interface IRuleService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleList)
    List<RuleInfo> findRules(RuleInfo ruleInfo);

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleLineList)
    List<RuleLineInfo> findRuleLines(RuleLineInfo ruleInfo);

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleSave)
    void saveRule(RuleInfo ruleInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.GET, value = "/findRoleInfo/{id}")
    RuleInfo findRuleById(@PathVariable("id")String id) throws BreezeeException;

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleLineSave)
    void saveLineRule(RuleLineInfo ruleLineInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.GET, value ="/findRoleLineInfo/{id}")
    RuleLineInfo findLineRuleById(@PathVariable("id")String id) throws BreezeeException;

}
