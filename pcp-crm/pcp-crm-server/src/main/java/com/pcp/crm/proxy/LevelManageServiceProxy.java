package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.LevelManageInfo;
import com.pcp.api.crm.service.ILevelManageService;
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
@RequestMapping("/" + CrmAPI.BEAN_LEVELMANAGE_SERVICE)
public class LevelManageServiceProxy implements IServiceLayer,ILevelManageService {

    @Resource(name=CrmAPI.BEAN_LEVELMANAGE_SERVICE)
    private ILevelManageService levelManageService ;

    @Override
    public LevelManageInfo saveLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException {
        return levelManageService.saveLevelManage(levelManageInfo);
    }

    @Override
    public LevelManageInfo findLevelManageById(@PathVariable("id") String id) throws BreezeeException {
        return levelManageService.findLevelManageById(id);
    }

    @Override
    public InfoPage<LevelManageInfo> pageLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException {
        return levelManageService.pageLevelManage(levelManageInfo);
    }

    @Override
    public void deleteLevelManage(@RequestBody LevelManageInfo levelManageInfo) throws BreezeeException {
        levelManageService.deleteLevelManage(levelManageInfo);
    }

    @Override
    public LevelManageInfo findByLevel(Integer cardLevel) {
        return null;
    }
}
