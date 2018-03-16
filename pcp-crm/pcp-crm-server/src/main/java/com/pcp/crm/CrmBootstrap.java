package com.pcp.crm;

import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;

/**
 * 客户服务启动类
 * Created by Silence on 2017/6/30.
 */
@SpringBootApplication
@EnableEurekaClient
@ComponentScan({"com.pcp.common", "com.pcp.crm"})
@ImportResource(value = {"classpath:/crm-bean.xml"})
public class CrmBootstrap {

    /**
     * 服务启动
     *
     * @param args 启动参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(CrmBootstrap.class, args);
        ContextUtil.dumpStartupInfo();
    }
}
