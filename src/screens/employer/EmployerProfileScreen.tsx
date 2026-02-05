
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {Loader} from '../../components/common/Loader';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';


const EMPLOYEE_COUNT_OPTIONS = [
  {value: '1-10', label: '1-10'},
  {value: '11-50', label: '11-50'},
  {value: '51-200', label: '51-200'},
  {value: '201-500', label: '201-500'},
  {value: '500+', label: '500+'},
];



// --- Types ---

interface CompanyData {
  id?: string; 
  _id?: string; // Added to support MongoDB _id
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  location: string;
  employeesCount: string;
}

interface ApiResponse {
  success: boolean;
  data?: CompanyData;
  message?: string;
}

export const EmployerProfileScreen: React.FC<any> = ({navigation: _navigation}) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedEmployeeCount, setSelectedEmployeeCount] = useState('1-10');

  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      name: '',
      description: '',
      website: '',
      location: '',
      employeesCount: '1-10',
    },
  });

  const fetchCompanyData = useCallback(async () => {
    try {
      setFetching(true);
      const token = await storageService.getAccessToken();
      
      if (!token) {
        console.warn('No token found in storage');
        setFetching(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/company/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setFetching(false);
          return;
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      const json: ApiResponse = await response.json();
      
      console.log('GET /company/me Response:', json.data);

      if (json.success && json.data) {
        const id = json.data!.id || json.data!._id;
        
        if (!id) {
          console.warn('Warning: Company ID not found in API response!');
        }

        setCompanyId(id || null);
        reset({
          name: json.data!.name || '',
          description: json.data!.description || '',
          website: json.data!.website || '',
          location: json.data!.location || '',
          employeesCount: json.data!.employeesCount || '1-10',
        });
        setSelectedEmployeeCount(json.data!.employeesCount || '1-10');
      }
    } catch (error: any) {
      console.error('Fetch Error:', error);
    } finally {
      setFetching(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  useEffect(() => {
    setValue('employeesCount', selectedEmployeeCount);
  }, [selectedEmployeeCount, setValue]);

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);
    try {
      const token = await storageService.getAccessToken();
      
      if (!token) {
        throw new Error('Authentication token missing. Please log out and log in again.');
      }

      console.log('Attempting to Save. Current ID:', companyId);

      let url = '';
      let method = '';

      if (companyId) {
        url = `${API_BASE_URL}/company/${companyId}`;
        method = 'PUT';
      } else {
        url = `${API_BASE_URL}/company`;
        method = 'POST';
        console.warn('ID is missing. Attempting to CREATE a new profile.');
      }

      const body = new FormData();
      body.append('name', data.name);
      body.append('description', data.description);
      body.append('location', data.location);
      
      if (data.website) body.append('website', data.website);
      if (data.employeesCount) body.append('employeesCount', data.employeesCount);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      });

      const contentType = response.headers.get("content-type");
      let json: ApiResponse;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        json = await response.json();
      } else {
        const rawText = await response.text();
        console.error('Server Response (Text):', rawText);
        throw new Error('Server returned an invalid response.');
      }

      if (response.ok) {
        Alert.alert(
          'Success', 
          companyId ? 'Company profile updated successfully!' : 'Company profile created successfully!',
          [
            {text: 'OK', onPress: () => fetchCompanyData()},
          ]
        );
      } else {
        if (json.message && json.message.includes('already')) {
           Alert.alert('Update Failed', 'The system thinks this is a new profile creation, but one already exists. Please refresh the screen or contact support.');
        } else {
           Alert.alert('Error', json.message || 'Something went wrong on the server.');
        }
      }
    } catch (error: any) {
      console.error('Save Error:', error);
      Alert.alert('Error', error.message || 'Network error. Please check your connection.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetching) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <Controller
          control={control}
          name="name"
          rules={{required: 'Company name is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Company Name*"
              placeholder="e.g. Tech Corp"
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
              <Text style={styles.label}>Company Description*</Text>
              <TextInput
                style={[styles.textArea, error && styles.inputError]}
                placeholder="Brief description of the company..."
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

        <Controller
          control={control}
          name="website"
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Website (optional)"
              placeholder="https://company.com"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          rules={{required: 'Location is required'}}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Input
              label="Location*"
              placeholder="e.g. San Francisco, CA"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Size*</Text>
          <View style={styles.optionsRow}>
            {EMPLOYEE_COUNT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedEmployeeCount === option.value && styles.optionSelected,
                ]}
                onPress={() => setSelectedEmployeeCount(option.value)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedEmployeeCount === option.value &&
                      styles.optionTextSelected,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={companyId ? 'Update Profile' : 'Create Profile'}
          onPress={handleSubmit(onSubmit)}
          loading={submitLoading}
          style={styles.submitButton}
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
  scrollView: {
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