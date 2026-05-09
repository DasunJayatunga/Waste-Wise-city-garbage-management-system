package com.dasun.wastewise.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dasun.wastewise.model.Bin;
import com.dasun.wastewise.repository.BinRepository;

@RestController
@RequestMapping("/api/bins")
@CrossOrigin
public class BinController {

    private final BinRepository binRepository;

    public BinController(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    @GetMapping
    public List<Bin> getAllBins() {
        return binRepository.findAll();
    }

    @PostMapping
    public Bin addBin(@RequestBody Bin newBin) {
        return binRepository.save(newBin);
    }

    @DeleteMapping("/{id}")
    public void deleteBin(@PathVariable Long id) {
        binRepository.deleteById(id);
    }
}
