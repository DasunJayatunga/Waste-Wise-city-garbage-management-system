package com.dasun.wastewise.controller;

import com.dasun.wastewise.model.Bin;
import com.dasun.wastewise.repository.BinRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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