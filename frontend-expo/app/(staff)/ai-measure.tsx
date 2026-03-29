import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function StaffAIMeasure() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId?: string }>();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    area_m2: number;
    pixel_area: number;
    confidence: number;
    processedAt: string;
  } | null>(null);

  const analyzeWall = async () => {
    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter an image URL or upload an image');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await apiClient.post('/api/ai/analyze-wall', { imageUrl });
      setResult(res.data);
    } catch (err: any) {
      Alert.alert('Analysis Failed', err.response?.data?.error || 'Could not analyze the image. Please try a clearer photo.');
    } finally {
      setLoading(false);
    }
  };

  const getCostEstimate = (area: number) => {
    // Simple cost estimate: $5 per m²
    return (area * 5).toFixed(2);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.85) return Colors.success;
    if (conf >= 0.6) return Colors.warning;
    return Colors.danger;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>AI Wall Measurement</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>📏</Text>
          </View>
          <Text style={styles.heroTitle}>Wall Area Estimator</Text>
          <Text style={styles.heroSub}>Upload a photo of a wall to get instant area measurement powered by AI (YOLOv8)</Text>
        </View>

        {/* Upload Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸 Image Input</Text>
          <Text style={styles.inputLabel}>Image URL</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/wall-photo.jpg"
              placeholderTextColor={Colors.dark.textMuted}
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.uploadBtn} onPress={() => Alert.alert('Coming Soon', 'Camera upload will be available soon!')}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadBtnText}>Take Photo / Upload from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>📝 Tips for best results</Text>
          {['Take photo straight-on, not at an angle', 'Make sure the full wall is visible', 'Good lighting gives more accurate results', 'Include a reference object for scale'].map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Text style={styles.tipDot}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
          onPress={analyzeWall}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.analyzeBtnText}>Analyzing...</Text>
            </View>
          ) : (
            <Text style={styles.analyzeBtnText}>Analyze Wall</Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>📊 Analysis Results</Text>
            <View style={styles.resultGrid}>
              <View style={styles.resultItem}>
                <Text style={styles.resultValue}>{result.area_m2.toFixed(2)} m²</Text>
                <Text style={styles.resultLabel}>Estimated Area</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={[styles.resultValue, { color: getConfidenceColor(result.confidence) }]}>
                  {(result.confidence * 100).toFixed(0)}%
                </Text>
                <Text style={styles.resultLabel}>Confidence</Text>
              </View>
            </View>

            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, {
                width: `${result.confidence * 100}%` as any,
                backgroundColor: getConfidenceColor(result.confidence),
              }]} />
            </View>

            <View style={styles.costEstimate}>
              <Text style={styles.costLabel}>💰 Suggested Cost</Text>
              <Text style={styles.costValue}>${getCostEstimate(result.area_m2)}</Text>
              <Text style={styles.costNote}>Based on $5/m² (adjust to your pricing)</Text>
            </View>

            <Text style={styles.processedAt}>
              Analyzed at {new Date(result.processedAt).toLocaleString()}
            </Text>

            {/* Save to Job — only shown when invoked from Job Execution */}
            {jobId && (
              <TouchableOpacity
                style={styles.saveJobBtn}
                onPress={() => router.push({ pathname: '/(staff)/job/execute', params: { id: jobId } })}
              >
                <Text style={styles.saveJobBtnTxt}>✅  Save to Job #{jobId.slice(-6).toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  backText: { fontSize: 24, color: Colors.dark.text },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text },
  scroll: { padding: Spacing.lg },
  hero: { alignItems: 'center', paddingVertical: Spacing.xl },
  heroIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: `${Colors.primary}22`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.dark.text, marginBottom: 6 },
  heroSub: { fontSize: FontSize.sm, color: Colors.dark.textSub, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: Colors.dark.card, borderRadius: Radius.xl, borderWidth: 1,
    borderColor: Colors.dark.border, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.dark.text, marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    backgroundColor: Colors.dark.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.dark.border, paddingHorizontal: Spacing.md,
  },
  urlInput: { paddingVertical: 13, fontSize: FontSize.md, color: Colors.dark.text },
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
  orText: { color: Colors.dark.textMuted, paddingHorizontal: Spacing.sm, fontSize: FontSize.sm },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 2, borderColor: Colors.dark.border, borderStyle: 'dashed',
    borderRadius: Radius.md, paddingVertical: Spacing.lg, backgroundColor: Colors.dark.surface,
  },
  uploadIcon: { fontSize: 24 },
  uploadBtnText: { fontSize: FontSize.md, color: Colors.dark.textSub, fontWeight: '600' },
  tips: { backgroundColor: Colors.dark.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.md, marginBottom: Spacing.md },
  tipsTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text, marginBottom: Spacing.sm },
  tipRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  tipDot: { color: Colors.primary, fontSize: FontSize.sm },
  tipText: { color: Colors.dark.textSub, fontSize: FontSize.sm, flex: 1 },
  analyzeBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16,
    alignItems: 'center', marginBottom: Spacing.md,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  analyzeBtnDisabled: { opacity: 0.7 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  analyzeBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  resultsCard: {
    backgroundColor: Colors.dark.card, borderRadius: Radius.xl, borderWidth: 1,
    borderColor: Colors.primary, padding: Spacing.lg,
  },
  resultsTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text, marginBottom: Spacing.lg },
  resultGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  resultItem: {
    flex: 1, backgroundColor: Colors.dark.surface, borderRadius: Radius.md,
    padding: Spacing.md, alignItems: 'center',
  },
  resultValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  resultLabel: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  confidenceBar: { height: 6, backgroundColor: Colors.dark.border, borderRadius: 3, marginBottom: Spacing.md },
  confidenceFill: { height: 6, borderRadius: 3 },
  costEstimate: {
    backgroundColor: `${Colors.accent}15`, borderRadius: Radius.md, padding: Spacing.md,
    alignItems: 'center', marginBottom: Spacing.sm,
  },
  costLabel: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: 4 },
  costValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.accent },
  costNote: { fontSize: FontSize.xs, color: Colors.dark.textMuted, marginTop: 4 },
  processedAt: { fontSize: FontSize.xs, color: Colors.dark.textMuted, textAlign: 'center', marginBottom: Spacing.md },
  saveJobBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 14,
    alignItems: 'center', marginTop: Spacing.sm,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  saveJobBtnTxt: { color: '#FFF', fontWeight: '800', fontSize: FontSize.md },
});
