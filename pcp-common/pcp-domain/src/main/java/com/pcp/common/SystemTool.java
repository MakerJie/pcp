/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common;

import com.pcp.common.domain.BaseInfo;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 与系统相关的一些常用工具方法
 * Created by Silence on 2016/6/1.
 */
public class SystemTool {

    private static InetAddress ia;

    private static Random random = new Random();

    static {
        try {
            ia = InetAddress.getLocalHost();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取当前操作系统名称
     * //可以直接使用Sun 的 SystemUtil
     * return 操作系统名称
     */
    public static String getOSName() {
        return System.getProperty("os.name").toLowerCase();
    }


    /**
     * 获取本地主机名
     *
     * @return 本机主机名
     */
    public static String getHostName() {
        return ia == null ? "unknownHost" : ia.getHostName();
    }

    /**
     * 本机IP地址
     *
     * @return 本机IP地址
     */
    public static String getIPAddress() {
        return ia == null ? "unknownIp" : ia.getHostAddress();
    }

    public static String uuid() {
        return UUID.randomUUID().toString();
    }

    public static String timeLine(int offset) {
        return LocalDateTime.now().toString().replaceAll("-", "").replaceAll(":", "").replaceAll("T", "").replaceAll("\\.", "").substring(offset);
    }

    public static String timeLine(int start, int offset) {
        return LocalDateTime.now().toString().replaceAll("-", "").replaceAll(":", "").replaceAll("T", "").replaceAll("\\.", "").substring(start, offset);
    }

    public static int stringValue(String s) {
        int sum = 0;
        for (char c : s.toCharArray()) {
            sum += (int) c;
        }
        return sum;
    }

    /**
     * 生成随机整数
     *
     * @param n   位数
     * @param ran 随机实例
     * @return 获取的结果
     * @throws IllegalArgumentException
     */
    public static String random(int n, Random ran) throws IllegalArgumentException {
        if (n < 1 || n > 10) {
            throw new IllegalArgumentException("cannot random " + n + " bit number");
        }
        if (ran == null)
            ran = new Random();
        if (n == 1) {
            return String.valueOf(ran.nextInt(10));
        }
        int bitField = 0;
        char[] chs = new char[n];
        for (int i = 0; i < n; i++) {
            while (true) {
                int k = ran.nextInt(10);
                if ((bitField & (1 << k)) == 0) {
                    bitField |= 1 << k;
                    chs[i] = (char) (k + '0');
                    break;
                }
            }
        }
        return new String(chs);
    }

    public static String captureName(String name) {
        char[] cs=name.toCharArray();
        cs[0]+=32;
        return String.valueOf(cs);
    }

    public static String getCode(){
        return System.nanoTime()+String.format("%03d",random.nextInt(100));
    }

    public static void main(String[] args) {
        System.out.println(uuid().replaceAll("-",""));
        System.out.println(System.nanoTime());
        LocalDate ldn = LocalDate.now();
        ldn = ldn.plusDays(6);
        System.out.println(ldn.getDayOfWeek().getValue());
        String[] ss = "2/3".split("/");
        System.out.println(ss.length+".."+ss[0]);
    }
}
