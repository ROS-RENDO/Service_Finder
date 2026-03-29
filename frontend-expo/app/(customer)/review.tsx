import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { reviewsApi } from '@/lib/api/reviews';
import { Ionicons } from '@expo/vector-icons';

export default function LeaveReviewScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Error', 'Please rate the service before submitting.'); return; }
    setLoading(true);
    try {
      // If no valid booking ID exists, mock success (for UI demo purposes)
      if (!bookingId || bookingId.startsWith('mock')) {
        setTimeout(() => {
          Alert.alert('Thank You!', 'Your review has been successfully submitted.', [
            { text: 'OK', onPress: () => router.back() }
          ]);
          setLoading(false);
        }, 800);
        return;
      }
      
      await reviewsApi.create({ bookingId, companyRating: rating, comment });
      Alert.alert('Thank You!', 'Your review has been successfully submitted.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to submit review. Try again.');
    } finally {
      if(bookingId && !bookingId.startsWith('mock')) setLoading(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Great';
      case 5: return 'Excellent';
      default: return 'Rate Service';
    }
  };

  return (
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.appBarInner}>
          <TouchableOpacity style={styles.appBarBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Rate Your Service</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBlock} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Service Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryImgClip}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' }} 
              style={styles.summaryImg} 
            />
          </View>
          <View style={styles.summaryDetails}>
            <Text style={styles.serviceName}>Deep Home Cleaning</Text>
            <Text style={styles.providerName}>Sparkle Pro Cleaning</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={12} color="#57657a" />
              <Text style={styles.dateTxt}>OCT 24, 2023</Text>
            </View>
          </View>
        </View>

        {/* Rating Block */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingMainTitle}>How was your experience?</Text>
          <Text style={styles.ratingSubTitle}>Your feedback helps our professionals improve.</Text>
          
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <TouchableOpacity
                key={starIndex}
                activeOpacity={0.7}
                onPress={() => setRating(starIndex)}
              >
                <Ionicons 
                  name={starIndex <= rating ? "star" : "star-outline"} 
                  size={42} 
                  color={starIndex <= rating ? "#003a55" : Colors.dark.border} 
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating Pill Label */}
          <View style={[styles.ratingPillBox, rating ? { backgroundColor: 'rgba(27, 169, 237, 0.1)' } : {}]}>
            <Text style={[styles.ratingPillTxt, rating ? { color: Colors.primary } : {}]}>
              {getRatingLabel(rating)}
            </Text>
          </View>
        </View>

        {/* Input Details */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Detailed Review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about your experience..."
            placeholderTextColor={Colors.dark.textMuted}
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Photo Upload Elements (Mockup UI implementation) */}
        <View style={styles.photoSection}>
          <View style={styles.photoHeaderRow}>
            <Text style={styles.sectionTitle}>Work Evidence</Text>
            <Text style={styles.photoReqTxt}>Optional • Up to 4 photos</Text>
          </View>
          
          <View style={styles.photoGrid}>
            <View style={styles.photoWrap}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=200' }} style={styles.photoItemImg} />
              <TouchableOpacity style={styles.photoCloseBtn}>
                <Ionicons name="close" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.photoWrap}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200' }} style={styles.photoItemImg} />
              <TouchableOpacity style={styles.photoCloseBtn}>
                <Ionicons name="close" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addPhotoBtn}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
              <Text style={styles.addPhotoTxt}>Add Photo</Text>
            </TouchableOpacity>
            <View style={styles.emptyPhotoBox}>
              <Ionicons name="image-outline" size={24} color={Colors.dark.border} />
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Bottom Navigator Actions */}
      <View style={styles.fixedBottomDock}>
        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.submitBtnTxt}>Submit Review</Text>
              <Ionicons name="send" size={18} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  topAppBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.dark.bg, zIndex: 100
  },
  appBarInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  appBarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollBlock: { paddingHorizontal: Spacing.lg, paddingBottom: 150, paddingTop: 10 },

  // Summary
  summaryCard: { backgroundColor: Colors.dark.cardAlt, padding: Spacing.md, borderRadius: Radius.xl, flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3, borderWidth: 1, borderColor: Colors.dark.border },
  summaryImgClip: { width: 64, height: 64, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: Colors.dark.surface },
  summaryImg: { width: '100%', height: '100%' },
  summaryDetails: { flex: 1, justifyContent: 'center' },
  serviceName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, lineHeight: 22 },
  providerName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  dateTxt: { fontSize: 9, fontWeight: '800', color: '#57657a', letterSpacing: 1 },

  // Rating Layer
  ratingSection: { alignItems: 'center', marginBottom: 35 },
  ratingMainTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 6 },
  ratingSubTitle: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: Spacing.xl },
  starsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  ratingPillBox: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.dark.surface },
  ratingPillTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.textMuted },

  // Input
  inputSection: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginBottom: 12 },
  textArea: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, color: Colors.dark.text, fontSize: FontSize.md, minHeight: 130, textAlignVertical: 'top', borderWidth: 1, borderColor: 'transparent' },

  // Photos Block
  photoSection: { marginBottom: Spacing.xl },
  photoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  photoReqTxt: { fontSize: 11, fontWeight: '600', color: Colors.dark.textMuted, marginBottom: 2 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoWrap: { width: '48%', aspectRatio: 1, borderRadius: Radius.xl, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: Colors.dark.border },
  photoItemImg: { width: '100%', height: '100%', opacity: 0.9 },
  photoCloseBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  addPhotoBtn: { width: '48%', aspectRatio: 1, borderRadius: Radius.xl, backgroundColor: Colors.dark.card, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  addPhotoTxt: { fontSize: 11, fontWeight: '700', color: Colors.dark.textSub },
  emptyPhotoBox: { width: '48%', aspectRatio: 1, borderRadius: Radius.xl, backgroundColor: Colors.dark.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center', opacity: 0.4 },

  // Float Nav Action
  fixedBottomDock: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderTopWidth: 1, borderTopColor: Colors.dark.border, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 30, zIndex: 100 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.full, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 5 },
  submitBtnDisabled: { opacity: 0.8 },
  submitBtnTxt: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },
});
