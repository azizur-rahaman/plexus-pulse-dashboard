'use client';

import { useState, useEffect } from 'react';
import DeviceCard, { Device } from '../components/DeviceCard';
import { login, getDevices, updateDeviceStatus } from '../lib/api';
import styles from './page.module.css';

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Auto-login with mock credentials for convenience
  useEffect(() => {
    const init = async () => {
      try {
        const data = await login();
        setToken(data.token);
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchDevices = async () => {
      try {
        const data = await getDevices(token);
        setDevices(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [token]);

  const handleStatusChange = async (id: string, newStatus: 'online' | 'offline') => {
    if (!token) return;

    try {
      const updatedDevice = await updateDeviceStatus(token, id, newStatus);
      setDevices(prev => prev.map(d => d.id === id ? updatedDevice : d));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) return <div className={styles.loading}>Connecting to Plexus Pulse...</div>;
  if (error && !token) return <div className={styles.errorContainer}><p className={styles.error}>{error}</p><button className="button button-primary" onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Plexus Pulse Dashboard</h1>
            <p className={styles.subtitle}>Connected to Render Production API</p>
          </div>
          <div className={styles.statsOverview}>
            <div className={styles.overviewItem}>
              <span className={styles.overviewLabel}>Active Devices</span>
              <span className={styles.overviewValue}>{devices.filter(d => d.status === 'online').length}</span>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.overviewLabel}>System Status</span>
              <span className={`${styles.overviewValue} ${styles.operational}`}>Operational</span>
            </div>
          </div>
        </div>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <section className={styles.deviceSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Connected Devices</h2>
        </div>

        <div className={styles.deviceGrid}>
          {devices.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onStatusChange={handleStatusChange} 
            />
          ))}
        </div>
      </section>
    </main>
  );
}
