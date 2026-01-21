// ============================================
// JOB POST FORM COMPONENT
// ============================================

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {JOB_TYPES, EXPERIENCE_LEVELS} from '../../utils/constants';
import {Company} from '../../types';

interface JobPostFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  companies: Company[];
  initialData?: any;
}

export const JobPostForm: React.FC<JobPostFormProps> = ({
  onSubmit,
  loading,
  companies,
  initialData,
}) => {
  const {control, handleSubmit, setValue, watch} = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      companyId: '',
      location: '',
      type: 'full-time',
      experience: '0-1',
      salary: '',
      skills: '',
    },
  });

  const [selectedType, setSelectedType] = useState(
    initialData?.type || 'full-time',
  );
  const [selectedExperience, setSelectedExperience] = useState(
    initialData?.experience || '0-1',
  );
  const [selectedCompany, setSelectedCompany] = useState(
    initialData?.companyId || '',
  );

  useEffect(() => {
    setValue('type', selectedType);
  }, [selectedType, setValue]);

  useEffect(() => {
    setValue('experience', selectedExperience);
  }, [selectedExperience, setValue]);

  useEffect(() => {
    setValue('companyId', selectedCompany);
  }, [selectedCompany, setValue]);

  const handleFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      skills: data.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter(Boolean),
    };
    onSubmit(formattedData);
  };

  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        name="title"
        rules={{required: 'Title is required'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Input
            label="Job Title*"
            placeholder="e.g. Senior React Native Developer"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{required: 'Description is required'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job Description*</Text>
            <TextInput
              style={[styles.textArea, error && styles.inputError]}
              placeholder="Describe the job role, responsibilities..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              placeholderTextColor={colors.inputPlaceholder}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company*</Text>
        <View style={styles.optionsRow}>
          {companies.map(company => (
            <TouchableOpacity
              key={company.id}
              style={[
                styles.option,
                selectedCompany === company.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedCompany(company.id)}>
              <Text
                style={[
                  styles.optionText,
                  selectedCompany === company.id && styles.optionTextSelected,
                ]}>
                {company.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Controller
        control={control}
        name="location"
        rules={{required: 'Location is required'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Input
            label="Location*"
            placeholder="e.g. New York, NY"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Job Type*</Text>
        <View style={styles.optionsRow}>
          {JOB_TYPES.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.option,
                selectedType === type.value && styles.optionSelected,
              ]}
              onPress={() => setSelectedType(type.value)}>
              <Text
                style={[
                  styles.optionText,
                  selectedType === type.value && styles.optionTextSelected,
                ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Experience Level*</Text>
        <View style={styles.optionsRow}>
          {EXPERIENCE_LEVELS.map(level => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.option,
                selectedExperience === level.value && styles.optionSelected,
              ]}
              onPress={() => setSelectedExperience(level.value)}>
              <Text
                style={[
                  styles.optionText,
                  selectedExperience === level.value &&
                    styles.optionTextSelected,
                ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Controller
        control={control}
        name="salary"
        render={({field: {onChange, value}}) => (
          <Input
            label="Salary (Optional)"
            placeholder="e.g. $80,000 - $120,000"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="skills"
        rules={{required: 'Skills are required'}}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Input
            label="Skills* (comma-separated)"
            placeholder="e.g. React Native, TypeScript, Redux"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Button
        title={initialData ? 'Update Job' : 'Post Job'}
        onPress={handleSubmit(handleFormSubmit)}
        loading={loading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textArea: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
