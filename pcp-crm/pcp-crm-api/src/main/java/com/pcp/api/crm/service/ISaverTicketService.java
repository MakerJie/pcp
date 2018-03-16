package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.domain.QrcodeInfo;
import com.pcp.api.crm.domain.SaverTicketInfo;
import com.pcp.api.crm.domain.UserInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/18
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_SAVERTICKET_SERVICE)
public interface ISaverTicketService extends IServiceLayer{

    @PostMapping(value = CrmAPI.saveSaverTicket)
    SaverTicketInfo saveSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.saverTicketId)
    SaverTicketInfo findSaverTicketById(@PathVariable("id") String id );

    @PostMapping(value = CrmAPI.pageSaverTicket)
    InfoPage<SaverTicketInfo> pageSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) throws BreezeeException;

    @DeleteMapping(value = CrmAPI.deleteSaverTicket)
    void deleteSaverTicket(@PathVariable("id") String id) throws BreezeeException;





}
