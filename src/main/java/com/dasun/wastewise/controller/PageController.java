package com.dasun.wastewise.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    
    // index.html at localhost:8080/
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/manage-bins")
    public String manageBins() {
        return "manage/manage-bins";
    }
}
