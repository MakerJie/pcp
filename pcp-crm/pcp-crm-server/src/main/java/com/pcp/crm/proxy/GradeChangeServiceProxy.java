package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.GradeChangeInfo;
import com.pcp.api.crm.service.IGradeChangeService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_GRADECHANGE_SERVICE)
public class GradeChangeServiceProxy implements IGradeChangeService,IServiceLayer{

    @Resource(name=CrmAPI.BEAN_GRADECHANGE_SERVICE)
    private IGradeChangeService gradeChangeService;
    @Override
    public void saveGradeChange(@RequestBody GradeChangeInfo gradeChangeInfo) throws BreezeeException {
        gradeChangeService.saveGradeChange(gradeChangeInfo);
    }

    @Override
    public InfoPage<GradeChangeInfo> pageGradeChange(@RequestBody GradeChangeInfo gradeChangeInfo) throws BreezeeException {
        return gradeChangeService.pageGradeChange(gradeChangeInfo);
    }
}
