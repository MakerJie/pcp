package com.pcp.crm.entity;

import com.pcp.api.crm.domain.PointStoreTypeInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Wang, Junjie
 * @since on 2017/8/8
 */

@Entity(name = "CRM_TF_POINT_STORE_TYPE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PointStoreTypeEntity extends BaseEntity<PointStoreTypeInfo> {
    //name 类型名称 createTime 创建时间
    protected String surface;

//    @OneToMany(mappedBy = "pointStoreType", cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY, orphanRemoval = true)
//    @OrderBy("rowNum")
//    Set<PointStoreEntity> pointStores;

//    public void addItem(PointStoreEntity item) {
//        if (this.pointStores == null)
//            pointStores = new HashSet<>();
//        item.setPointStoreType(this);
//        this.pointStores.add(item);
//    }
    @Override
    protected PointStoreTypeInfo createInfo() {
        return new PointStoreTypeInfo();
    }
}
