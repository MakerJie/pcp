/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.data;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pcp.common.util.ContextUtil;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 查询条件的解析与获取
 *
 * @author Silence
 */
public final class DynamicSpecifications {

    /**
     * 生成查询条件
     *
     * @param map
     * @param <T>
     * @return
     */
    public static <T> Specification<T> createSpecification(final Map<String, Object> map) {
        map.remove("pageNumber");
        map.remove("pageSize");
        map.remove("updator");
        map.remove("properties");
        return (root, query, cb) -> {
            List<Predicate> predicate = new ArrayList<>();
            map.forEach((key, val) -> {
                if ((!key.startsWith("_")) && val != null && StringUtils.hasText(val.toString())) {
                    if (key.endsWith("_between")) {
                        String[] ss = val.toString().split(",");
                        predicate.add(cb.between(root.get(key.substring(0, (key.length() - 8))), ss[0], ss[1]));
                    } else if (key.endsWith("_or")) {
                        Predicate[] ps = new Predicate[val.toString().split(",").length];
                        int i = 0;
                        for (String s : val.toString().split(",")) {
                            if (StringUtils.hasText(s)) {
                                ps[i] = cb.like(root.get(key.substring(0, (key.length() - 3))).as(String.class), "%" + s.trim() + "%");
                            }
                            i++;
                        }
                        predicate.add(cb.or(ps));
                    } else if (key.endsWith("_or_attr")) { //code$sapOrder_or_attr:222222
                        String[] ss = key.substring(0, (key.length() - 8)).split("\\$");
                        Predicate[] ps = new Predicate[ss.length];
                        int i = 0;
                        for (String s : ss) {
                            ps[i] = cb.like(root.get(s), "%" + val.toString() + "%");
                            i++;
                        }
                        predicate.add(cb.or(ps));
                    } else if (key.endsWith("_or_obj_ae_attr")) { //code$sapOrder_or_attr:222222
                        String[] sss = key.substring(0, (key.length() - 15)).split("_");
                        String[] ss = sss[1].split("\\$");
                        Predicate[] ps = new Predicate[ss.length];
                        int i = 0;
                        for (String s : ss) {
                            ps[i] = cb.like(root.get(sss[0]).get(s).as(String.class), "%" + val.toString() + "%");
                            i++;
                        }
                        predicate.add(cb.or(ps));
                    } else if (key.endsWith("_gt")) {
                        if (val instanceof Timestamp) {
                            predicate.add(cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Timestamp.class), (Timestamp) val));
                        } else if (val instanceof Date) {
                            predicate.add(cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Date.class), (Date) val));
                        } else if (val instanceof Number) {
                            predicate.add(cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Float.class), Float.parseFloat(val.toString())));
                        } else {
                            predicate.add(cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(String.class), val.toString()));
                        }
                    } else if (key.endsWith("_gt_null")) {
                        Predicate[] ps = new Predicate[2];
                        if (val instanceof Date) {
                            ps[0] = cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 8))).as(Date.class), (Date) val);
                        } else {
                            ps[0] = cb.greaterThanOrEqualTo(root.get(key.substring(0, (key.length() - 8))).as(String.class), val.toString());
                        }
                        ps[1] = cb.isNull(root.get(key.substring(0, (key.length() - 8))));
                        predicate.add(cb.or(ps));
                    } else if (key.endsWith("_le")) {
                        if (val instanceof Timestamp)
                            predicate.add(cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Timestamp.class), (Timestamp) val));
                        else if (val instanceof Date)
                            predicate.add(cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Date.class), (Date) val));
                        else if (val instanceof Number)
                            predicate.add(cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(Float.class), Float.parseFloat(val.toString())));
                        else
                            predicate.add(cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 3))).as(String.class), val.toString()));
                    } else if (key.endsWith("_le_null")) {
                        Predicate[] ps = new Predicate[2];
                        if (val instanceof Date) {
                            ps[0] = cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 8))).as(Date.class), (Date) val);
                        } else {
                            ps[0] = cb.lessThanOrEqualTo(root.get(key.substring(0, (key.length() - 8))).as(String.class), val.toString());
                        }
                        ps[1] = cb.isNull(root.get(key.substring(0, (key.length() - 8))));
                        predicate.add(cb.or(ps));
                    } else if (key.endsWith("_like")) {
                        predicate.add(cb.like(root.get(key.substring(0, (key.length() - 5))).as(String.class), "%" + val.toString() + "%"));
                    } else if (key.endsWith("_in")) {
                        CriteriaBuilder.In in = cb.in(root.get(key.substring(0, (key.length() - 3))));
                        boolean flag = false;
                        if (val instanceof List) {
                            List<Object> l = (List<Object>) val;
                            for (Object o : l) {
                                if (o != null) {
                                    in.value(o);
                                    flag = true;
                                }
                            }
                        } else {
                            for (String s : val.toString().split(",")) {
                                if (s.trim().length() > 0) {
                                    in.value(s);
                                    flag = true;
                                }
                            }
                        }
                        if (flag) {
                            predicate.add(in);
                        }
                    } else if (key.endsWith("_notin")) {
                        if (val instanceof List) {
                            ((List) val).forEach(v -> {
                                predicate.add(cb.notEqual(root.get(key.substring(0, (key.length() - 6))).as(v.getClass()), v));
                            });
                        } else if (val instanceof String) {
                            for (String s : ((String) val).split(",")) {
                                predicate.add(cb.notEqual(root.get(key.substring(0, (key.length() - 6))).as(s.getClass()), s));
                            }
                        }
                    } else if (key.endsWith("_obj")) {
                        try {
                            ObjectMapper objectMapper = ContextUtil.getBean("objectMapper", ObjectMapper.class);
                            if (objectMapper == null)
                                objectMapper = new ObjectMapper();
                            String k = key.substring(0, (key.length() - 4));
                            if (val.toString().equals("-1")) {
                                predicate.add(cb.isNull(root.get(k).as(root.getModel().getAttribute(k).getJavaType())));
                            } else {
                                Object v = objectMapper.readValue("{\"id\":\"" + val.toString() + "\"}", root.getModel().getAttribute(k).getJavaType());
                                predicate.add(cb.equal(root.get(k).as(v.getClass()), v));
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (key.endsWith("_obj_not")) {
                        try {
                            ObjectMapper objectMapper = ContextUtil.getBean("objectMapper", ObjectMapper.class);
                            if (objectMapper == null)
                                objectMapper = new ObjectMapper();
                            String k = key.substring(0, (key.length() - 8));
                            Object v = objectMapper.readValue("{\"id\":\"" + val.toString() + "\"}", root.getModel().getAttribute(k).getJavaType());
                            predicate.add(cb.or(cb.notEqual(root.get(k).as(v.getClass()), v), cb.isNull(root.get(k).as(root.getModel().getAttribute(k).getJavaType()))));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (key.endsWith("_of")) {
                        predicate.add(cb.isMember(val, root.get(key.substring(0, (key.length() - 3)))));
                    } else if (key.endsWith("_of_not")) {
                        predicate.add(cb.isNotMember(val, root.get(key.substring(0, (key.length() - 7)))));
                    } else if (key.endsWith("_obj_attr")) { //value is like: -id-_-aa-,-brand-_-bb-
                        try {
                            ObjectMapper objectMapper = ContextUtil.getBean("objectMapper", ObjectMapper.class);
                            if (objectMapper == null)
                                objectMapper = new ObjectMapper();
                            String k = key.substring(0, (key.length() - 9));
                            Object v = objectMapper.readValue("{" + val.toString().replaceAll("-", "\"").replaceAll("_", ":") + "}", root.getModel().getAttribute(k).getJavaType());
                            predicate.add(cb.equal(root.get(k).as(v.getClass()), v));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (key.endsWith("_obj_ae")) { //entity_id_obj_ae:22, attribute element
                        String k = key.substring(0, (key.length() - 7));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            predicate.add(cb.equal(root.get(ss[0]).get(ss[1]).as(val.getClass()), val));
                        }
                    } else if (key.endsWith("_obj_not_ae")) { //entity_id_obj_ae_like:22
                        String k = key.substring(0, (key.length() - 11));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            predicate.add(cb.notEqual(root.get(ss[0]).get(ss[1]).as(val.getClass()), val));
                        }
                    } else if (key.endsWith("_obj_like_ae")) { //entity_id_obj_ae_like:22
                        String k = key.substring(0, (key.length() - 12));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            predicate.add(cb.like(root.get(ss[0]).get(ss[1]).as(String.class), "%" + val.toString() + "%"));
                        }
                    } else if (key.endsWith("_obj_gt_ae")) { //entity_id_obj_ae_like:22
                        String k = key.substring(0, (key.length() - 10));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            if (val instanceof Date) {
                                predicate.add(cb.greaterThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(Date.class), (Date) val));
                            } else if (val instanceof Number) {
                                predicate.add(cb.greaterThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(Double.class), Double.parseDouble(val.toString())));
                            } else {
                                predicate.add(cb.greaterThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(String.class), val.toString()));
                            }
                        }
                    } else if (key.endsWith("_obj_le_ae")) { //entity_id_obj_ae_like:22
                        String k = key.substring(0, (key.length() - 10));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            if (val instanceof Date) {
                                predicate.add(cb.lessThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(Date.class), (Date) val));
                            } else if (val instanceof Number) {
                                predicate.add(cb.lessThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(Double.class), Double.parseDouble(val.toString())));
                            } else {
                                predicate.add(cb.lessThanOrEqualTo(root.get(ss[0]).get(ss[1]).as(String.class), val.toString()));
                            }
                        }
                    } else if (key.endsWith("_obj_in_ae")) { //entity_id_obj_in_ae:22
                        String k = key.substring(0, (key.length() - 10));
                        String[] ss = k.split("_");
                        if (ss.length == 2) {
                            CriteriaBuilder.In in = cb.in(root.get(ss[0]).get(ss[1]));
                            for (String s : val.toString().split(",")) {
                                in.value(s);
                            }
                            predicate.add(in);
                        }
                    } else if (key.endsWith("_not_equal")) {
                        try {
                            predicate.add(cb.notEqual(root.get(key.substring(0, (key.length() - 10))).as(val.getClass()), val));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (key.endsWith("_not_equal_andnull")) {
                        try {
                            Predicate[] ps = new Predicate[2];
                            ps[0] = cb.notEqual(root.get(key.substring(0, (key.length() - 18))).as(val.getClass()), val);
                            ps[1] = cb.isNull(root.get(key.substring(0, (key.length() - 18))));
                            predicate.add(cb.or(ps));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        try {
                            predicate.add(cb.equal(root.get(key).as(val.getClass()), val));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            });
            Predicate[] pre = new Predicate[predicate.size()];
            return query.distinct(true).where(predicate.toArray(pre)).getRestriction();
        };
    }

}
