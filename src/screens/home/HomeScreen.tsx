// screens/home/HomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

// Avatar Component
const Avatar: React.FC<{name: string; size?: number}> = ({
  name,
  size = 40,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[colorIndex],
        },
      ]}>
      <Text style={[styles.avatarText, {fontSize: size * 0.4}]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

// Job Card Component
const JobCard: React.FC<{
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}> = ({title, company, location, type, salary}) => (
  <TouchableOpacity style={styles.jobCard}>
    <View style={styles.jobCardHeader}>
      <Avatar name={company} size={48} />
      <View style={styles.jobCardInfo}>
        <Text style={styles.jobTitle}>{title}</Text>
        <Text style={styles.jobCompany}>{company}</Text>
      </View>
      <Icon name="bookmark-outline" size={22} color={colors.textSecondary} />
    </View>
    <View style={styles.jobDetails}>
      <View style={styles.jobDetailItem}>
        <Icon name="location-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.jobDetailText}>{location}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <Icon name="briefcase-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.jobDetailText}>{type}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <Icon name="cash-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.jobDetailText}>{salary}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Success Story Component
const SuccessStory: React.FC<{name: string; role: string; quote: string}> = ({
  name,
  role,
  quote,
}) => (
  <View style={styles.storyCard}>
    <View style={styles.storyHeader}>
      <Avatar name={name} size={44} />
      <View style={styles.storyInfo}>
        <Text style={styles.storyName}>{name}</Text>
        <Text style={styles.storyRole}>{role}</Text>
      </View>
    </View>
    <Text style={styles.storyQuote}>"{quote}"</Text>
  </View>
);

export const HomeScreen: React.FC<any> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.title}>Find Your Dream Job</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color={colors.yellow} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}>
          <Icon name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>
            Search jobs, companies...
          </Text>
          <Icon name="options-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Take charge of your career</Text>
            <Text style={styles.heroSubtitle}>with confidence</Text>
            <View style={styles.heroFeatures}>
              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Resume tips and guidance</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Plan your next career step</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.featureText}>Get expert advice</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.heroButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="briefcase" size={24} color={colors.yellow} />
            <Text style={styles.statNumber}>5,000+</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="business" size={24} color={colors.yellow} />
            <Text style={styles.statNumber}>1,200+</Text>
            <Text style={styles.statLabel}>Companies</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="people" size={24} color={colors.yellow} />
            <Text style={styles.statNumber}>10,000+</Text>
            <Text style={styles.statLabel}>Hired</Text>
          </View>
        </View>

        {/* Explore Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore jobs by top companies</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}>
            {['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'].map(company => (
              <TouchableOpacity key={company} style={styles.companyCard}>
                <Avatar name={company} size={56} />
                <Text style={styles.companyName}>{company}</Text>
                <Text style={styles.companyJobs}>120+ jobs</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <JobCard
            title="Senior Product Designer"
            company="Google"
            location="Remote"
            type="Full-time"
            salary="$120k - $180k"
          />
          <JobCard
            title="Frontend Developer"
            company="Amazon"
            location="New York, NY"
            type="Full-time"
            salary="$100k - $150k"
          />
          <JobCard
            title="UX Researcher"
            company="Microsoft"
            location="Seattle, WA"
            type="Contract"
            salary="$90k - $130k"
          />
        </View>

        {/* Success Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success stories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}>
            <SuccessStory
              name="Sarah Johnson"
              role="Software Engineer at Google"
              quote="Found my dream job in just 2 weeks! The platform made job hunting so easy."
            />
            <SuccessStory
              name="Michael Chen"
              role="Product Manager at Amazon"
              quote="The career guidance and resources helped me land an amazing role."
            />
            <SuccessStory
              name="Emily Davis"
              role="UX Designer at Apple"
              quote="Best job platform I've used. Highly recommend to anyone job hunting!"
            />
          </ScrollView>
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular job categories</Text>
          <View style={styles.categoryGrid}>
            {[
              {name: 'Technology', icon: 'code-slash', count: '1,200'},
              {name: 'Design', icon: 'color-palette', count: '450'},
              {name: 'Marketing', icon: 'megaphone', count: '680'},
              {name: 'Finance', icon: 'trending-up', count: '320'},
              {name: 'Sales', icon: 'cart', count: '540'},
              {name: 'Customer Service', icon: 'headset', count: '290'},
            ].map(category => (
              <TouchableOpacity key={category.name} style={styles.categoryCard}>
                <Icon name={category.icon} size={28} color={colors.yellow} />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} jobs</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>
            Create your profile and apply to thousands of jobs
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaButtonText}>Sign Up Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.ctaSecondaryText}>Browse Jobs</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: spacing.xl}} />
      </ScrollView>
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
    paddingVertical: spacing.sm,
  },
  greeting: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.body1,
    color: colors.textSecondary,
  },
  heroBanner: {
    backgroundColor: colors.navyDark,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroContent: {
    padding: spacing.lg,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.white,
  },
  heroSubtitle: {
    ...typography.h2,
    color: colors.yellow,
    marginBottom: spacing.md,
  },
  heroFeatures: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    ...typography.body2,
    color: colors.white,
  },
  heroButton: {
    backgroundColor: colors.yellow,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    ...typography.button,
    color: colors.navyDark,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.body2,
    color: colors.yellow,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  companyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: spacing.sm,
    width: 120,
  },
  companyName: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  companyJobs: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  jobCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  jobCardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  jobTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  jobCompany: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  storyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginRight: spacing.sm,
    width: 280,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  storyInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  storyName: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  storyRole: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  storyQuote: {
    ...typography.body2,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  categoryName: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  categoryCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ctaBanner: {
    backgroundColor: colors.navyDark,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
  },
  ctaSubtitle: {
    ...typography.body1,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: colors.yellow,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.navyDark,
  },
  ctaSecondary: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  ctaSecondaryText: {
    ...typography.button,
    color: colors.yellow,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
  },
});