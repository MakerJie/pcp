package com.pcp.api.pos;

import com.pcp.api.pos.domain.*;
import com.pcp.common.IFacadeLayer;
import com.pcp.common.Response;

import java.util.Map;

/**
 * 所有POS服务对外暴露的接口应继承此接口
 * <p>
 * Created by Silence on 2017/7/5.
 */
public interface IPosFacade extends IFacadeLayer {


    Response saveShop(ShopInfo shopInfo);

    Response findShops(ShopInfo shopInfo);

    Response findShopById(String id);

    Response findShopByCode(String code);

    Response saveRule(RuleInfo ruleInfo);

    Response findRules(RuleInfo ruleInfo);

    Response saveLineRule(RuleLineInfo ruleLineInfo);

    Response findRuleLines(RuleLineInfo ruleLineInfo);

    Response findRuleLineById(String id);

    Response findRuleById(String id);

}
