package com.pcp.common;

import com.pcp.common.util.BreezeeUtils;
import org.springframework.util.StringUtils;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 与第三方系统的同步对象
 * Created by Silence on 2017/7/8.
 */
public interface ISyncObject extends Serializable {

    /**
     * 获取同步时间
     *
     * @return
     */
    Date getSyncDate();

    /**
     * 设置同步时间
     *
     * @param d
     */
    void setSyncDate(Date d);

    /**
     * 数据同步
     * 解析同步规则
     *
     * @param rule 同步规则 aField1=bField1+bField11;aField2=bField2;
     * @param m    数据
     */
    default void sync(String rule, Map<String, Object> m) {
        if (rule == null)
            return;
        Field f;
        String[] ff = rule.split(";"), ss, dd;
        Map<String, Field> fieldMap = new HashMap<>();
        for (String s : ff) {
            ss = s.split("=");
            try {
                f = this.getClass().getDeclaredField(ss[0]);
                fieldMap.put(ss[0], f);
            } catch (NoSuchFieldException e) {
                try {
                    f = this.getClass().getSuperclass().getDeclaredField(ss[0]);
                    fieldMap.put(ss[0], f);
                } catch (NoSuchFieldException ignored) {
                }
            }
        }
        for (String s : ff) {
            ss = s.split("=");
            try {
                f = fieldMap.get(ss[0]);
                f.setAccessible(true);
                dd = ss[1].split("\\+");
                switch (f.getType().getSimpleName().toLowerCase()) {
                    case "integer":
                        Integer i = 0;
                        for (String s1 : dd) {
                            if (!StringUtils.isEmpty(m.get(s1)))
                                i += Integer.parseInt(m.get(s1).toString());
                        }
                        f.set(this, i);
                        break;
                    case "double":
                        Double j = 0d;
                        for (String s1 : dd) {
                            if (!StringUtils.isEmpty(m.get(s1)))
                                j += Double.parseDouble(m.get(s1).toString());
                        }
                        f.set(this, j);
                        break;
                    case "bigdecimal":
                        BigDecimal k = new BigDecimal(0);
                        for (String s1 : dd) {
                            if (!StringUtils.isEmpty(m.get(s1)))
                                k = k.add(new BigDecimal(m.get(s1).toString()));
                        }
                        f.set(this, k);
                        break;
                    case "date":
                        f.set(this, BreezeeUtils.DATE_FORMAT_SHORT.parse(m.get(ss[1]).toString()));
                        break;
                    case "boolean":
                        if (!StringUtils.isEmpty(m.get(ss[1]))) {
                            if (m.get(ss[1]).toString().equals("X"))
                                f.set(this, true);
                        }
                        break;
                    default:
                        StringBuilder ap = new StringBuilder();
                        for (String s1 : dd) {
                            if (!StringUtils.isEmpty(m.get(s1)))
                                ap.append(m.get(s1).toString());
                        }
                        if (ap.length() > 0)
                            f.set(this, ap.toString());
                }
                f.setAccessible(false);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        this.setSyncDate(new Date());
    }

    /**
     * 解析至sap对象
     *
     * @param rule
     * @param m
     */
    default void uSync(String rule, Map<String, Object> m) {
        Field f;
        String[] ff = rule.split(";"), ss;
        for (String s : ff) {
            ss = s.split("=");
            if (ss[0].equals("_")) {
                m.putIfAbsent(ss[1], "");
                continue;
            }
            if (ss[0].startsWith("`")) {
                m.putIfAbsent(ss[1], ss[0]);
                continue;
            }
            try {
                f = this.getClass().getDeclaredField(ss[0]);
                f.setAccessible(true);
                m.putIfAbsent(ss[1], f.get(this) == null ? "" : f.get(this));
                f.setAccessible(false);
            } catch (NoSuchFieldException | IllegalAccessException ignored) {
            }
        }
    }
}
