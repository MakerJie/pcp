package com.pcp.crm.impl;

import com.pcp.api.crm.domain.AuthorityInfo;
import com.pcp.api.crm.domain.AuthorityLineInfo;
import com.pcp.api.crm.service.IAuthorityService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.AuthorityEntity;
import com.pcp.crm.entity.AuthorityLineEntity;
import com.pcp.crm.entity.CouponGrantEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 会员权益
 * Created by Ning on 2017/8/5.
 */
@Service("authorityService")
public class AuthorityServiceImpl implements IAuthorityService,IServiceLayer {

    @Override
    public AuthorityInfo saveAdvertiseInfo(AuthorityInfo authorityInfo) throws BreezeeException {
        authorityInfo.setOperType(OperTypeEnum.WRITE);
        if(StringUtils.isEmpty(authorityInfo.getCode())){
            authorityInfo.setCode(SystemTool.getCode());
        }
        AuthorityEntity ae = new AuthorityEntity().createWithInfo(authorityInfo);
        return ae.save();
    }

    @Override
    public void saveAuthorityLine(AuthorityLineInfo authorityLineInfo) throws BreezeeException {
        authorityLineInfo.setOperType(OperTypeEnum.WRITE);
        AuthorityLineEntity authorityLineEntity=new AuthorityLineEntity().createWithInfo(authorityLineInfo);
        authorityLineEntity.save();
    }

    @Override
    public void deleteAdvertise(AuthorityInfo authorityInfo) throws BreezeeException {
        new AuthorityEntity().createWithInfo(authorityInfo).delete();
    }

    @Override
    public AuthorityInfo findAdvertise(String id) throws BreezeeException {
        return new AuthorityEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<AuthorityInfo> pageAdvertise(AuthorityInfo authorityInfo) throws BreezeeException {
        BreezeeUtils.checkCreateTime(authorityInfo.getProperties(), "beginTime");
        return new AuthorityEntity().createWithInfo(authorityInfo).page();
    }

    @Override
    public InfoPage<AuthorityLineInfo> pageAuthorityLines(AuthorityLineInfo authorityLineInfo) throws BreezeeException {
        return new AuthorityLineEntity().createWithInfo(authorityLineInfo).page();
    }

    @Override
    public void deleteAuthorityLines(String id) throws BreezeeException {
       new AuthorityLineEntity().buildId(id).buildCode(id).delete();
    }

    @Override
    public AuthorityLineInfo findAuthorityLineById(String id) throws BreezeeException {
        return new AuthorityLineEntity().buildId(id).buildCode(id).findOne();
    }
}
