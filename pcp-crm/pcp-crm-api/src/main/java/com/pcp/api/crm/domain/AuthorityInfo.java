package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Ning on 2017/8/4.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthorityInfo extends BaseInfo {

    protected String type, content;

    protected Date beginTime, endTime;

    protected Map<String, Object> rule;

    public String getDetail() {
        if (this.getRule() != null) {
            StringBuilder sb = new StringBuilder();
            if (!StringUtils.isEmpty(this.getRule().get("pointValue"))) {
                sb.append("，送：").append(this.getRule().get("pointValue")).append(" 积分");
            }
            if (!StringUtils.isEmpty(this.getRule().get("coupons"))) {
                sb.append("，送：").append(this.getRule().get("coupons").toString().split(";").length).append(" 张券");
            }
            if (sb.length() > 0) {
                return sb.toString().substring(1);
            }
        }
        return "";
    }
}
