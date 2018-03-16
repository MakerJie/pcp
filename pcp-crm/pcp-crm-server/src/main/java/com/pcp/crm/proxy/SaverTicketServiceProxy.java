package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.SaverTicketInfo;
import com.pcp.api.crm.domain.UserInfo;
import com.pcp.api.crm.service.ISaverTicketService;
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
 * @since on 2017/8/17
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_SAVERTICKET_SERVICE)
public class SaverTicketServiceProxy implements IServiceLayer,ISaverTicketService{

    @Resource(name=CrmAPI.BEAN_SAVERTICKET_SERVICE)
    private ISaverTicketService saverTicketService ;


    @Override
    public SaverTicketInfo saveSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) throws BreezeeException {
        return saverTicketService.saveSaverTicket(saverTicketInfo);
    }

    @Override
    public SaverTicketInfo findSaverTicketById(@PathVariable("id") String id) {
        return saverTicketService.findSaverTicketById(id);
    }


    @Override
    public InfoPage<SaverTicketInfo> pageSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) throws BreezeeException {
        return saverTicketService.pageSaverTicket(saverTicketInfo);
    }

    @Override
    public void deleteSaverTicket(@PathVariable("id") String id) throws BreezeeException {
          saverTicketService.deleteSaverTicket(id);
    }




}
