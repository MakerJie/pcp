package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/*
 * 渠道
 * @author Wang, Junjie
 * @since on 2017/8/4
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChannelInfo extends BaseInfo{
    //code 渠道编码，name 渠道名称
    protected String enName,attentions;

    protected List<String> qrCodes = new ArrayList<>();

}
