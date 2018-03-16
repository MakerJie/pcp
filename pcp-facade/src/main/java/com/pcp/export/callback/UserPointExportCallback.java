package com.pcp.export.callback;

import com.pcp.api.crm.domain.UserInfo;
import com.pcp.api.crm.domain.UserPointHistoryInfo;
import com.pcp.api.crm.service.IUserPointHistoryService;
import com.pcp.api.crm.service.IUserService;
import com.pcp.export.dto.DealUserExcelDto;
import com.pcp.export.dto.UserPointExcelDTO;
import javafx.util.Callback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Wang, Junjie
 * @since on 2017/9/5
 */
@Component("userPointExportCallback")
public class UserPointExportCallback implements Callback<Map<String, Object>, List<Object>> {

    @Autowired
    private IUserPointHistoryService userPointHistoryService;

    @Override
    public List<Object> call(Map<String, Object> param) {

        UserPointHistoryInfo userPointHistoryInfo = new UserPointHistoryInfo();
        if(!StringUtils.isEmpty(param.get("_userPointHistoryInfo"))){
            LinkedHashMap linkedHashMap = (LinkedHashMap) param.get("_userPointHistoryInfo");
            userPointHistoryInfo.getProperties().putAll(linkedHashMap);
        }
        List<UserPointHistoryInfo> info =  userPointHistoryService.findPointHistoryList(userPointHistoryInfo);
        List<Object> l = new ArrayList<>();
        info.forEach(a->{
            UserPointExcelDTO dued = new UserPointExcelDTO();
            dued.parseInfo(a);
            if (StringUtils.hasText(dued.getUserName())) {
                l.add(dued.parseInfo(a));
            }
        });
        return l;
    }
}
