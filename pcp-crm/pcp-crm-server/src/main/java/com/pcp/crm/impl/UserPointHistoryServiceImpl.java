package com.pcp.crm.impl;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.api.crm.service.IUserPointHistoryService;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.UserEntity;
import com.pcp.crm.entity.UserPointHistoryEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/10/11
 */
@Service(value = CrmAPI.BEAN_USER_POINT_HISTORY_SERVICE)
public class UserPointHistoryServiceImpl implements IUserPointHistoryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public InfoPage<UserPointHistoryInfo> findPointHistory(UserPointHistoryInfo userPointHistoryInfo) {
        BreezeeUtils.checkCreateTime(userPointHistoryInfo.getProperties(), "happenTime");
        return new UserPointHistoryEntity().createWithInfo(userPointHistoryInfo).page();
    }

    @Override
    public List<UserPointHistoryInfo> findPointHistoryList(UserPointHistoryInfo userPointHistoryInfo) {
        BreezeeUtils.checkCreateTime(userPointHistoryInfo.getProperties(), "happenTime");
        return new UserPointHistoryEntity().createWithInfo(userPointHistoryInfo).list();
    }

    @Override
    public UserPointHistoryInfo savePointHistory(UserPointHistoryInfo userPointHistoryInfo) {
        userPointHistoryInfo.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(userPointHistoryInfo.getCode())) {
            userPointHistoryInfo.setCode(SystemTool.getCode());
        }
        if (userPointHistoryInfo.getHappenTime() == null) {
            userPointHistoryInfo.setHappenTime(new Date());
        }
        UserEntity ue = new UserEntity().buildId(userPointHistoryInfo.getUserId()).findEntity();
        Integer to;
        if (ue.getTotalPoint() == null) {
            to = 0;
        } else {
            to = ue.getTotalPoint();
        }
        to = to + userPointHistoryInfo.getAmount();
        userPointHistoryInfo.setTotalAmount(ue.getTotalPoint());
        UserPointHistoryEntity uph = new UserPointHistoryEntity().createWithInfo(userPointHistoryInfo);
        uph.setUser(ue);
        uph.save();
        jdbcTemplate.update("update crm_tf_user set total_point= " + to + " where pk_id='" + ue.getId() + "'");
        return userPointHistoryInfo;
    }

    @Override
    public UserPointHistoryInfo findPointHistoryById(String id) {
        return new UserPointHistoryEntity().buildId(id).findOne();
    }
}
