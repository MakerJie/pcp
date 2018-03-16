package com.pcp.api.pos.domain;

import com.pcp.common.ISyncObject;
import com.pcp.common.domain.BaseInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * 门店信息
 * Created by Silence on 2017/7/5.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShopInfo extends BaseInfo implements ISyncObject {

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
            type;

    Date startDate, endDate, syncDate, lastModify;

    protected Integer floor;

    protected String orderCount,orderAmount;

    protected Double longitude = 0d, latitude = 0d;
}
