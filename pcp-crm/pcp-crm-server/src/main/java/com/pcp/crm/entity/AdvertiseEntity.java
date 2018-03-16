package com.pcp.crm.entity;

import com.pcp.api.crm.domain.AdvertiseInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Lob;
import java.util.Date;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */
@Entity(name = "CRM_TF_ADVERTISE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdvertiseEntity extends BaseEntity<AdvertiseInfo> {
    //code 编码 name 名称  frontImageNorm 前端图片规格  detailImageNorm 详情图片规格
    protected String position,frontImageUrl,frontImageNorm,detailImageUrl,
            detailImageNorm;
    protected Date topCarriageDate,underCarriageDate;//上架时间，下架时间

    @Lob
    protected String frontImageData;
    @Lob
    protected String detailImageData;


    @Override
    protected AdvertiseInfo createInfo() {
        return new AdvertiseInfo();
    }
}
