package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.LevelManageInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@FeignClient(value = CrmAPI.APPID,path = "/" + CrmAPI.BEAN_LEVELMANAGE_SERVICE)
public interface ILevelManageService extends IServiceLayer {

    @PostMapping(value = CrmAPI.saveLevelManage)
    LevelManageInfo saveLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.levelManageId)
    LevelManageInfo findLevelManageById(@PathVariable("id") String id ) throws BreezeeException;

    @PostMapping(value = CrmAPI.pageLevelManage)
    InfoPage<LevelManageInfo> pageLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException;


    @DeleteMapping(value = CrmAPI.deleteLevelManage)
    void deleteLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException;

    @GetMapping("/levelManager/level")
    LevelManageInfo findByLevel(Integer cardLevel);
}
