package com.mine.application.user.command.domain.user;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public InitializingBean passwordConverterInitializer() {
        return () -> PasswordConverter.setPasswordEncoder(bCryptPasswordEncoder());
    }

    @Bean
    public InitializingBean passwordMatcherInitializer() {
        return () -> PasswordMatcher.setPasswordEncoder(bCryptPasswordEncoder());
    }
}
