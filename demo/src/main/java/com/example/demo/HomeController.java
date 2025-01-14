package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.UserCodeService;

@RestController
@RequestMapping("/api")
public class HomeController {

    @Autowired
    private UserCodeService userCodeService;

    @GetMapping("/home")
    public String getHomeLandingPage() {
        return "Home Landing Page";
    }

    @GetMapping("/lighting")
    public String getLightingCalibration() {
        return "Welcome to The Game!";
    }

    @GetMapping("/calibration")
    public String getCalibrationPage() {
        return "Calibration Page: Ready to Start!";
    }

    @PostMapping("/addUserCode")
    public String addUserCode(@RequestBody String userCode) {
        return userCodeService.addUserCode(userCode);
    }

    @PostMapping("/validateUserCode")
    public boolean validateUserCode(@RequestBody String userCode) {
        return userCodeService.validateUserCode(userCode);
    }
}
