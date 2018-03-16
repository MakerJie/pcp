package com.pcp.conf;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pcp.common.util.BreezeeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;

/**
 * 环境配置
 * 拦截器
 * Created by Silence on 2017/6/22.
 */
@Configuration
public class WebEnvConfig extends WebMvcConfigurerAdapter {

    private final static Logger LOGGER = LoggerFactory.getLogger(WebEnvConfig.class);

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(new HandlerInterceptorAdapter() {

            /**
             * token的验证
             * @param request
             * @param response
             * @param handler
             * @return
             * @throws Exception
             */
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
                //TODO:做token验证，应该在request的header中设置相关的字段值
             /*   if (request.getServletPath().indexOf("/view") > -1) {
                    if (request.getServletPath().indexOf("/login") < 0 &&
                            request.getSession().getAttribute("curAccount") == null) {
                        response.sendRedirect(request.getContextPath() + "/view/login");
                    }
                }
                return super.preHandle(request, response, handler);*/
                return  true;
            }

            /**
             * 参数写入到界面中
             * @param request
             * @param response
             * @param handler
             * @param modelAndView
             * @throws Exception
             */
            @Override
            public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
//                Enumeration<String> enums = request.getParameterNames();
//                String key;
//                StringBuilder json = new StringBuilder("{");
//                int i = 0;
//                while (enums.hasMoreElements()) {
//                    key = enums.nextElement();
//                    request.setAttribute(key, request.getParameter(key));
//                    if (i > 0)
//                        json.append(",");
//                    json.append("\"").append(key).append("\":\"").append(request.getParameter(key)).append("\"");
//                    i++;
//                }
//                json.append("}");
//                LOGGER.info(json.toString());
//                request.setAttribute("paramJson", json.toString());
//                request.setAttribute("ctxPath", request.getContextPath());
//                request.setAttribute("thisPath", request.getServletPath());
            }
        }).addPathPatterns("/**");
    }

    @Bean
    public ObjectMapper objectMapper() {
        return BreezeeUtils.objectMapper;
    }
}
