
// // ============================================
// // JOB POST FORM COMPONENT (Fixed)
// // ============================================

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Platform,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {useForm, Controller} from 'react-hook-form';
// import {colors} from '../../theme/colors';
// import {spacing, borderRadius} from '../../theme/spacing';
// import {typography} from '../../theme/typography';
// import {Button} from '../common/Button';
// import {Input} from '../common/Input';
// import {JOB_TYPES, EXPERIENCE_LEVELS} from '../../utils/constants';
// import {API_BASE_URL} from '../../utils/constants';
// import {storageService} from '../../services/storage.service';

// interface JobPostFormProps {
//   onSubmit: (data: any) => void;
//   loading: boolean;
//   initialValues?: any; 
// }

// export const JobPostForm: React.FC<JobPostFormProps> = ({
//   onSubmit,
//   loading,
//   initialValues,
// }) => {
//   const {control, handleSubmit, setValue, reset} = useForm({
//     defaultValues: initialValues || {
//       companyName: '', 
//       title: '',
//       description: '',
//       location: '',
//       type: 'Full-Time',
//       experienceLevel: 'Entry Level',
//       salaryRange: '',
//       skillsRequired: '',
//       deadline: null,
//     },
//   });

//   // Local State for UI Chips
//   const [selectedType, setSelectedType] = useState(
//     initialValues?.type || 'Full-Time',
//   );
//   const [selectedExperience, setSelectedExperience] = useState(
//     initialValues?.experienceLevel || 'Entry Level',
//   );
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(
//     initialValues?.deadline ? new Date(initialValues.deadline) : null,
//   );

//   // Fetch Company Name on mount
//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       if (initialValues?.companyName) return;

//       try {
//         const token = await storageService.getAccessToken();
//         if (!token) return;

//         const response = await fetch(`${API_BASE_URL}/company/me`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const json = await response.json();
//           if (json.success && json.data?.name) {
//             setValue('companyName', json.data.name);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching company name:', error);
//       }
//     };

//     fetchCompanyData();
//   }, [initialValues, setValue]);

//   // CRITICAL: Sync form and local UI state when initialData is received (Edit Mode)
//   useEffect(() => {
//     if (initialValues) {
//       // 1. Reset the entire form with new data
//       reset(initialValues);
      
//       // 2. Update local UI state for the chips to highlight correctly
//       if (initialValues.type) setSelectedType(initialValues.type);
//       if (initialValues.experienceLevel) setSelectedExperience(initialValues.experienceLevel);
//       if (initialValues.deadline) setSelectedDate(new Date(initialValues.deadline));
//     }
//   }, [initialValues, reset]);

//   // Sync Form Values when Local State changes (User Interaction)
//   useEffect(() => {
//     setValue('type', selectedType);
//   }, [selectedType, setValue]);

//   useEffect(() => {
//     setValue('experienceLevel', selectedExperience);
//   }, [selectedExperience, setValue]);

//   useEffect(() => {
//     setValue('deadline', selectedDate);
//   }, [selectedDate, setValue]);

//   // FIXED: Pass raw form data to parent, do not convert here
//   const handleFormSubmit = (data: any) => {
//     onSubmit(data);
//   };

//   return (
//     <ScrollView style={styles.container}>
      
//       {/* Company Name Field (Read-Only) */}
//       <Controller
//         control={control}
//         name="companyName"
//         rules={{required: 'Company Name is required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <Input
//             label="Company Name*"
//             placeholder="Fetching..."
//             value={value}
//             onChangeText={onChange}
//             error={error?.message}
//             editable={false} 
//             style={{ backgroundColor: colors.backgroundTertiary }}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="title"
//         rules={{required: 'Title is required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <Input
//             label="Job Title*"
//             placeholder="e.g. Senior React Native Developer"
//             value={value}
//             onChangeText={onChange}
//             error={error?.message}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="description"
//         rules={{required: 'Description is required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Job Description*</Text>
//             <TextInput
//               style={[styles.textArea, error && styles.inputError]}
//               placeholder="Describe the job role, responsibilities..."
//               value={value}
//               onChangeText={onChange}
//               multiline
//               numberOfLines={6}
//               placeholderTextColor={colors.inputPlaceholder}
//             />
//             {error && <Text style={styles.errorText}>{error.message}</Text>}
//           </View>
//         )}
//       />

//       <Controller
//         control={control}
//         name="location"
//         rules={{required: 'Location is required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <Input
//             label="Location*"
//             placeholder="e.g. New York, NY"
//             value={value}
//             onChangeText={onChange}
//             error={error?.message}
//           />
//         )}
//       />

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Job Type*</Text>
//         <View style={styles.optionsRow}>
//           {JOB_TYPES.map(type => (
//             <TouchableOpacity
//               key={type.value}
//               style={[
//                 styles.option,
//                 selectedType === type.value && styles.optionSelected,
//               ]}
//               onPress={() => setSelectedType(type.value)}>
//               <Text
//                 style={[
//                   styles.optionText,
//                   selectedType === type.value && styles.optionTextSelected,
//                 ]}>
//                 {type.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Experience Level*</Text>
//         <View style={styles.optionsRow}>
//           {EXPERIENCE_LEVELS.map(level => (
//             <TouchableOpacity
//               key={level.value}
//               style={[
//                 styles.option,
//                 selectedExperience === level.value && styles.optionSelected,
//               ]}
//               onPress={() => setSelectedExperience(level.value)}>
//               <Text
//                 style={[
//                   styles.optionText,
//                   selectedExperience === level.value &&
//                     styles.optionTextSelected,
//                 ]}>
//                 {level.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       <Controller
//         control={control}
//         name="salaryRange"
//         rules={{required: 'Salary range is required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <Input
//             label="Salary Range*"
//             placeholder="e.g. $80,000 - $120,000"
//             value={value}
//             onChangeText={onChange}
//             error={error?.message}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="skillsRequired"
//         rules={{required: 'Skills are required'}}
//         render={({field: {onChange, value}, fieldState: {error}}) => (
//           <Input
//             label="Skills Required* (comma-separated)"
//             placeholder="e.g. React Native, TypeScript, Redux"
//             value={value}
//             onChangeText={onChange}
//             error={error?.message}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="deadline"
//         rules={{
//           validate: (value) => {
//             if (value && new Date(value) < new Date(new Date().setHours(0, 0, 0, 0))) {
//               return 'Deadline cannot be in the past';
//             }
//             return true;
//           },
//         }}
//         render={({field: {value}, fieldState: {error}}) => (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Application Deadline</Text>
//             <TouchableOpacity
//               style={[styles.datePickerButton, error && styles.inputError]}
//               onPress={() => setShowDatePicker(true)}>
//               <Text
//                 style={[
//                   styles.datePickerText,
//                   !selectedDate && styles.datePickerPlaceholder,
//                 ]}>
//                 {selectedDate
//                   ? selectedDate.toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                     })
//                   : 'Select deadline (optional)'}
//               </Text>
//             </TouchableOpacity>
//             {selectedDate && (
//               <TouchableOpacity
//                 style={styles.clearButton}
//                 onPress={() => setSelectedDate(null)}>
//                 <Text style={styles.clearButtonText}>Clear</Text>
//               </TouchableOpacity>
//             )}
//             {error && <Text style={styles.errorText}>{error.message}</Text>}
//             {showDatePicker && (
//               <DateTimePicker
//                 value={selectedDate || new Date()}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 minimumDate={new Date()}
//                 onChange={(event, date) => {
//                   setShowDatePicker(Platform.OS === 'ios');
//                   if (date) {
//                     setSelectedDate(date);
//                   }
//                 }}
//               />
//             )}
//           </View>
//         )}
//       />

//       <Button
//         title={initialValues ? 'Update Job' : 'Post Job'}
//         onPress={handleSubmit(handleFormSubmit)}
//         loading={loading}
//         style={styles.submitButton}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: spacing.md,
//   },
//   inputContainer: {
//     marginBottom: spacing.md,
//   },
//   label: {
//     ...typography.label,
//     color: colors.textPrimary,
//     marginBottom: spacing.sm,
//   },
//   textArea: {
//     backgroundColor: colors.inputBackground,
//     borderWidth: 1,
//     borderColor: colors.inputBorder,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     color: colors.textPrimary,
//     fontSize: 16,
//     minHeight: 120,
//     textAlignVertical: 'top',
//   },
//   inputError: {
//     borderColor: colors.error,
//   },
//   errorText: {
//     ...typography.caption,
//     color: colors.error,
//     marginTop: spacing.xs,
//   },
//   optionsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   option: {
//     backgroundColor: colors.backgroundTertiary,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     borderRadius: borderRadius.md,
//     marginRight: spacing.sm,
//     marginBottom: spacing.sm,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   optionSelected: {
//     backgroundColor: colors.yellow,
//     borderColor: colors.yellow,
//   },
//   optionText: {
//     ...typography.body2,
//     color: colors.textPrimary,
//   },
//   optionTextSelected: {
//     color: colors.navyDark,
//   },
//   submitButton: {
//     marginTop: spacing.md,
//     marginBottom: spacing.xl,
//   },
//   datePickerButton: {
//     backgroundColor: colors.inputBackground,
//     borderWidth: 1,
//     borderColor: colors.inputBorder,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     justifyContent: 'center',
//   },
//   datePickerText: {
//     ...typography.body1,
//     color: colors.textPrimary,
//   },
//   datePickerPlaceholder: {
//     color: colors.inputPlaceholder,
//   },
//   clearButton: {
//     marginTop: spacing.sm,
//     alignSelf: 'flex-start',
//   },
//   clearButtonText: {
//     ...typography.body2,
//     color: colors.yellow,
//   },
// });

// ============================================
// JOB POST FORM COMPONENT (Improved UI)
// ============================================

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {JOB_TYPES, EXPERIENCE_LEVELS} from '../../utils/constants';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

interface JobPostFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  initialValues?: any; 
}

