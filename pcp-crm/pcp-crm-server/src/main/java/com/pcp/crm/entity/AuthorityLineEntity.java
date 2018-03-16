package com.pcp.crm.entity;

import com.pcp.api.crm.domain.AuthorityLineInfo;
import com.pcp.api.crm.domain.CouponGrantInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Ning on 2017/9/19.
 */
@Entity(name = "CRM_TF_AUTHORITY_LINE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthorityLineEntity extends BaseEntity<AuthorityLineInfo> {

    protected String cardLevel,couponCodeStr;
    protected Integer integral;

    @Override
    protected AuthorityLineInfo createInfo() {
        return new AuthorityLineInfo();
    }



}
