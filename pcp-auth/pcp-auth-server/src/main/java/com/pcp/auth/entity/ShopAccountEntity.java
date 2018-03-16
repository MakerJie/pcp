package com.pcp.auth.entity;

import com.pcp.api.auth.domain.ShopAccountInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Entity;

/**
 * @author Wang, Junjie
 * @since on 2017/7/30
 */


@Entity(name = "AUTH_TF_SHOP_ACCOUNT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ShopAccountEntity extends BaseEntity<ShopAccountInfo>{
    //code 由accountCode+shopCode组成
    protected  String  shopCode,accountCode,shopName;

    @Override
    protected ShopAccountInfo createInfo() {
        return new ShopAccountInfo();
    }
}
