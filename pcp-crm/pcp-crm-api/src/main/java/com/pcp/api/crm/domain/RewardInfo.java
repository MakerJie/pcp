package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import com.pcp.common.util.BreezeeUtils;
import lombok.*;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * 把活动和二维码分开的意义是，门店中，张贴的二维码可以重复使用，而不必不停的更新二维码
 * 二维码会存在有门店信息，这个也将会是活动的限制条件
 * <p>
 * 这就意味着，一个二维码会有多个活动。在扫描一个二维码的时候，通过活动优先级来定义二位码的活动顺序
 * <p>
 * 1. 活动对象
 * 2. 订单对象
 * 3. 活动规则:送积分，送多张券
 *
 * @author Wang, Junjie
 * @since on 2017/8/7
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardInfo extends BaseInfo {
    protected String type, content, qrcodeId;

    protected Date beginTime, endTime;

    protected Map<String, Object> rule;

    protected QrcodeInfo qrcodeInfo;

    private Long count;

    public String getDetail() {
        if (this.rule != null) {
            StringBuilder sb = new StringBuilder();
            if (!StringUtils.isEmpty(this.getRule().get("pointValue"))) {
                sb.append("，送：").append(this.getRule().get("pointValue")).append(" 积分");
            }
            if (!StringUtils.isEmpty(this.getRule().get("coupons"))) {
                sb.append("，送：").append(this.getRule().get("coupons").toString().split(";").length).append(" 张券");
            }
            if (sb.length() > 0) {
                return sb.toString().substring(1);
            }
        }
        return "";
    }

    private Boolean checkField(Map<String, Object> m, String code, Object field) {
        if (!StringUtils.isEmpty(m.get(code))) {
            if (StringUtils.isEmpty(field)) {
                return false;
            }
            return m.get(code).toString().contains(field.toString());
        }
        return true;
    }

    /**
     * 检查活动的适配性
     *
     * @param pointHistoryInfo
     * @param ue
     * @return
     */
    public boolean checkRule(UserPointHistoryInfo pointHistoryInfo, UserInfo ue) {
        if (ue == null) {
            return false;
        }
        Map<String, Object> m = (Map<String, Object>) this.getRule().get("users");
        boolean flag = true;
        if (m != null) {
            System.out.println(m.get("cardLevel") + "....." + ue.getCardLevel());
            if (!StringUtils.isEmpty(m.get("cardLevel"))
                    && !m.get("cardLevel").toString().contains(ue.getCardLevel().toString())) {
                flag = false;
            }
            System.out.println(m.get("sex") + "....." + ue.getSex());
            if (flag) {
                flag = checkField(m, "sex", ue.getSex());
            }
            System.out.println(m.get("tasting") + "+++++++" + ue.getTasting());
            if (flag) {
                flag = checkField(m, "tasting", ue.getTasting());
            }

            if (flag && !StringUtils.isEmpty(m.get("joinYear"))
                    && ue.joinYear() < Integer.parseInt(m.get("joinYear").toString())) {
                flag = false;
            }

            if (flag && !StringUtils.isEmpty(m.get("constellation"))
                    && !String.join(",", (List) m.get("constellation")).contains(ue.getConstellation())) {
                flag = false;
            }
            if (flag) {
                flag = checkField(m, "wantArea", ue.getWantArea());
            }
            if (flag && !StringUtils.isEmpty(m.get("userTag"))) {
                List<String> ut = (List<String>) m.get("userTag");
                if (StringUtils.hasText(ue.getUserTag())) {
                    ut.sort(String::compareTo);
                    List<String> uh = new ArrayList<>();
                    uh.addAll(Arrays.asList(ue.getUserTag().split(",")));
                    uh.sort(String::compareTo);
                    if (!String.join(",", uh).contains(String.join(",", ut))) {
                        flag = false;
                    }
                } else {
                    flag = false;
                }
            }
            if (flag && !StringUtils.isEmpty(m.get("preference"))) {
                List<String> ut = (List<String>) m.get("preference");
                if (StringUtils.hasText(ue.getUserTag())) {
                    ut.sort(String::compareTo);
                    List<String> uh = new ArrayList<>();
                    uh.addAll(Arrays.asList(ue.getPreference().split(",")));
                    uh.sort(String::compareTo);
                    if (!String.join(",", uh).contains(String.join(",", ut))) {
                        flag = false;
                    }
                } else {
                    flag = false;
                }
            }
            if (flag && !StringUtils.isEmpty(m.get("birthMonth"))
                    && !String.join(",", (List) m.get("birthMonth")).contains(String.valueOf(BreezeeUtils.date2LocalDate(ue.getBirthday()).getMonthValue()))) {
                flag = false;
            }
        }
        Map<String, Object> ord = (Map<String, Object>) this.getRule().get("orders");
        if (ord != null) {
            if (flag && !StringUtils.isEmpty(ord.get("shopCode"))
                    && StringUtils.hasText(pointHistoryInfo.getShopCode())
                    && !ord.get("shopCode").toString().contains(pointHistoryInfo.getShopCode())) {
                flag = false;
            }
            if (flag && !StringUtils.isEmpty(ord.get("period")) && !String.join(",", (List) ord.get("period")).contains(pointHistoryInfo.getPeriod())) {
                flag = false;
            }
            if (flag && !StringUtils.isEmpty(ord.get("payAmount"))
                    && Double.parseDouble(ord.get("payAmount").toString()) > pointHistoryInfo.getPayAmount().doubleValue()) {
                flag = false;
            }
            if (flag && !StringUtils.isEmpty(ord.get("productCode")) && StringUtils.hasText(pointHistoryInfo.getProductCode())) {
                boolean tmp = false;
                for (String s : pointHistoryInfo.getProductCode().split(",")) {
                    if (ord.get("productCode").toString().contains(s)) {
                        tmp = true;
                        break;
                    }
                }
                if (!tmp) {
                    flag = false;
                }
            }
            if (flag && !StringUtils.isEmpty(ord.get("payCode")) && StringUtils.hasText(pointHistoryInfo.getPayMethod())) {
                boolean tmp = false;
                for (String s : pointHistoryInfo.getPayMethod().split(",")) {
                    if (ord.get("payCode").toString().contains(s)) {
                        tmp = true;
                        break;
                    }
                }
                if (!tmp) {
                    flag = false;
                }
            }
        }
        return flag;
    }
}
