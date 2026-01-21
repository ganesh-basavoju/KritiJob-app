// ============================================
// JOB FILTERS COMPONENT
// ============================================

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {JOB_TYPES, EXPERIENCE_LEVELS} from '../../utils/constants';
import {JobFilters} from '../../types';

interface JobFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: JobFilters) => void;
  initialFilters?: JobFilters;
}

export const JobFiltersComponent: React.FC<JobFiltersProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Jobs</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Job Type</Text>
            <View style={styles.optionsRow}>
              {JOB_TYPES.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.option,
                    filters.type === type.value && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      type: filters.type === type.value ? undefined : type.value,
                    })
                  }>
                  <Text
                    style={[
                      styles.optionText,
                      filters.type === type.value && styles.optionTextSelected,
                    ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Experience Level</Text>
            <View style={styles.optionsRow}>
              {EXPERIENCE_LEVELS.map(level => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.option,
                    filters.experience === level.value && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      experience:
                        filters.experience === level.value
                          ? undefined
                          : level.value,
                    })
                  }>
                  <Text
                    style={[
                      styles.optionText,
                      filters.experience === level.value &&
                        styles.optionTextSelected,
                    ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Location"
              placeholder="Enter location"
              value={filters.location || ''}
              onChangeText={text => setFilters({...filters, location: text})}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Reset"
              onPress={handleReset}
              variant="secondary"
              style={styles.button}
            />
            <Button
              title="Apply Filters"
              onPress={handleApply}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  closeText: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  option: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  optionText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.navyDark,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
