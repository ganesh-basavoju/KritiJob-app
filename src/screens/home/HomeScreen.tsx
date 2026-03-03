
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { fetchJobFeed } from '../../redux/slices/jobsSlice';
import { LoginScreen } from '../auth/LoginScreen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Avatar } from '../../components/common/Avatar';
import { JobCard } from '../../components/jobs/JobCard';



export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { feedJobs, feedLoading } = useSelector((state: RootState) => state.jobs);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchJobFeed({ page: 1 }));
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [

      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {isAuthenticated ? `Welcome Back, ${user?.name}! 👋` : 'Welcome to KritiJob! 👋'}
            </Text>
            <Text style={styles.title}>
              {isAuthenticated ? 'Your Career Progress' : 'Your Dream Job Awaits'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationBtn}>
              <Icon name="notifications-outline" size={24} color={colors.primary} />
            </TouchableOpacity>

          </View>
        </View>



        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Connecting talent with opportunity, one click at a time ✨
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Jobs')}>
          <Icon name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>
            Search jobs, companies, skills...
          </Text>
        </TouchableOpacity>

        {/* Hero Banner or User Stats */}
        {
          isAuthenticated ? (
            <View style={styles.userStatsContainer}>
              {/* <View style={styles.userStatBox}>
                <Text style={styles.userStatNumber}>12</Text>
                <Text style={styles.userStatLabel}>Applied</Text>
              </View> */}


            </View>
          ) : (
            <View style={styles.heroBanner}>
              <View style={styles.heroContent}>
                <View style={styles.heroTag}>
                  <Icon name="trending-up" size={16} color={colors.white} />
                  <Text style={styles.heroTagText}>Career Growth Platform</Text>
                </View>
                <Text style={styles.heroTitle}>Unlock Your Career</Text>
                <Text style={styles.heroSubtitle}>Potential Today</Text>
                <Text style={styles.heroDescription}>
                  Join thousands of professionals who found their perfect role
                </Text>
                <View style={styles.heroFeatures}>
                  <View style={styles.featureItem}>
                    <Icon
                      name="checkmark-circle"
                      size={18}
                      color={colors.white}
                    />
                    <Text style={styles.featureText}>Resume tips and guidance</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon
                      name="checkmark-circle"
                      size={18}
                      color={colors.white}
                    />
                    <Text style={styles.featureText}>Plan your next career step</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon
                      name="checkmark-circle"
                      size={18}
                      color={colors.white}
                    />
                    <Text style={styles.featureText}>Personalized job recommendations</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.heroButton}
                  activeOpacity={0.8}
                  onPress={() => setLoginModalVisible(true)}>
                  <Text style={styles.heroButtonText}>Start Your Journey</Text>
                  <Icon name="arrow-forward" size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>

          )
        }

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="briefcase" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>15,00+</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="business" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>2,500+</Text>
            <Text style={styles.statLabel}>Top Companies</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="people" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>50,00+</Text>
            <Text style={styles.statLabel}>Success Stories</Text>
          </View>
        </View>


        {/* Featured Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Opportunities</Text>
              <Text style={styles.sectionSubtitle}>Handpicked roles just for you</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {feedLoading && feedJobs.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            feedJobs.slice(0, 5).map((job: any) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                onPress={() => navigation.navigate('Jobs', { screen: 'JobDetails', params: { id: job._id || job.id } })}
              />
            ))
          )}

        </View>


        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Trending Job Categories</Text>
              <Text style={styles.sectionSubtitle}>Discover roles that match your passion</Text>
            </View>
          </View>
          <View style={styles.categoryGrid}>
            {[
              { name: 'Technology', icon: 'code-slash', count: '2,400' },
              { name: 'Design', icon: 'color-palette', count: '890' },
              { name: 'Marketing', icon: 'megaphone', count: '1,250' },
              { name: 'Finance', icon: 'trending-up', count: '670' },
            ].map(category => (
              <TouchableOpacity key={category.name} style={styles.categoryCard}>
                <Icon name={category.icon} size={28} color={colors.primary} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} jobs</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Banner (Only for guests) */}
        {
          !isAuthenticated && (
            <View style={styles.ctaBanner}>
              <View style={styles.ctaIconRow}>
                <Icon name="rocket" size={32} color={colors.primary} />
              </View>
              <Text style={styles.ctaTitle}>Ready to Launch Your Career?</Text>
              <Text style={styles.ctaSubtitle}>
                Join 50,000+ professionals who found their dream job with us
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => setLoginModalVisible(true)}>
                <Text style={styles.ctaButtonText}>Create Free Account</Text>
                <Icon name="arrow-forward" size={18} color={colors.white} />
              </TouchableOpacity>
            </View>
          )
        }


        <View style={{ height: spacing.xl }} />
      </ScrollView >

      <LoginScreen
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        navigation={navigation}

      />
    </SafeAreaView>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationBtn: {
    padding: spacing.xs,
  },
  greeting: {

    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
    fontSize: 24,
  },
  taglineContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.body1,
    color: colors.textTertiary,
  },
  heroBanner: {
    backgroundColor: colors.navyDark,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  heroContent: {
    padding: spacing.xl,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: spacing.md,
  },
  heroTagText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.white,
    fontSize: 32,
    lineHeight: 38,
  },
  heroSubtitle: {
    ...typography.h1,
    color: colors.secondaryLight,
    fontSize: 32,
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  heroFeatures: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body2,
    color: colors.white,
    fontSize: 13,
  },
  heroButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  heroButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '700',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
    marginTop: spacing.sm,
    fontSize: 18,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginTop: spacing.xl * 1.5,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  seeAll: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '700',
  },
  jobCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  jobCardGlow: {
    borderColor: colors.glow,
    borderWidth: 1.5,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  jobCardHeader: {

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  jobCardInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  jobTitle: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 16,
  },
  newBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryDark,
  },
  jobCompany: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 20,
    width: '47.5%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  categoryCount: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 4,
  },
  ctaBanner: {
    backgroundColor: '#EEF2FF', // Very light blue
    marginHorizontal: spacing.md,
    marginTop: spacing.xl * 1.5,
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  ctaIconRow: {
    backgroundColor: '#DBEAFE',
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  ctaTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 24,
  },
  ctaSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '800',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
  },
  userStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  userStatBox: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  userStatNumber: {
    ...typography.h2,
    color: colors.primary,
    fontSize: 24,
  },
  userStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});


