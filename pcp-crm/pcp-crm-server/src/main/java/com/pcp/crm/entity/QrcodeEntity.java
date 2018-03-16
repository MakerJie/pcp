package com.pcp.crm.entity;

import com.pcp.api.crm.domain.QrcodeInfo;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.BaseEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */

@Entity(name = "CRM_TF_QRCODE")
@SQLDelete(sql = "UPDATE CRM_TF_QRCODE SET status = 0 WHERE PK_ID = ?")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class QrcodeEntity extends BaseEntity<QrcodeInfo> {

    private String crmChannel, barCode, barTicket, imageData, shopCode, params, type;

    @Lob
    private String qrUrl;

    @OneToMany(mappedBy = "qrcode", cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @OrderBy("updateTime desc")
    private Set<RewardEntity> rewards;

    @Override
    protected QrcodeInfo createInfo() {
        return new QrcodeInfo();
    }
}

