package com.pcp.crm.impl;

import com.pcp.api.crm.domain.SaverTicketInfo;
import com.pcp.api.crm.domain.UserInfo;
import com.pcp.api.crm.service.ISaverTicketService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.PageInfo;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.SaverTicketEntity;
import com.pcp.crm.entity.UserEntity;
import com.pcp.crm.repository.ISaverTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/17
 */
@Service("saverTicketService")
public class SaverTicketServiceImpl implements IServiceLayer,ISaverTicketService {

    @Autowired
    private ISaverTicketRepository saverTicketRepository;

    @Override
    public SaverTicketInfo saveSaverTicket(SaverTicketInfo saverTicketInfo) throws BreezeeException {
        saverTicketInfo.setOperType(OperTypeEnum.WRITE);
        SaverTicketEntity saverTicketEntity=new SaverTicketEntity().createWithInfo(saverTicketInfo);
        return saverTicketEntity.save();
    }

    @Override
    public SaverTicketInfo findSaverTicketById(String id){
        return new SaverTicketEntity().buildId(id).buildCode(id).findOne();
    }



    @Override
    public InfoPage<SaverTicketInfo> pageSaverTicket(SaverTicketInfo saverTicketInfo) throws BreezeeException {
        BreezeeUtils.checkCreateTime(saverTicketInfo.getProperties(), "createTime");
        return new SaverTicketEntity().createWithInfo(saverTicketInfo).page();
    }

    @Override
    public void deleteSaverTicket(String id) throws BreezeeException {
        new SaverTicketEntity().buildId(id).delete();
    }





}
