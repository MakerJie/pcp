package com.pcp.crm.entity;

import com.pcp.api.crm.domain.AddressInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/14
 */

@Entity(name = "CRM_TF_ADDRESS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AddressEntity extends BaseEntity<AddressInfo>{
    // code 编码 detail详情  consignee 收货人 status 是否为默认
    protected String province,city,detail,consignee,tel;


    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    UserEntity user;

    @Override
    protected AddressInfo createInfo() {
        return new AddressInfo();
    }
}
