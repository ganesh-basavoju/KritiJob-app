// // ============================================
// // EMPLOYER PROFILE SETTINGS SCREEN (TSX)
// // ============================================

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {useSelector} from 'react-redux';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {RootState} from '../../redux/store';
// import {colors} from '../../theme/colors';
// import {spacing, borderRadius} from '../../theme/spacing';
// import {typography} from '../../theme/typography';
// import {API_BASE_URL} from '../../utils/constants';
// import {storageService} from '../../services/storage.service';

// // --- Types ---

// interface CompanyData {
//   name: string;
//   description: string;
//   logoUrl: string;
//   website: string;
//   location: string;
//   employeesCount: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data?: CompanyData;
//   message?: string;
// }

// export const EmployerProfileScreen: React.FC<any> = ({navigation}) => {
//   const {user} = useSelector((state: RootState) => state.auth);
  
//   // MODIFIED: Initial name is now empty string, not user?.name
//   const initialFormData: CompanyData = {
//     name: '',
//     description: '',
//     logoUrl: '',
//     website: '',
//     location: '',
//     employeesCount: '',
//   };

//   const [formData, setFormData] = useState<CompanyData>(initialFormData);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [fetching, setFetching] = useState<boolean>(true);

//   useEffect(() => {
//     fetchCompanyData();
//   }, []);

//   const fetchCompanyData = async () => {
//     try {
//       setFetching(true);
//       const token = await storageService.getAccessToken();
      
//       if (!token) {
//         console.warn('No token found in storage');
//         setFetching(false);
//         return;
//       }

//       const response = await fetch(`${API_BASE_URL}/company/me`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Server responded with ${response.status}`);
//       }

//       const json: ApiResponse = await response.json();

//       if (json.success && json.data) {
//         // MODIFIED: Set form data directly from API response, no fallback to user name
//         setFormData({
//           name: json.data!.name || '',
//           description: json.data!.description || '',
//           logoUrl: json.data!.logoUrl || '',
//           website: json.data!.website || '',
//           location: json.data!.location || '',
//           employeesCount: json.data!.employeesCount || '',
//         });
//       }
//     } catch (error: any) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.name || !formData.description || !formData.location) {
//       Alert.alert('Error', 'Please fill in the required fields (Name, Description, Location).');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await storageService.getAccessToken();
      
//       if (!token) {
//         throw new Error('Authentication token missing. Please log out and log in again.');
//       }

//       const response = await fetch(`${API_BASE_URL}/company`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const json: ApiResponse = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Company profile saved successfully!', [
//           {text: 'OK', onPress: () => navigation.goBack()},
//         ]);
//       } else {
//         Alert.alert('Error', json.message || 'Something went wrong on the server.');
//       }
//     } catch (error: any) {
//       console.error('Save Error:', error);
//       Alert.alert('Error', error.message || 'Network error. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateField = (field: keyof CompanyData, value: string) => {
//     setFormData(prev => ({...prev, [field]: value}));
//   };

//   if (fetching) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.yellow} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Company Profile</Text>
//         <View style={{width: 24}} /> 
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.sectionTitle}>
//           {formData.name ? 'Edit Company Details' : 'Create Company Profile'}
//         </Text>
//         <Text style={styles.sectionSubtitle}>
//           Fill in the details to help candidates find you.
//         </Text>

//         <View style={styles.formContainer}>
          
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Company Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. Tech Corp"
//               value={formData.name}
//               onChangeText={(text) => updateField('name', text)}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Description *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Brief description of the company..."
//               value={formData.description}
//               onChangeText={(text) => updateField('description', text)}
//               multiline
//               numberOfLines={4}
//               textAlignVertical="top"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Logo URL</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="https://..."
//               value={formData.logoUrl}
//               onChangeText={(text) => updateField('logoUrl', text)}
//               autoCapitalize="none"
//               keyboardType="url"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Website</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="https://company.com"
//               value={formData.website}
//               onChangeText={(text) => updateField('website', text)}
//               autoCapitalize="none"
//               keyboardType="url"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Location *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. San Francisco, CA"
//               value={formData.location}
//               onChangeText={(text) => updateField('location', text)}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Employees Count</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. 51-200"
//               value={formData.employeesCount}
//               onChangeText={(text) => updateField('employeesCount', text)}
//             />
//           </View>

