package com.pcp.crm.entity;

import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import java.util.Set;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */

@Entity(name = "CRM_TF_CHANNEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChannelEntity extends BaseEntity<ChannelInfo>{
    //code 渠道编码，name 渠道名称
    protected String enName,attentions;

    @Override
    protected ChannelInfo createInfo() {
        return new ChannelInfo();
    }
}
