// ============================================
// COMPANIES LIST SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchCompanies} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Company} from '../../types';

export const CompaniesListScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {companies, loading} = useSelector((state: RootState) => state.companies);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    await dispatch(fetchCompanies(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCompanies();
    setRefreshing(false);
  };

  const renderCompany = ({item}: {item: Company}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CompanyDetails', {companyId: item.id})}
      activeOpacity={0.7}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.detailRow}>
        <Icon name="location-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.location}>{item.location}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="people-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.size}>{item.employeesCount}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && companies.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={companies}
        renderItem={renderCompany}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={<EmptyState title="No companies found" />}
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  name: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  location: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  size: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});