//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.saveButton}
//           onPress={handleSave}
//           disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color={colors.textPrimary || colors.black} /> 
//           ) : (
//             <Text style={styles.saveButtonText}>Save Profile</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     backgroundColor: colors.card,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   backButton: {
//     padding: spacing.xs,
//   },
//   headerTitle: {
//     ...typography.h6,
//     color: colors.textPrimary,
//     fontWeight: 'bold',
//   },
//   scrollContent: {
//     padding: spacing.md,
//     paddingBottom: 100,
//   },
//   sectionTitle: {
//     ...typography.h5,
//     color: colors.textPrimary,
//     marginBottom: spacing.xs,
//   },
//   sectionSubtitle: {
//     ...typography.body2,
//     color: colors.textSecondary,
//     marginBottom: spacing.lg,
//   },
//   formContainer: {
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//   },
//   inputGroup: {
//     marginBottom: spacing.md,
//   },
//   label: {
//     ...typography.body2,
//     color: colors.textPrimary,
//     marginBottom: spacing.xs,
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: borderRadius.sm,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     color: colors.textPrimary,
//     backgroundColor: colors.background,
//     ...typography.body1,
//   },
//   textArea: {
//     height: 100,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: colors.card,
//     padding: spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//     paddingBottom: spacing.md + 10, 
//   },
//   saveButton: {
//     backgroundColor: colors.yellow,
//     paddingVertical: spacing.md,
//     borderRadius: borderRadius.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   saveButtonText: {
//     ...typography.button,
//     color: colors.black, 
//     fontWeight: 'bold',
//   },
// });

// ============================================
// EMPLOYER PROFILE SETTINGS SCREEN (TSX)
// ============================================

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootState} from '../../redux/store';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

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

export const EmployerProfileScreen: React.FC<any> = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  
  const initialFormData: CompanyData = {
    name: '',
    description: '',
    logoUrl: '',
    website: '',
    location: '',
    employeesCount: '',
  };

  const [formData, setFormData] = useState<CompanyData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
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
      
      console.log('GET /company/me Response:', json.data); // DEBUG LOG

      if (json.success && json.data) {
        // FIX: Check for both 'id' and '_id'. MongoDB often uses '_id'.
        const companyId = json.data!.id || json.data!._id;
        
        if (!companyId) {
          console.warn('Warning: Company ID not found in API response!');
        }

        setFormData({
          id: companyId, 
          name: json.data!.name || '',
          description: json.data!.description || '',
          logoUrl: json.data!.logoUrl || '',
          website: json.data!.website || '',
          location: json.data!.location || '',
          employeesCount: json.data!.employeesCount || '',
        });
      }
    } catch (error: any) {
      console.error('Fetch Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.location) {
      Alert.alert('Error', 'Please fill in the required fields (Name, Description, Location).');
      return;
    }

    setLoading(true);
    try {
      const token = await storageService.getAccessToken();
      
      if (!token) {
        throw new Error('Authentication token missing. Please log out and log in again.');
      }

      const body = new FormData();
      body.append('name', formData.name);
      body.append('description', formData.description);
      body.append('location', formData.location);
      
      if (formData.website) body.append('website', formData.website);
      if (formData.employeesCount) body.append('employeesCount', formData.employeesCount);
      
      if (formData.logoUrl) {
        body.append('logo', formData.logoUrl);
      }

      let url = '';
      let method = '';

      // LOGGING TO DIAGNOSE ISSUE
      console.log('Attempting to Save. Current ID:', formData.id);

      // SAFETY CHECK:
      // If ID is missing but we have data (name), it implies we failed to capture the ID.
      // If ID is present, we UPDATE (PUT).
      if (formData.id) {
        url = `${API_BASE_URL}/company/${formData.id}`;
        method = 'PUT';
      } else {
        // ID is missing. We must assume this is a Create (POST) request.
        url = `${API_BASE_URL}/company`;
        method = 'POST';
        
        // Alert user that we are creating, not updating
        console.warn('ID is missing. Attempting to CREATE a new profile.');
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      });

      // Handle non-JSON responses (like HTML errors)
      const contentType = response.headers.get("content-type");
      let json: ApiResponse;
      let rawText = '';

      if (contentType && contentType.indexOf("application/json") !== -1) {
        json = await response.json();
      } else {
        rawText = await response.text();
        console.error('Server Response (Text):', rawText);
        throw new Error('Server returned an invalid response.');
      }

      if (response.ok) {
        Alert.alert(
          'Success', 
          formData.id ? 'Company profile updated successfully!' : 'Company profile created successfully!',
          [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]
        );
      } else {
        // Specific handling for the "Already exists" error
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
      setLoading(false);
    }
  };

  const updateField = (field: keyof CompanyData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  if (fetching) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Company Profile</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          {formData.name ? 'Edit Company Details' : 'Create Company Profile'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          Fill in the details to help candidates find you.
        </Text>

        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tech Corp"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description of the company..."
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo (URL) *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              value={formData.logoUrl}
              onChangeText={(text) => updateField('logoUrl', text)}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="https://company.com"
              value={formData.website}
              onChangeText={(text) => updateField('website', text)}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. San Francisco, CA"
              value={formData.location}
              onChangeText={(text) => updateField('location', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employees Count</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 11-50"
              value={formData.employeesCount}
              onChangeText={(text) => updateField('employeesCount', text)}
            />
          </View>

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.textPrimary || colors.black} /> 
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    ...typography.body1,
  },
  textArea: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.md + 10, 
  },
  saveButton: {
    backgroundColor: colors.yellow,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: colors.black, 
    fontWeight: 'bold',
  },
});