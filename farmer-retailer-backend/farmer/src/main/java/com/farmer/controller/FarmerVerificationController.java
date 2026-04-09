package com.farmer.controller;

import com.farmer.entity.User;
import com.farmer.entity.VerificationStatus;
import com.farmer.repository.UserRepository;
import com.farmer.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/farmer/verification")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerVerificationController {

    private final UserRepository userRepository;
    private final FileStorageService fileService;

    public FarmerVerificationController(UserRepository userRepository,
                                        FileStorageService fileService) {
        this.userRepository = userRepository;
        this.fileService = fileService;
    }

    @PostMapping("/submit")
    public User submit(
            @RequestParam String aadharNumber,
            @RequestParam String panNumber,
            @RequestParam MultipartFile aadharFile,
            @RequestParam MultipartFile panFile
    ) throws Exception {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        user.setAadharNumber(aadharNumber);
        user.setPanNumber(panNumber);

        user.setAadharImage(fileService.save(aadharFile));
        user.setPanImage(fileService.save(panFile));

        user.setVerificationStatus(VerificationStatus.PENDING);
        user.setRejectionReason(null);

        return userRepository.save(user);
    }
}
