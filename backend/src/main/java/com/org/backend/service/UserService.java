package com.org.backend.service;

import com.org.backend.dto.CurrentUserDto;
import com.org.backend.dto.LoginRequestDto;
import com.org.backend.dto.LoginResponseDto;
import com.org.backend.entity.User;
import com.org.backend.enums.UserStatus;
import com.org.backend.exception.ApiException;
import com.org.backend.exception.UnauthorizedException;
import com.org.backend.repository.UserRepository;
import com.org.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            throw new UnauthorizedException("Invalid username or password");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("Account status is not active");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponseDto(
                200,
                "Login success",
                token,
                mapUserToCurrentUserDto(user)
        );
    }

    public CurrentUserDto me(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "NOT_FOUND",
                        "User not found")
                );

        return mapUserToCurrentUserDto(user);
    }

    private CurrentUserDto mapUserToCurrentUserDto(User user){
        return new CurrentUserDto(
                user.getId(),
                user.getUserRole().toString(),
                user.getEmployee().getId(),
                user.getUsername(),
                user.getEmployee().getFullName(),
                user.getEmployee().getEmail(),
                user.getEmployee().getPosition().getTitle(),
                user.getEmployee().getPosition().getDepartment().getName());
    }
}
