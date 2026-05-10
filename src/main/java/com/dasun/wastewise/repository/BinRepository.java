package com.dasun.wastewise.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dasun.wastewise.model.Bin;

@Repository
public interface BinRepository extends JpaRepository<Bin, Long> {
    
    Optional<Bin> findByDeviceId(String deviceId);
}
