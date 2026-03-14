import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: 'online' | 'offline';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${status === 'online' ? styles.online : styles.offline}`}>
      {status}
    </span>
  );
}
