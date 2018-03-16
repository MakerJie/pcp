package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.domain.QrcodeInfo;
import com.pcp.api.crm.domain.QrcodeShopInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@FeignClient(name = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_QRCODE_SERVICE)
public interface IQrcodeService extends IServiceLayer {

    @PostMapping(value = CrmAPI.saveQrcode)
    QrcodeInfo saveQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.qrcodeId)
    QrcodeInfo findQrcodeById(@PathVariable("id") String id) throws BreezeeException;

    @PostMapping(value = CrmAPI.pageQrcodes)
    InfoPage<QrcodeInfo> pageQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException;

    @DeleteMapping(value = CrmAPI.deleteQrcode)
    void deleteQrcode(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException;

    //二维码门店关系

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.saveQrcodeShop)
    QrcodeShopInfo saveQrcodeShop(@RequestBody QrcodeShopInfo qrcodeShopInfo) throws BreezeeException;

    @DeleteMapping(value = CrmAPI.deleteQrcodeShop)
    void deleteQrcodeShop(@RequestBody QrcodeShopInfo qrcodeShopInfo) throws BreezeeException;


    //二维码渠道关系
    @PostMapping(value = CrmAPI.saveQrcodeChannel)
    void saveQrcodeChannel(@RequestBody QrcodeInfo qrcodeInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.POST, value = "/ChannelQrcode/page")
    InfoPage<QrcodeInfo> findChannelQrcodes(@RequestBody ChannelInfo channelInfo) throws BreezeeException;

    @PostMapping(value = CrmAPI.scanQrcode)
    void scanQrcode(QrcodeInfo qrcodeInfo) throws BreezeeException;

}
