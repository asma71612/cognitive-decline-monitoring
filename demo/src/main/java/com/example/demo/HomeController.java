package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HomeController {

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
}