export const JobPostForm: React.FC<JobPostFormProps> = ({
  onSubmit,
  loading,
  initialValues,
}) => {
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: initialValues || {
      companyName: '', 
      title: '',
      description: '',
      location: '',
      type: 'Full-Time',
      experienceLevel: 'Entry Level',
      salaryRange: '',
      skillsRequired: '',
      deadline: null,
    },
  });

  // Local State for UI Chips
  const [selectedType, setSelectedType] = useState(
    initialValues?.type || 'Full-Time',
  );
  const [selectedExperience, setSelectedExperience] = useState(
    initialValues?.experienceLevel || 'Entry Level',
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialValues?.deadline ? new Date(initialValues.deadline) : null,
  );

  // Fetch Company Name on mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (initialValues?.companyName) return;

      try {
        const token = await storageService.getAccessToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/company/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data?.name) {
            setValue('companyName', json.data.name);
          }
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

    fetchCompanyData();
  }, [initialValues, setValue]);

  // Sync form and local UI state when initialData is received (Edit Mode)
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      if (initialValues.type) setSelectedType(initialValues.type);
      if (initialValues.experienceLevel) setSelectedExperience(initialValues.experienceLevel);
      if (initialValues.deadline) setSelectedDate(new Date(initialValues.deadline));
    }
  }, [initialValues, reset]);

  // Sync Form Values when Local State changes (User Interaction)
  useEffect(() => {
    setValue('type', selectedType);
  }, [selectedType, setValue]);

  useEffect(() => {
    setValue('experienceLevel', selectedExperience);
  }, [selectedExperience, setValue]);

  useEffect(() => {
    setValue('deadline', selectedDate);
  }, [selectedDate, setValue]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* --- SECTION: Basic Info --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Controller
          control={control}
          name="companyName"
          rules={{required: 'Company Name is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Company Name"
              placeholder="Company Name"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              editable={false} 
              style={{ backgroundColor: colors.backgroundTertiary }}
              inputWrapperStyle={{borderColor: colors.border}}
            />
          )}
        />

        <Controller
          control={control}
          name="title"
          rules={{required: 'Job Title is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Job Title"
              placeholder="e.g. Senior React Native Developer"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              inputWrapperStyle={{borderColor: colors.border}}
            />
          )}
        />
      </View>

      {/* --- SECTION: Details --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>

        <Controller
          control={control}
          name="location"
          rules={{required: 'Location is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Location"
              placeholder="e.g. New York, NY (Remote)"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              inputWrapperStyle={{borderColor: colors.border}}
            />
          )}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Job Type</Text>
          <View style={styles.chipsContainer}>
            {JOB_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  selectedType === type.value && styles.chipActive,
                ]}
                onPress={() => setSelectedType(type.value)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.chipText,
                    selectedType === type.value && styles.chipTextActive,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Experience Level</Text>
          <View style={styles.chipsContainer}>
            {EXPERIENCE_LEVELS.map(level => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.chip,
                  selectedExperience === level.value && styles.chipActive,
                ]}
                onPress={() => setSelectedExperience(level.value)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.chipText,
                    selectedExperience === level.value && styles.chipTextActive,
                  ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="salaryRange"
          rules={{required: 'Salary range is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Salary Range"
              placeholder="e.g. $80,000 - $120,000"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              inputWrapperStyle={{borderColor: colors.border}}
            />
          )}
        />
      </View>

      {/* --- SECTION: Description & Requirements --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description & Requirements</Text>

        <Controller
          control={control}
          name="description"
          rules={{required: 'Description is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Description</Text>
              <TextInput
                style={[styles.textArea, error && styles.inputError]}
                placeholder="Describe the role, responsibilities, and company culture..."
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="skillsRequired"
          rules={{required: 'Skills are required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Skills Required"
              placeholder="e.g. React Native, TypeScript, Redux"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              inputWrapperStyle={{borderColor: colors.border}}
            />
          )}
        />

        <Controller
          control={control}
          name="deadline"
          rules={{
            validate: (value) => {
              if (value && new Date(value) < new Date(new Date().setHours(0, 0, 0, 0))) {
                return 'Deadline cannot be in the past';
              }
              return true;
            },
          }}
          render={({field: {value}, fieldState: {error}}) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Application Deadline</Text>
              <TouchableOpacity
                style={[styles.datePickerBtn, error && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.datePickerText,
                    !selectedDate && styles.datePickerPlaceholder,
                  ]}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Select deadline (Optional)'}
                </Text>
                <Icon 
                  name="calendar-outline" 
                  size={20} 
                  color={selectedDate ? colors.textPrimary : colors.textTertiary} 
                />
              </TouchableOpacity>
              
              {selectedDate && (
                <TouchableOpacity
                  style={styles.clearDateBtn}
                  onPress={() => setSelectedDate(null)}>
                  <Text style={styles.clearDateText}>Remove Date</Text>
                </TouchableOpacity>
              )}

              {error && <Text style={styles.errorText}>{error.message}</Text>}
              
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (date) setSelectedDate(date);
                  }}
                />
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.footerSpacing}>
        <Button
          title={initialValues ? 'Update Job' : 'Post Job'}
          onPress={handleSubmit(handleFormSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  // Section Grouping
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  // Labels & Text
  label: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginLeft: 4, // Slight offset for alignment with input borders
  },
  textArea: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
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
    marginLeft: 4,
  },
  // Chips / Selectors
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, // Pill shape
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
    borderWidth: 1.5,
  },
  chipText: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.navyDark,
    fontWeight: '700',
  },
  // Date Picker Styling
  datePickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    height: 52, // Match standard Input height
  },
  datePickerText: {
    ...typography.body1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  datePickerPlaceholder: {
    color: colors.textTertiary,
  },
  clearDateBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    marginRight: 4,
    paddingVertical: 2,
  },
  clearDateText: {
    ...typography.caption,
    color: colors.yellow,
    fontWeight: '600',
  },
  // Footer
  footerSpacing: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  submitButton: {
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
});