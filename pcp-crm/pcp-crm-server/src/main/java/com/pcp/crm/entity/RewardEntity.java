package com.pcp.crm.entity;

import com.pcp.api.crm.domain.AuthorityInfo;
import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.api.crm.domain.RewardLineInfo;
import com.pcp.common.data.BaseEntity;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.IOException;
import java.util.*;

/**
 * 把活动和二维码分开的意义是，门店中，张贴的二维码可以重复使用，而不必不停的更新二维码
 * 二维码会存在有门店信息，这个也将会是活动的限制条件
 *
 * @author Wang, Junjie
 * @since on 2017/8/7
 */

@Entity(name = "CRM_TF_REWARD")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardEntity extends BaseEntity<RewardInfo> {

    @Lob
    private String content;

    private String type;

    private Date beginTime, endTime;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "QR_ID")
    private QrcodeEntity qrcode;

    private Long count;

    @OneToMany(mappedBy = "reward", cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<RewardUserEntity> rewardUser;

    @Override
    protected RewardInfo createInfo() {
        return new RewardInfo();
    }

    @Override
    public RewardInfo buildInfo(RewardInfo rewardInfo) {
        super.buildInfo(rewardInfo);
        if (StringUtils.hasText(rewardInfo.getContent())) {
            try {
                Map<String, Object> m = BreezeeUtils.objectMapper.readValue(rewardInfo.getContent(), Map.class);
                rewardInfo.setRule(m);
            } catch (IOException ignored) {
            }
        }
        if (rewardInfo.getRule() == null) {
            rewardInfo.setRule(new HashMap<>());
        }
        if (this.getQrcode() != null) {
            rewardInfo.setQrcodeInfo(this.getQrcode().buildInfo());
            rewardInfo.setQrcodeId(rewardInfo.getQrcodeInfo().getId());
        }
        return rewardInfo;
    }

}
