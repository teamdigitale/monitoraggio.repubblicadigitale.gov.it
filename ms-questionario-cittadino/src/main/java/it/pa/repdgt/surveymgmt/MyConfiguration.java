package it.pa.repdgt.surveymgmt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class MyConfiguration implements WebMvcConfigurer {
    @Autowired
    private LogReqResInterceptor logReqResInterceptor;
 
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logReqResInterceptor);
    }
}