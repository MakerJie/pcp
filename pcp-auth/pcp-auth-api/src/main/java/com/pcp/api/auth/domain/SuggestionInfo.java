package com.pcp.api.auth.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 意见与建议
 * Created by Silence on 2017/10/9.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SuggestionInfo extends BaseInfo {
    protected String content;
}
