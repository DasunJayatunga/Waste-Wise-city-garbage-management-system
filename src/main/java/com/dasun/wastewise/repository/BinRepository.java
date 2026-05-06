package com.dasun.wastewise.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dasun.wastewise.model.Bin;

@Repository
public interface BinRepository extends JpaRepository<Bin, Long> {
    // No custom methods needed – all are covered by JpaRepository
}
