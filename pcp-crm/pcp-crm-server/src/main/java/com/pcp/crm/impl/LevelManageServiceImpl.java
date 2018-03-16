package com.pcp.crm.impl;

import com.pcp.api.crm.domain.LevelManageInfo;
import com.pcp.api.crm.service.ILevelManageService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.LevelManageEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Service("levelManageService")
public class LevelManageServiceImpl implements IServiceLayer, ILevelManageService {
    @Override
    public LevelManageInfo saveLevelManage(LevelManageInfo levelManageInfo) throws BreezeeException {
        if (StringUtils.isEmpty(levelManageInfo.getCode())) {
            levelManageInfo.setCode(SystemTool.getCode());
        }
        if (StringUtils.isEmpty(levelManageInfo.getName())) {
            levelManageInfo.setName(levelManageInfo.getCode());
        }
        levelManageInfo.setOperType(OperTypeEnum.WRITE);
        LevelManageEntity levelManageEntity = new LevelManageEntity().createWithInfo(levelManageInfo);
        return levelManageEntity.save();
    }

    @Override
    public LevelManageInfo findLevelManageById(String id) throws BreezeeException {
        return new LevelManageEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<LevelManageInfo> pageLevelManage(LevelManageInfo levelManageInfo) throws BreezeeException {
        return new LevelManageEntity().createWithInfo(levelManageInfo).page();
    }

    @Override
    public void deleteLevelManage(LevelManageInfo levelManageInfo) throws BreezeeException {
        new LevelManageEntity().createWithInfo(levelManageInfo).delete();
    }

    @Override
    public LevelManageInfo findByLevel(Integer cardLevel) {
        LevelManageInfo levelManageInfo = new LevelManageInfo();
        levelManageInfo.getProperties().put("cardLevel", cardLevel);
        List<LevelManageInfo> l = new LevelManageEntity().createWithInfo(levelManageInfo).list();
        if (l != null && l.size() > 0) {
            return l.get(0);
        }
        return null;
    }
}
