package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.domain.QrcodeInfo;
import com.pcp.api.crm.domain.QrcodeShopInfo;
import com.pcp.api.crm.service.IQrcodeService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_QRCODE_SERVICE)
public class QrcodeServiceProxy implements IServiceLayer,IQrcodeService{

    @Resource(name = CrmAPI.BEAN_QRCODE_SERVICE)
    private IQrcodeService target;

    @Override
    public QrcodeInfo saveQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException {
        return target.saveQrcode(qrcodeInfo);
    }

    @Override
    public QrcodeInfo findQrcodeById(@PathVariable("id") String id) throws BreezeeException {
        return target.findQrcodeById(id);
    }

    @Override
    public InfoPage<QrcodeInfo> pageQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException {
        return target.pageQrcode(qrcodeInfo);
    }

    @Override
    public void deleteQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException {
        target.deleteQrcode(qrcodeInfo);
    }

    @Override
    public QrcodeShopInfo saveQrcodeShop(@RequestBody QrcodeShopInfo qrcodeShopInfo) throws BreezeeException {
        return target.saveQrcodeShop(qrcodeShopInfo);
    }

    @Override
    public void deleteQrcodeShop(@RequestBody QrcodeShopInfo qrcodeShopInfo) throws BreezeeException {
        target.deleteQrcodeShop(qrcodeShopInfo);
    }

    @Override
    public void saveQrcodeChannel(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException {
        target.saveQrcodeChannel(qrcodeInfo);
    }

    @Override
    public InfoPage<QrcodeInfo> findChannelQrcodes(@RequestBody ChannelInfo channelInfo) throws BreezeeException {
        return target.findChannelQrcodes(channelInfo);
    }

    @Override
    public void scanQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException {
        target.scanQrcode(qrcodeInfo);
    }


}
