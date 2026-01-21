// ============================================
// COMPANY DETAILS SCREEN
// ============================================

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchCompanyById} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

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
          <Text style={styles.name}>{currentCompany.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>🏭 {currentCompany.industry}</Text>
            <Text style={styles.detailText}>👥 {currentCompany.size}</Text>
          </View>
          <Text style={styles.location}>📍 {currentCompany.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{currentCompany.description}</Text>
        </View>

        {currentCompany.website && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Website</Text>
            <Text style={styles.link}>{currentCompany.website}</Text>
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
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  location: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  link: {
    ...typography.body2,
    color: colors.info,
  },
});
