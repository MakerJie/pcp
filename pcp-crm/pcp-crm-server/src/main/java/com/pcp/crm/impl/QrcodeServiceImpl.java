package com.pcp.crm.impl;

import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.domain.QrcodeInfo;
import com.pcp.api.crm.domain.QrcodeShopInfo;
import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.api.crm.service.IQrcodeService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.InfoStatusEnum;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.QrcodeEntity;
import com.pcp.crm.entity.QrcodeShopEntity;
import com.pcp.crm.entity.RewardEntity;
import com.pcp.crm.entity.UserEntity;
import com.pcp.crm.repository.IQrcodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Service("qrcodeService")
public class QrcodeServiceImpl implements IQrcodeService, IServiceLayer {

    @Autowired
    private IQrcodeRepository qrcodeRepository;

    @Resource
    private UserServiceImpl userService;

    @Override
    public QrcodeInfo saveQrcode(QrcodeInfo qrcodeInfo) throws BreezeeException {
        qrcodeInfo.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(qrcodeInfo.getCode())) {
            qrcodeInfo.setCode(SystemTool.getCode());
        }
        QrcodeEntity qrcodeEntity = new QrcodeEntity().createWithInfo(qrcodeInfo);
        return qrcodeEntity.save();
    }

    @Override
    public QrcodeInfo findQrcodeById(String id) throws BreezeeException {
        return new QrcodeEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<QrcodeInfo> pageQrcode(QrcodeInfo qrcodeInfo) throws BreezeeException {
        return new QrcodeEntity().createWithInfo(qrcodeInfo).page();
    }

    @Override
    public void deleteQrcode(QrcodeInfo qrcodeInfo) throws BreezeeException {
        new QrcodeEntity().createWithInfo(qrcodeInfo).delete();
    }

    @Override
    public QrcodeShopInfo saveQrcodeShop(QrcodeShopInfo qrcodeShopInfo) throws BreezeeException {
        qrcodeShopInfo.setOperType(OperTypeEnum.WRITE);
        QrcodeShopEntity qrcodeShopEntity = new QrcodeShopEntity().createWithInfo(qrcodeShopInfo);
        return qrcodeShopEntity.save();
    }

    @Override
    public void deleteQrcodeShop(QrcodeShopInfo qrcodeShopInfo) throws BreezeeException {
        if (qrcodeShopInfo.getQrcodeCode() != null) {
            QrcodeShopEntity se = new QrcodeShopEntity();
            se.addProperties("qrcodeCode", qrcodeShopInfo.getQrcodeCode());
            se.list().forEach(a -> {
                new QrcodeShopEntity().buildId(a.getId()).delete();
            });
        }
        String code = qrcodeShopInfo.getCode();
        new QrcodeShopEntity().buildCode(code).delete();
    }

    @Override
    public void saveQrcodeChannel(QrcodeInfo qrcodeInfo) throws BreezeeException {
        qrcodeRepository.deleteChannels(qrcodeInfo.getId());
    }

    @Override
    public InfoPage<QrcodeInfo> findChannelQrcodes(ChannelInfo channelInfo) throws BreezeeException {
        return null;
    }

    @Override
    public void scanQrcode(QrcodeInfo qrcodeInfo) throws BreezeeException {
        //TODO:how to do for params
        QrcodeEntity qrcode = new QrcodeEntity().buildCode(qrcodeInfo.getCode()).findEntity();
        if (Objects.equals(qrcode.getStatus(), InfoStatusEnum.ENABLE.getValue())) {
            RewardEntity re = new RewardEntity();
            re.addProperties("status", InfoStatusEnum.ENABLE.getValue());
            re.addProperties("type", "2");
            re.addProperties("qrcode_code_obj_ae", qrcodeInfo.getCode());
            re.addProperties("beginTime_le_null", new Date());
            re.addProperties("endTime_gt_null", new Date());
            List<RewardInfo> rel = re.list();
            UserEntity ne = new UserEntity();
            ne.setOpenid(qrcodeInfo.getOpenId());
            ne = ne.findEntity();
            for (RewardInfo a : rel) {
                if (a.checkRule(null, ne.buildInfo())) {
                    int i = userService.activitiPoint(a, ne, null);
                    i += userService.activitiCoupon(a, ne);
                    if (i > 0) {
                        userService.rewardUser(a.getId(), ne);
                    }
                }
            }
        }
    }

}
