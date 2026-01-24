// ============================================
// COMPANIES LIST SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
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
  }, [dispatch]);

  const loadCompanies = async () => {
    await dispatch(fetchCompanies(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCompanies();
    setRefreshing(false);
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const renderCompany = ({item}: {item: Company}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CompanyDetails', {companyId: item.id})}
      activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.logoContainer}>
          {item.logoUrl ? (
            <Image source={{uri: item.logoUrl}} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Icon name="business" size={32} color={colors.textTertiary} />
            </View>
          )}
        </View>
        
        <View style={styles.companyInfo}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {stripHtmlTags(item.description)}
            </Text>
          )}
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="location-outline" size={16} color={colors.yellow} style={styles.detailIcon} />
              <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="people-outline" size={16} color={colors.yellow} style={styles.detailIcon} />
              <Text style={styles.size}>{item.employeesCount} employees</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  if (loading && companies.length === 0) {
    return <Loader />;
  }

  // Remove duplicate companies based on ID
  const uniqueCompanies = companies.filter((company, index, self) =>
    index === self.findIndex((c) => c.id === company.id)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={uniqueCompanies}
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
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoContainer: {
    marginRight: spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundTertiary,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyInfo: {
    flex: 1,
  },
  name: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  detailsContainer: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  location: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  size: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});
