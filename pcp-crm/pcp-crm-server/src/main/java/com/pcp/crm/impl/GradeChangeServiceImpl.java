package com.pcp.crm.impl;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.GradeChangeInfo;
import com.pcp.api.crm.service.IGradeChangeService;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.GradeChangeEntity;
import org.springframework.stereotype.Service;

/**
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@Service(value = "gradeChangeService")
public class GradeChangeServiceImpl implements IGradeChangeService{
    @Override
    public void saveGradeChange(GradeChangeInfo gradeChangeInfo) throws BreezeeException {
        gradeChangeInfo.setOperType(OperTypeEnum.WRITE);
         new GradeChangeEntity().createWithInfo(gradeChangeInfo).save();
    }

    @Override
    public InfoPage<GradeChangeInfo> pageGradeChange(GradeChangeInfo gradeChangeInfo) throws BreezeeException {
        return new GradeChangeEntity().createWithInfo(gradeChangeInfo).page();
    }
}
