package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 会员等级变动详情
 *
 * @author Wang, Junjie
 * @since on 2017/9/12
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GradeChangeInfo extends BaseInfo {
    //beforeChange,afterChange变动前等级，变动后等级 status 变动状态
    //creator 变动操作人 createTime 变动时间
    protected Integer beforeLevel, afterLevel, up=0;

    protected String userMobile, userOpenId, userName;

    public Integer getAfterLevel() {
        if (afterLevel > beforeLevel) {
            up = 1;
        } else if (afterLevel < beforeLevel) {
            up = -1;
        }
        return afterLevel;
    }

    /**
     * 构建消息提醒
     *
     * @return
     */
    public SmsInfo[] smsInfo() {
        if (StringUtils.hasText(this.getUserOpenId())) {
            //需要发送的短信息
            SmsInfo smsInfo = new SmsInfo();
            smsInfo.setType("gradeChange");
            smsInfo.setSendMethod("wechat");
            smsInfo.setName(this.getUserOpenId());
            Map<String, Object> m = new HashMap<>();
            Map<String, Object> m1 = new HashMap<>();
            if (up > 0) {
                m1.put("value", "亲爱的" + this.userName + "，恭喜你成功升级为" + LevelEnum.val2text(afterLevel) + "会员");
            } else {
                m1.put("value", "亲爱的" + this.userName + "，很遗憾，您的积分不足将降级为" + LevelEnum.val2text(afterLevel) + "会员");
            }
            m1.put("color","#173177");
            m.put("first",m1);

            Map<String, Object> m2 = new HashMap<>();
            m2.put("value", LevelEnum.val2text(beforeLevel));
            m2.put("color","#173177");
            m.put("grade1",m2);

            Map<String, Object> m3 = new HashMap<>();
            m3.put("value", LevelEnum.val2text(afterLevel));
            m3.put("color","#173177");
            m.put("grade2",m3);

            Map<String, Object> m4 = new HashMap<>();
            m4.put("value", BreezeeUtils.DATE_FORMAT_SHORT.format(new Date()));
            m4.put("color","#173177");
            m.put("time",m4);

            Map<String, Object> m5 = new HashMap<>();
            m5.put("value", "感谢您对Marzano的支持");
            m5.put("color","#173177");
            m.put("remark",m5);

            smsInfo.setSendMessage(BreezeeUtils.json2string(m));
            return new SmsInfo[]{smsInfo};
        }
        return new SmsInfo[0];
    }
}
