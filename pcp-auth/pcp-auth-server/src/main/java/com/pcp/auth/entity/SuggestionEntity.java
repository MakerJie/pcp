package com.pcp.auth.entity;

import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * 意见与建议的实体
 * Created by Silence on 2017/10/9.
 */
@Entity(name = "AUTH_TF_SUGGEST")
@Table(indexes = {
        @Index(name = "auth_idx_code_suggest", columnList = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SuggestionEntity extends BaseEntity<SuggestionInfo> {

    @Column(name = "SUG_CONTENT",length = 3000)
    private String content;

    @Override
    protected SuggestionInfo createInfo() {
        return new SuggestionInfo();
    }
}
