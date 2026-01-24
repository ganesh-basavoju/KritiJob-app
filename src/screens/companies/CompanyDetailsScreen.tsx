// ============================================
// COMPANY DETAILS SCREEN
// ============================================

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchCompanyById} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

// Helper to strip HTML tags
const stripHtml = (html: string): string => {
  return html?.replace(/<[^>]*>/g, '') || '';
};

export const CompanyDetailsScreen: React.FC<any> = ({route}) => {
  const {companyId} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {currentCompany, loading} = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  const loadCompany = async () => {
    await dispatch(fetchCompanyById(companyId));
  };

  if (loading && !currentCompany) {
    return <Loader />;
  }

  if (!currentCompany) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {currentCompany.logoUrl ? (
              <Image source={{uri: currentCompany.logoUrl}} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Icon name="business" size={48} color={colors.textTertiary} />
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{currentCompany.name}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.iconContainer}>
                <Icon name="people" size={20} color={colors.yellow} />
              </View>
              <View>
                <Text style={styles.statLabel}>Team Size</Text>
                <Text style={styles.statValue}>{currentCompany.employeesCount} employees</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.iconContainer}>
                <Icon name="location" size={20} color={colors.yellow} />
              </View>
              <View>
                <Text style={styles.statLabel}>Location</Text>
                <Text style={styles.statValue}>{currentCompany.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="information-circle" size={24} color={colors.yellow} />
            <Text style={styles.sectionTitle}>About Company</Text>
          </View>
          <Text style={styles.description}>{stripHtml(currentCompany.description)}</Text>
        </View>

        {currentCompany.website && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="globe" size={24} color={colors.yellow} />
              <Text style={styles.sectionTitle}>Website</Text>
            </View>
            <TouchableOpacity 
              style={styles.websiteButton}
              onPress={() => Linking.openURL(currentCompany.website)}
              activeOpacity={0.7}>
              <Icon name="link" size={20} color={colors.yellow} />
              <Text style={styles.link}>{currentCompany.website}</Text>
              <Icon name="open-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  logoSection: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundTertiary,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.yellow + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  link: {
    ...typography.body2,
    color: colors.info,
    flex: 1,
  },
});
