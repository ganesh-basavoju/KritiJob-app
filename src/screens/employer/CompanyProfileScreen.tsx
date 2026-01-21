// ============================================
// COMPANY PROFILE SCREEN
// ============================================

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchMyCompany} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {Button} from '../../components/common/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const CompanyProfileScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {myCompany, loading} = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    await dispatch(fetchMyCompany());
  };

  if (loading && !myCompany) {
    return <Loader />;
  }

  if (!myCompany) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No Company Profile"
          message="Create your company profile to start posting jobs"
        />
        <Button title="Create Profile" onPress={() => {}} style={styles.button} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{myCompany.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>🏭 {myCompany.industry}</Text>
            <Text style={styles.detailText}>👥 {myCompany.size}</Text>
          </View>
          <Text style={styles.location}>📍 {myCompany.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{myCompany.description}</Text>
        </View>

        {myCompany.website && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Website</Text>
            <Text style={styles.link}>{myCompany.website}</Text>
          </View>
        )}

        <Button
          title="Edit Profile"
          onPress={() => {}}
          variant="primary"
          style={styles.button}
        />
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
  button: {
    marginTop: spacing.md,
  },
});
