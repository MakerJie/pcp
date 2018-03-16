package com.pcp.api.pos.service;

import com.pcp.api.pos.PosAPI;
import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.ISyncObject;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 门店服务
 * 从Sap中同步门店数据，并入库
 * Created by
 *
 *
 *
 * on 2017/7/5.
 */
@FeignClient(value = PosAPI.APPID, path = "/" + PosAPI.BEAN_SHOP_SERVICE)
public interface IShopService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.POST, value = PosAPI.shopList)
    InfoPage<ShopInfo> findShops(ShopInfo shopInfo);

    @Override
    @RequestMapping(method = RequestMethod.POST, value = PosAPI.shopSync)
    Object sync(@RequestParam("rule") String rule, @RequestBody Object value) throws BreezeeException;

    @RequestMapping(method = RequestMethod.GET, value = "/shop/{id}")
    ShopInfo findShopById(@PathVariable("id") String id);

    @RequestMapping(method = RequestMethod.POST, value = "/shop/save")
    void saveShop(@RequestBody ShopInfo shopInfo);

}
