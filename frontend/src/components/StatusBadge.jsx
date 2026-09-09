import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();

  const map = {
    PENDING: { label: t('status_pending') || 'Pending', cls: 'badge-pending' },
    ASSIGNED: { label: t('status_assigned') || 'Assigned', cls: 'badge-assigned' },
    PICKUP_STARTED: { label: t('status_pickup_started') || 'Pickup Started', cls: 'badge-started' },
    PICKED_UP: { label: t('status_picked_up') || 'Picked Up', cls: 'badge-picked' },
    DELIVERED: { label: t('status_delivered') || 'Delivered', cls: 'badge-delivered' },
    CANCELLED: { label: t('status_cancelled') || 'Cancelled', cls: 'badge-cancelled' },
    PLANNED: { label: t('status_planned') || 'Planned', cls: 'badge-planned' },
    STARTED: { label: t('status_started') || 'Started', cls: 'badge-started' },
    IN_PROGRESS: { label: t('status_in_progress') || 'In Progress', cls: 'badge-started' },
    COMPLETED: { label: t('status_completed') || 'Completed', cls: 'badge-completed' },
    ON_ROUTE: { label: t('status_on_route') || 'On Route', cls: 'badge-started' },
    AVAILABLE: { label: t('status_available') || 'Available', cls: 'badge-completed' },
    MAINTENANCE: { label: t('status_maintenance') || 'Maintenance', cls: 'badge-cancelled' },
  };

  const info = map[status] || { label: status, cls: 'badge-pending' };

  return <span className={`badge ${info.cls}`}>{info.label}</span>;
}
