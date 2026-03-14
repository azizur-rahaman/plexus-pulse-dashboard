'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';
import styles from './DeviceCard.module.css';

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  location: string;
  status: 'online' | 'offline';
  lastPing: string;
  cpuUsage: number;
  memoryUsage: number;
}

interface DeviceCardProps {
  device: Device;
  onStatusChange: (id: string, newStatus: 'online' | 'offline') => Promise<void>;
}

export default function DeviceCard({ device, onStatusChange }: DeviceCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const newStatus = device.status === 'online' ? 'offline' : 'online';
    setIsUpdating(true);
    try {
      await onStatusChange(device.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.name}>{device.name}</h3>
          <p className={styles.location}>{device.location}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>IP Address</span>
          <span className={styles.statValue}>{device.ipAddress}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>CPU Usage</span>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${device.cpuUsage}%`, backgroundColor: device.cpuUsage > 80 ? 'var(--error)' : 'var(--primary)' }}
            />
          </div>
          <span className={styles.statValue}>{device.cpuUsage}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Memory</span>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${device.memoryUsage}%`, backgroundColor: device.memoryUsage > 80 ? 'var(--error)' : 'var(--accent)' }}
            />
          </div>
          <span className={styles.statValue}>{device.memoryUsage}%</span>
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={`${styles.toggleButton} ${device.status === 'online' ? styles.onlineBtn : styles.offlineBtn}`}
          onClick={handleToggle}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : `Set ${device.status === 'online' ? 'Offline' : 'Online'}`}
        </button>
      </div>
    </div>
  );
}
