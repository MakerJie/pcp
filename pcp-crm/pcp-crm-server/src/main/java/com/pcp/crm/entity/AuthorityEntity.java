package com.pcp.crm.entity;

import com.pcp.api.crm.domain.AuthorityInfo;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 会员权益表
 * Created by Ning on 2017/8/5.
 */
@Entity(name = "CRM_TF_AUTHORITY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthorityEntity extends BaseEntity<AuthorityInfo> {

    //name:活动名称；creator:发起人；status:状态；type：活动有效期，remark：使用说明，content：活动内容
    protected String type;
    //baginTime:开始时间；endTime：结束时间
    protected Date beginTime, endTime;

    @Lob
    private String content;

    @Override
    public AuthorityInfo buildInfo(AuthorityInfo authorityInfo) {
        super.buildInfo(authorityInfo);
        if (StringUtils.hasText(authorityInfo.getContent())) {
            try {
                Map<String, Object> m = BreezeeUtils.objectMapper.readValue(authorityInfo.getContent(), Map.class);
                authorityInfo.setRule(m);
            } catch (IOException ignored) {
            }
        }
        if(authorityInfo.getRule()==null){
            authorityInfo.setRule(new HashMap<>());
        }
        return authorityInfo;
    }

    @Override
    protected AuthorityInfo createInfo() {
        return new AuthorityInfo();
    }

}
