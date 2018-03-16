package com.pcp.facade;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pcp.api.crm.domain.UserInfo;
import com.pcp.api.crm.service.IUserService;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.api.pos.IPosFacade;
import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.*;
import com.pcp.api.pos.service.*;
import com.pcp.common.*;
import com.pcp.common.event.EventCenter;
import com.pcp.common.event.EventInfo;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.exception.EventException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.netflix.FeignClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.*;

/**
 * POS服务
 * Created by Silence on 2017/7/5.
 */
@RestController
public class PosFacade implements IPosFacade, IResourceLayer {


    @Autowired
    private IShopService shopService;


    @Autowired
    private IRuleService ruleService;


    @Autowired
    private IOperationLogService operationLogService;


    @Override
    @RequestMapping(value = "/shop/save", method = RequestMethod.POST)
    public Response saveShop(@RequestBody ShopInfo shopInfo) {
        try{
            if(StringUtils.isEmpty(shopInfo.getCode())){
                shopInfo.setCode(SystemTool.getCode());
            }
            shopService.saveShop(shopInfo);
            return JsonResponse.ok();
        }catch (Exception e){
            e.printStackTrace();
            return JsonResponse.error(e.getMessage());
        }
    }

    @RequestMapping(value = PosAPI.shopList, method = RequestMethod.POST)
    @Override
    public Response findShops(@RequestBody ShopInfo shopInfo) {
        return JsonResponse.build(shopService.findShops(shopInfo));
    }

    @RequestMapping(value = "/shop/{id}", method = RequestMethod.GET)
    @Override
    public Response findShopById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(shopService.findShopById(id));
    }

    @RequestMapping(value = "/shopCode/code/{code}", method = RequestMethod.GET)
    @Override
    public Response findShopByCode(@PathVariable("code") String code) {
        ShopInfo shopInfo = new ShopInfo();
        shopInfo.setCode(code);
        InfoPage<ShopInfo> infoPage = shopService.findShops(shopInfo);
        if (infoPage != null) {
            return JsonResponse.buildSingle(infoPage.getContent().get(0));
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleSave)
    @Override
    public Response saveRule(@RequestBody RuleInfo ruleInfo) {
        OperationLogInfo operationLogInfo = null;
        RuleInfo old = null;
        if (!StringUtils.isEmpty(ruleInfo.getId())) {
            old = ruleService.findRuleById(ruleInfo.getId());
        }
        try {
            if (ruleInfo.getName() == null) {
                ruleInfo.setName(ruleInfo.getDisName());
            }
            if (ruleInfo.getProperties().get("invoice") != null) {
                ruleInfo.setNeedInvoice(true);
            } else {
                ruleInfo.setNeedInvoice(false);
            }
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(ruleInfo, old == null ? new RuleInfo() : old, "pos", null);
            ruleService.saveRule(ruleInfo);
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(ruleInfo, old == null ? new RuleInfo() : old, "pos", null);
            operationLogInfo.setErrMsg(e.getMessage());
            return JsonResponse.error(FeignClientException.populateMsg(e));
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }


    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleLineSave)
    @Override
    public Response saveLineRule(@RequestBody RuleLineInfo ruleLineInfo) {
        OperationLogInfo operationLogInfo = null;
        RuleLineInfo old = null;
        if (!StringUtils.isEmpty(ruleLineInfo.getId())) {
            old = ruleService.findLineRuleById(ruleLineInfo.getId());
        }
        try {
            if (ruleLineInfo.getName() == null) {
                ruleLineInfo.setName("uname");
            }
            if (ruleLineInfo.getCode() == null) {
                ruleLineInfo.setCode(SystemTool.getCode());
            }
            operationLogInfo = new OperationLogInfo().buildOperationLog(ruleLineInfo, old == null ? new RuleLineInfo() : old, "pos", null);
            ruleService.saveLineRule(ruleLineInfo);
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo().buildOperationLog(ruleLineInfo, old == null ? new RuleLineInfo() : old, "pos", null);
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleLineList)
    @Override
    public Response findRuleLines(@RequestBody RuleLineInfo ruleLineInfo) {
        return JsonResponse.build(ruleService.findRuleLines(ruleLineInfo));
    }

    @RequestMapping(method = RequestMethod.GET, value = PosAPI.ruleLineId)
    @Override
    public Response findRuleLineById(@PathVariable("id") String id) {
        RuleLineInfo lineInfo = new RuleLineInfo();
        lineInfo.setId(id);
        List<RuleLineInfo> l = ruleService.findRuleLines(lineInfo);
        if (l != null && l.size() > 0) {
            return JsonResponse.buildSingle(l.get(0));
        }
        return JsonResponse.error("未找到相应记录");
    }

    @RequestMapping(method = RequestMethod.GET, value = PosAPI.ruleId)
    @Override
    public Response findRuleById(@PathVariable("id") String id) {
        RuleInfo ruleInfo = new RuleInfo();
        ruleInfo.setId(id);
        List<RuleInfo> l = ruleService.findRules(ruleInfo);
        if (l != null && l.size() > 0) {
            return JsonResponse.buildSingle(l.get(0));
        }
        return JsonResponse.error("未找到相应记录");
    }

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.ruleList)
    @Override
    public Response findRules(@RequestBody RuleInfo ruleInfo) {
        return JsonResponse.build(ruleService.findRules(ruleInfo));
    }

}
