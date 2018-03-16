package com.pcp;

import com.pcp.common.RestSender;
import com.pcp.common.util.ContextUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.core.env.Environment;

import java.time.LocalDateTime;

/**
 * Facade服务启动
 * Created by Silence on 2016/10/11.
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@ComponentScan("com.pcp")
@ImportResource(value = {"classpath:/facade-bean.xml"})
public class FacadeBootstrap {

    /**
     * 启动方法
     *
     * @param args 参数
     */
    public static void main(String[] args) {
        ContextUtil.current = SpringApplication.run(FacadeBootstrap.class, args);
        Environment environment = ContextUtil.current.getBean("environment", Environment.class);
        RestSender.setUri(environment.getProperty("sap.protocol") + environment.getProperty("sap.host") + ":" + environment.getProperty("sap.port") + environment.getProperty("sap.path"));
        RestSender.setToken(environment.getProperty("sap.token",""));
        ContextUtil.dumpStartupInfo();
    }
}
