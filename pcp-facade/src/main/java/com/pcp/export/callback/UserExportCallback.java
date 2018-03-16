package com.pcp.export.callback;

import com.pcp.api.crm.domain.UserInfo;
import com.pcp.api.crm.service.IUserService;
import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.api.pos.service.IShopService;
import com.pcp.common.util.BeanUtil;
import com.pcp.export.dto.DealUserExcelDto;
import javafx.util.Callback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.pcp.common.util.BreezeeUtils.objectMapper;

/**
 * Created by Ning on 2017/9/4.
 */
@Component("userExportCallback")
public class UserExportCallback  implements Callback<Map<String, Object>, List<Object>> {

    @Autowired
    private IUserService userService;

    @Autowired
    private IShopService shopService;

    @Override
    public List<Object> call(Map<String, Object> param) {
        UserInfo userInfo = new UserInfo();
        if(!StringUtils.isEmpty(param.get("_userInfo"))){
            LinkedHashMap linkedHashMap = (LinkedHashMap) param.get("_userInfo");
            userInfo.getProperties().putAll(linkedHashMap);

            if (!StringUtils.isEmpty(userInfo.getProperties())) {
                if (!StringUtils.isEmpty(userInfo.getProperties().get("totalPoint_gt"))) {
                    String gt = userInfo.getProperties().get("totalPoint_gt").toString();
                    userInfo.getProperties().put("totalPoint_gt", Double.parseDouble(gt));
                }
                if (!StringUtils.isEmpty(userInfo.getProperties().get("totalPoint_le"))) {
                    String le = userInfo.getProperties().get("totalPoint_le").toString();
                    userInfo.getProperties().put("totalPoint_le", Double.parseDouble(le));
                }
            }

        }
        List<UserInfo> info =  userService.findUsersList(userInfo);
        List<Object> l = new ArrayList<>();
        info.forEach(a->{
            DealUserExcelDto dued = new DealUserExcelDto();
            dued.parseInfo(a);
            if (StringUtils.hasText(dued.getName())) {
                l.add(dued.parseInfo(a));
            }
        });
        return l;
    }
}
