// ============================================
// NOTIFICATIONS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../redux/slices/notificationsSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {Button} from '../../components/common/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Notification} from '../../types';
import {formatRelativeTime} from '../../utils/dateFormatter';

export const NotificationsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {notifications, loading, unreadCount} = useSelector(
    (state: RootState) => state.notifications,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    await dispatch(fetchNotifications(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    const notificationId = (notification as any)._id || notification.id;
    
    // Mark as read
    if (!notification.read) {
      await dispatch(markAsRead(notificationId));
    }

    // Navigate based on notification type
    const notificationType = (notification as any).type;
    const actionData = (notification as any).actionData || (notification as any).data || {};
    
    if (notificationType === 'job_alert') {
      // Navigate to Job Details
      const jobId = actionData.jobId || actionData.job_id;
      if (jobId) {
        navigation.navigate('Jobs', {
          screen: 'JobDetails',
          params: { jobId }
        });
      }
    } else if (notificationType === 'application_status') {
      // Navigate to Application Details
      const applicationId = actionData.applicationId || actionData.application_id;
      if (applicationId) {
        // Fetch application data if needed
        navigation.navigate('Applications', {
          screen: 'ApplicationDetails',
          params: { application: actionData }
        });
      }
    } else if (notificationType === 'new_applicant') {
      // Navigate to Candidate Profile (for employer)
      const candidateId = actionData.candidateId || actionData.candidate_id;
      const applicationId = actionData.applicationId || actionData.application_id;
      if (candidateId) {
        navigation.navigate('CandidateProfile', {
          candidateId,
          applicationId
        });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteNotification(id));
  };

  const renderNotification = ({item}: {item: Notification}) => {
    const notificationId = (item as any)._id || item.id;
    const isUnread = !item.read;
    
    return (
      <TouchableOpacity
        style={[styles.card, isUnread && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}>
        <View style={styles.cardContent}>
          {isUnread && <View style={styles.unreadDot} />}
          <View style={styles.titleRow}>
            <Text style={[styles.title, isUnread && styles.unreadTitle]}>
              {item.title}
            </Text>
          </View>
          <Text style={[styles.body, isUnread && styles.unreadBody]}>
            {item.body}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDelete(notificationId);
          }}>
          <Icon name="close-circle" size={24} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {unreadCount > 0 && (
        <Button
          title={`Mark All as Read (${unreadCount})`}
          onPress={handleMarkAllAsRead}
          variant="secondary"
          style={styles.markAllButton}
        />
      )}
    </View>
  );

  if (loading && notifications.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => {
          const id = (item as any)._id || item.id;
          return id ? `notification-${id}` : `notification-idx-${index}`;
        }}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No notifications"
            message="You're all caught up!"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  markAllButton: {
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.md,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow,
    backgroundColor: colors.card,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h6,
    color: colors.textPrimary,
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  body: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  unreadBody: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  deleteText: {
    ...typography.h6,
    color: colors.textSecondary,
  },
});
