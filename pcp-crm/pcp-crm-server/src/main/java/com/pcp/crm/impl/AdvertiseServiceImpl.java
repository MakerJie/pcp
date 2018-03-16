package com.pcp.crm.impl;

import com.pcp.api.crm.domain.AdvertiseInfo;
import com.pcp.api.crm.service.IAdvertiseService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.AdvertiseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */

@Service("advertiseService")
public class AdvertiseServiceImpl implements IAdvertiseService, IServiceLayer {
    @Override
    public AdvertiseInfo saveAdvertiseInfo(AdvertiseInfo advertiseInfo) throws BreezeeException {
        advertiseInfo.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(advertiseInfo.getCode())) {
            advertiseInfo.setCode(SystemTool.getCode());
        }
        if (StringUtils.isEmpty(advertiseInfo.getName())) {
            advertiseInfo.setName(advertiseInfo.getCode());
        }
        AdvertiseEntity ae = new AdvertiseEntity().createWithInfo(advertiseInfo);
        return ae.save();
    }

    @Override
    public AdvertiseInfo findAdvertiseById(String id) throws BreezeeException {
        return new AdvertiseEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<AdvertiseInfo> pageAdvertise(AdvertiseInfo advertiseInfo) throws BreezeeException {
        BreezeeUtils.checkCreateTime(advertiseInfo.getProperties(), "topCarriageDate");
        BreezeeUtils.checkCreateTime(advertiseInfo.getProperties(), "underCarriageDate");
        if (advertiseInfo.getProperties().get("_now") != null) {
            Date now = new Date();
            advertiseInfo.getProperties().putIfAbsent("topCarriageDate_le", now);
            advertiseInfo.getProperties().putIfAbsent("underCarriageDate_gt", now);
        }
        return new AdvertiseEntity().createWithInfo(advertiseInfo).page();
    }

    @Override
    public void deleteAdvertise(AdvertiseInfo advertiseInfo) throws BreezeeException {
        new AdvertiseEntity().createWithInfo(advertiseInfo).delete();
    }
}
