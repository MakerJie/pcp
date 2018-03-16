package com.pcp.pos.proxy;

import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.api.pos.service.IShopService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.ISyncObject;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 门店服务代理
 * Created by Silence on 2017/7/5.
 */
@RestController
@RequestMapping("/" + PosAPI.BEAN_SHOP_SERVICE)
public class ShopServiceProxy implements IShopService, IProxyLayer {

    @Resource(name = PosAPI.BEAN_SHOP_SERVICE)
    private IShopService target;

    @Override
    public InfoPage<ShopInfo> findShops(@RequestBody ShopInfo shopInfo) {
        return target.findShops(shopInfo);
    }

    @Override
    public Object sync(@RequestParam("rule") String rule, @RequestBody Object value) throws BreezeeException {
        return target.sync(rule,value);
    }

    @Override
    public ShopInfo findShopById(@PathVariable("id") String id) {
        return target.findShopById(id);
    }

    @Override
    public void saveShop(@RequestBody ShopInfo shopInfo) {
        target.saveShop(shopInfo);
    }

}
