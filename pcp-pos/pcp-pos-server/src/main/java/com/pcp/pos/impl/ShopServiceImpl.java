package com.pcp.pos.impl;

import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.api.pos.service.IShopService;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.exception.EntityNotFoundException;
import com.pcp.common.util.BreezeeCall;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.pos.entity.ShopEntity;
import org.javamoney.moneta.Money;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 门店服务实现
 * 1. 门店与sap的同步，并入库
 * 2. 门店列表
 * Created by Silence on 2017/7/5.
 */
@Service("shopService")
public class ShopServiceImpl implements IShopService {

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<ShopInfo> findShops(ShopInfo shopInfo) {
        shopInfo.setOperType(OperTypeEnum.READ);
        if (shopInfo.getProperties().get("_cityShop") != null) {
            String shopCode = shopInfo.getProperties().get("_cityShop").toString();
            ShopInfo aShop = new ShopEntity().buildCode(shopCode).findOne();
            shopInfo.getProperties().put("city", aShop.getCity());
            shopInfo.getProperties().put("code_not_equal", shopCode);
        }
        if (!StringUtils.isEmpty(shopInfo.getProperties().get("_centerCode"))) {
            String shopCode = shopInfo.getProperties().get("_centerCode").toString();
            ShopInfo aShop = new ShopEntity().buildCode(shopCode).findOne();
            shopInfo.getProperties().put("code", aShop.getCenterFactory() + aShop.getCenterStockRoom());
        }
        InfoPage<ShopInfo> page = new ShopEntity().createWithInfo(shopInfo).page();
        return page;
    }

    @SuppressWarnings("unchecked")
    @Override
    public Object sync(String rule, Object obj) throws BreezeeException {
        if (obj == null)
            throw new BreezeeException("未获取到值");
        Map<String, Object> value = (Map<String, Object>) obj;
        try {
            new ShopEntity().buildCode(value.get("ZSTORE").toString()).findOne((BreezeeCall<ShopEntity, ShopInfo>) (entity, info) -> {
                info.setOperType(OperTypeEnum.WRITE);
                info.sync(rule, value);
                entity.createWithInfo(info).save();
            });
        } catch (EntityNotFoundException e) {
            ShopInfo info = new ShopInfo();
            info.setOperType(OperTypeEnum.WRITE);
            info.sync(rule, value);
            new ShopEntity().createWithInfo(info).save();
        }
        return null;
    }

    @Override
    public ShopInfo findShopById(String id) {
        return new ShopEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public void saveShop(ShopInfo shopInfo) {
        shopInfo.setOperType(OperTypeEnum.WRITE);
        ShopEntity shopEntity=new ShopEntity().createWithInfo(shopInfo);
        shopEntity.save();
    }

}
