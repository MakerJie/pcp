package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.GradeChangeInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@FeignClient(value = CrmAPI.APPID,path = "/" + CrmAPI.BEAN_GRADECHANGE_SERVICE)
public interface IGradeChangeService extends IServiceLayer{

    @PutMapping(value = "/gradeChange/save")
    void saveGradeChange(@RequestBody GradeChangeInfo gradeChangeInfo) throws BreezeeException;

    @PostMapping(value = "/gradeChange/page")
    InfoPage<GradeChangeInfo> pageGradeChange(@RequestBody GradeChangeInfo gradeChangeInfo) throws BreezeeException;
}
