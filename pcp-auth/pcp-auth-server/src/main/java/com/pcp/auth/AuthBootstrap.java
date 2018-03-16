package com.pcp.auth;

import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * 客户服务启动类
 * Created by Silence on 2017/6/30.
 */
@SpringBootApplication
@EnableEurekaClient
@ComponentScan({"com.pcp.common", "com.pcp.auth"})
public class AuthBootstrap {

    /**
     * 服务启动
     *
     * @param args 启动参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(AuthBootstrap.class, args);
    }
}
