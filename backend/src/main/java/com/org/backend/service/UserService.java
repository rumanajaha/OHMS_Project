package com.org.backend.service;

import com.org.backend.dto.CurrentUserDto;
import com.org.backend.dto.LoginRequestDto;
import com.org.backend.dto.LoginResponseDto;
import com.org.backend.entity.User;
import com.org.backend.enums.UserStatus;
import com.org.backend.repository.UserRepository;
import com.org.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDto login(LoginRequestDto request){

        User user = userRepository
                .findByUsername(request.username())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())){
            return new LoginResponseDto(
                    false,
                    "Invalid username or password",
                    null,
                    null
            );
        }

        if (user.getStatus() != UserStatus.ACTIVE){
            return new LoginResponseDto(
                    false,
                    "User account is not active",
                    null,
                    null
            );
        }

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(
                true,
                "Login success",
                token,
                mapUserToCurrentUserDto(user)
        );
    }

    private CurrentUserDto mapUserToCurrentUserDto(User user){
        return new CurrentUserDto(
                user.getId(),
                user.getEmployee().getId(),
                user.getUsername(),
                user.getEmployee().getFullName(),
                user.getEmployee().getEmail(),
                user.getEmployee().getPosition().getTitle(),
                user.getEmployee().getPosition().getDepartment().getName());
    }
}
