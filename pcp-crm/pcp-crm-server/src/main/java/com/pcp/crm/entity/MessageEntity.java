package com.pcp.crm.entity;

import com.pcp.api.crm.domain.MessageInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Lob;

/**
 * Created by Ning on 2017/8/7.
 */
@Entity(name = "CRM_TF_MESSAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MessageEntity extends BaseEntity<MessageInfo> {

    protected String userName, shopName, viewType, degree, email, city, mobile, userOpenId;

    @Lob
    protected String viewRemark;
    @Lob
    protected String image;
    @Lob
    protected String degreeRemark;
    @Lob
    protected String result;

    @Override
    protected MessageInfo createInfo() {
        return new MessageInfo();
    }

}
