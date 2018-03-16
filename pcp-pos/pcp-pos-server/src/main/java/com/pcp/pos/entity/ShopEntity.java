package com.pcp.pos.entity;

import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.common.ISyncObject;
import com.pcp.common.data.BaseEntity;
import com.pcp.pos.repository.IShopRepository;
import lombok.*;
import org.springframework.util.StringUtils;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import java.util.Date;

/**
 * 门店实体
 * Created by Silence on 2017/7/5.
 */
@Entity(name = "POS_TF_SHOP")
@Table(indexes = {
        @Index(name = "pos_idx_code_shop", columnList = "code", unique = true),
        @Index(name = "pos_idx_dn_shop", columnList = "dn", unique = true)})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShopEntity extends BaseEntity<ShopInfo> implements ISyncObject {

    protected String country,
            region,
            area,
            areaCode,
            province,
            provinceCode,
            city,
            address,
            telephone,
            contactPerson,
            openTime,
            bizDis,
            closeTime,
            factory,
            stockRoom,
            centerFactory,
            centerStockRoom,
            costCenter,
            processRoom,
            email,
            dn,
            brand,
            type, path;

    Date startDate, endDate, syncDate, lastModify;

    Integer floor;

    protected Double longitude = 0d, latitude = 0d;

//    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
//    @JoinColumn(name = "PARENT_ID")
//    ShopEntity parent;
//
//    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
//    @OrderBy(value = "rowNum DESC")
//    Set<ShopEntity> children;

    @Override
    protected ShopInfo createInfo() {
        return new ShopInfo();
    }

    @Override
    protected BaseEntity otherFind() {
        IShopRepository repository = (IShopRepository) this.myRepository();
        if (StringUtils.hasText(this.getDn())) {
            return repository.findByDn(this.getDn());
        }
        return null;
    }
}
