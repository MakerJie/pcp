/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.pcp.common.domain.DiffInfo;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.money.CurrencyUnit;
import javax.money.MonetaryCurrencies;
import javax.money.format.MonetaryAmountFormat;
import javax.money.format.MonetaryFormats;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

/**
 * 项目中需要使用的一些工具类
 * Created by Silence on 2016/6/2.
 */
public final class BreezeeUtils {

    public final static SimpleDateFormat DATE_FORMAT_LONG = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public final static SimpleDateFormat DATE_FORMAT_SHORT = new SimpleDateFormat("yyyy-MM-dd");
    public final static SimpleDateFormat DATE_FORMAT_SHORT_SIMPLE = new SimpleDateFormat("yyyyMMdd");
    public final static CurrencyUnit CNY = MonetaryCurrencies.getCurrency("CNY");
    public final static MonetaryAmountFormat CNY_FORMAT = MonetaryFormats.getAmountFormat(Locale.CHINA);

    public final static ObjectMapper objectMapper = new ObjectMapper();

    //TODO:通过RestTemplateBuilder来初始化，然后设置例如超时时间之类的属性
    public final static RestTemplate restTemplate;

    static {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setDateFormat(DATE_FORMAT_LONG);

        HttpComponentsClientHttpRequestFactory httpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        httpRequestFactory.setConnectionRequestTimeout(120000);
        httpRequestFactory.setConnectTimeout(120000);
        httpRequestFactory.setReadTimeout(120000);

        restTemplate = new RestTemplate(httpRequestFactory);
    }

    /**
     * 加密字符串
     *
     * @param s 需要加密字符串
     * @return 加密后的结果
     */
    public static String enCrypt(String s) {
        return s;
    }

    /**
     * 解密字符串
     *
     * @param s 需要解密的字符串
     * @return 解密后的结果
     */
    public static String deCrypt(String s) {
        return s;
    }

    /**
     * 对象的比较，获取属性的不同
     *
     * @param o1 比较对象1
     * @param o2 比较对象
     * @return 结果
     */
    public static Object objectDiff(Object o1, Object o2, String ignore) throws RuntimeException {
        Objects.requireNonNull(o1);
        Objects.requireNonNull(o2);
        try {
            if (o1.getClass().getName().equals(o2.getClass().getName())) {
                List<Field> fields = new ArrayList<>();
                List<DiffInfo> l = new ArrayList<>();
                Class cla = o1.getClass();
                while (cla != null) {
                    fields.addAll(Arrays.asList(cla.getDeclaredFields()));
                    cla = cla.getSuperclass();
                }
                Object f1, f2;
                for (Field field : fields) {
                    if (ignore.contains(field.getName()))
                        continue;
                    field.setAccessible(true);
                    f1 = (field.get(o1) + "").replaceAll("null", "");
                    f2 = (field.get(o2) + "").replaceAll("null", "");
                    if (!f1.equals(f2)) {
                        l.add(new DiffInfo(field.getName(), f1, f2));
                    }
                    field.setAccessible(false);
                }
                return l;
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return o1;
    }

    /**
     * string转为数字数组
     *
     * @param s 数组
     * @return 结果
     */
    public static Long[] covertToLong(String[] s) {
        if (s == null || s.length == 0) {
            return null;
        }
        Long[] last = new Long[s.length];
        int i = 0;
        for (String a : s) {
            last[i] = Long.parseLong(a);
            i++;
        }
        return last;
    }

    public static List<String> getIgnoreProperties(Object srcObject, Object destObject) {
        Class<?> clazz = srcObject.getClass();
        Field[] fields = clazz.getDeclaredFields();
        List<String> properties = new ArrayList<>();
        for (Field field : fields) {
            String property = field.getName();
            try {
                Method method = clazz.getMethod("get" + property.substring(0, 1).toUpperCase() + property.substring(1));
                Object targetO = method.invoke(destObject);
                if (targetO == null) {
                    properties.add(property);
                    continue;
                }
                Object srcO = method.invoke(srcObject);
                if (srcO == targetO || (srcO.toString().equals(targetO.toString()))) {
                    properties.add(property);
                }
            } catch (Exception ignored) {
            }
        }
        return properties;
    }

    public static <T> T mapToBean(T dest, Map<String, Object> m) {
        if (dest != null) {
            Field[] fs = dest.getClass().getDeclaredFields();
            for (Field f : fs) {
                f.setAccessible(true);
                try {
                    f.set(dest, m.get(f.getName()));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
                f.setAccessible(false);
            }
        }
        return dest;
    }

    public static long betweenDays(String a, String b) {
        if (a != null && a.length() == 8 && b != null && b.length() == 8) {
            LocalDate aa = LocalDate.of(Integer.parseInt(a.substring(0, 4)), Integer.parseInt(a.substring(4, 6)), Integer.parseInt(a.substring(6)));
            LocalDate bb = LocalDate.of(Integer.parseInt(b.substring(0, 4)), Integer.parseInt(b.substring(4, 6)), Integer.parseInt(b.substring(6)));
            return bb.toEpochDay() - aa.toEpochDay();
        }
        return -1;
    }

    public static String json2string(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 处理时间查询条件
     *
     * @param m
     */
    public static void checkCreateTime(Map<String, Object> m, String name) {
        Object gt = m.get(name + "_gt");
        Object le = m.get(name + "_le");
        try {
            if (!StringUtils.isEmpty(gt)) {
                m.put(name + "_gt", BreezeeUtils.DATE_FORMAT_LONG.parse(gt + " 00:00:00"));
            }
            if (!StringUtils.isEmpty(le)) {
                m.put(name + "_le", BreezeeUtils.DATE_FORMAT_LONG.parse(le + " 23:59:59"));
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    /**
     * 解析数字
     *
     * @param obj
     * @return
     */
    public static Double checkDouble(Object obj) {
        if (obj == null)
            return 0d;
        try {
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return 0.0;
    }

    public static LocalDate date2LocalDate(Date date) {
        if (date == null) {
            return LocalDate.now();
        }
        Instant instant = date.toInstant();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        return localDateTime.toLocalDate();
    }

    public static LocalDateTime date2LocalDateTime(Date date) {
        if (date == null) {
            return LocalDateTime.now();
        }
        Instant instant = date.toInstant();
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public static Date localDateTime2Date(LocalDateTime localDateTime){
        Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
        return Date.from(instant);
    }
}
