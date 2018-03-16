/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

package com.pcp.common.data;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.pcp.common.util.BreezeeUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.text.SimpleDateFormat;
import java.util.TimeZone;

/**
 * 环境变量设置
 * Created by Silence on 2016/2/9.
 */
@Configuration
@ImportResource(value = {"classpath:/bean/bre-datasource.xml"})
public class EnvConfiguration implements InitializingBean {

    @Bean
    public MessageSource messageSource() {
        return new ResourceBundleMessageSource();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return BreezeeUtils.objectMapper;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.setProperty("user.timezone", "Asia/Shanghai");
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
        System.out.println("user.timezone--->Asia/Shanghai");
    }
}
