package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 积分商品类型
 * @author Wang, Junjie
 * @since on 2017/8/8
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PointStoreTypeInfo extends BaseInfo {
 //name 类型名称 createTime 创建时间
    protected String surface;

    //protected List<PointStoreInfo> ruleLines = new ArrayList<>();

}
