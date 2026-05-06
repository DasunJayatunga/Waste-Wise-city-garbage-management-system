package com.dasun.wastewise.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bins")
public class Bin {

    // Bin attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long binId;

    @Column(nullable = true)
    private String deviceId;
    private double longitude;
    private double latitude;
    private int fillLevel;

    // Default constructor
    public Bin() {}

    // Parameterized constructor
    public Bin(Long binId, String deviceId, double longitude, double latitude, int fillLevel) {
        this.binId = binId;
        this.deviceId = deviceId;
        this.longitude = longitude;
        this.latitude = latitude;
        this.fillLevel = fillLevel;
    }

    // Getters and setters
    public Long getBinId() { return binId; }
    public void setBinId(Long binId) { this.binId = binId; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public int getFillLevel() { return fillLevel; }
    public void setFillLevel(int fillLevel) { this.fillLevel = fillLevel; }
}
