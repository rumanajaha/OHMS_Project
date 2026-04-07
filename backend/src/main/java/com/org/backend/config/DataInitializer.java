package com.org.backend.config;

import com.org.backend.entity.Employee;
import com.org.backend.entity.Role;
import com.org.backend.entity.User;
import com.org.backend.repository.EmployeeRepository;
import com.org.backend.repository.RoleRepository;
import com.org.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initAdminUser(){
        return args -> {

            if(userRepository.count() > 0) return;

            Employee adminEmployee = employeeRepository
                    .findById(1L)
                    .orElseThrow(()-> new IllegalArgumentException("No admin employee found"));

            User user = new User();
            user.setUsername("admin");
            user.setPasswordHash(passwordEncoder.encode(adminPassword));
            user.setEmployee(adminEmployee);
            user = userRepository.save(user);

            Role adminRole = roleRepository
                    .findById(1L)
                    .orElseThrow(()-> new IllegalArgumentException("No admin role found"));

            user.getRoles().add(adminRole);
            userRepository.save(user);

            System.out.println("Admin user created");
        };
    }
}
