import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity,
  Image, Alert, ActivityIndicator, Platform, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Countertop Sanitization', done: true },
  { id: '2', label: 'Floor Deep Scrub', done: false },
  { id: '3', label: 'Range Hood Degreasing', done: false },
];

const MOCK_JOB = {
  id: 'mock-8829',
  service: { name: 'Deep Kitchen Cleaning' },
  serviceRefId: '#BK-8829',
};

export default function JobExecuteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  // Live timer state
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id || id.startsWith('mock')) {
        setJob(MOCK_JOB);
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get(`/api/staff/bookings/${id}`);
        setJob(res.data?.booking ?? MOCK_JOB);
      } catch {
        setJob(MOCK_JOB);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Start timer
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const toggleChecklist = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i))
    );
  };

  const doneCount = checklist.filter((c) => c.done).length;

  const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');

  const handleComplete = async () => {
    Alert.alert(
      'Complete Job',
      'Are you sure you want to mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: async () => {
            setCompleting(true);
            try {
              if (!id?.startsWith('mock')) {
                await apiClient.patch(`/api/staff/bookings/${id}/status`, { status: 'completed' });
              }
              if (timerRef.current) clearInterval(timerRef.current);
              router.replace('/(staff)/dashboard');
            } catch {
              Alert.alert('Error', 'Could not complete job');
            } finally {
              setCompleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  const serviceName = job?.service?.name || 'Service';
  const serviceRef = job?.serviceRefId || (id?.startsWith('mock') ? '#BK-8829' : `#BK-${id?.slice(-4).toUpperCase()}`);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Job</Text>
        <View style={{ width: 40 }} />
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Live Timer */}
        <View style={styles.timerRow}>
          {[
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
            { value: seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <View key={label} style={styles.timerBlock}>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{value}</Text>
              </View>
              <Text style={styles.timerLabel}>{label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Job Info Summary */}
        <View style={styles.jobSummaryCard}>
          <View style={styles.jobSummaryIcon}>
            <Ionicons name="briefcase" size={24} color="#57657a" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobSummaryName} numberOfLines={1}>{serviceName}</Text>
            <Text style={styles.jobSummaryRef}>Service ID {serviceRef}</Text>
          </View>
        </View>

        {/* Task Checklist */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Task Checklist</Text>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillTxt}>{doneCount}/{checklist.length} Done</Text>
            </View>
          </View>

          <View style={styles.checklistCard}>
            {checklist.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.checklistRow,
                  index < checklist.length - 1 && styles.checklistRowBorder,
                ]}
                onPress={() => toggleChecklist(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                  {item.done && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </View>
                <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Evidence Capture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before &amp; After Evidence</Text>
          <View style={styles.evidenceGrid}>
            <TouchableOpacity
              style={styles.evidenceSlot}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Camera', 'Photo capture requires camera permissions in a development build.')}
            >
              {beforePhoto ? (
                <Image source={{ uri: beforePhoto }} style={styles.evidenceImg} />
              ) : (
                <>
                  <Ionicons name="camera" size={32} color="#74777f" />
                  <Text style={styles.evidenceSlotTxt}>Upload Before</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.evidenceSlot}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Camera', 'Photo capture requires camera permissions in a development build.')}
            >
              {afterPhoto ? (
                <Image source={{ uri: afterPhoto }} style={styles.evidenceImg} />
              ) : (
                <>
                  <Ionicons name="camera" size={32} color="#74777f" />
                  <Text style={styles.evidenceSlotTxt}>Upload After</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Client Confirmation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Confirmation</Text>
          <View style={styles.signatureCard}>
            <View style={styles.signaturePad}>
              <Text style={styles.signaturePlaceholder}>DIGITAL SIGNATURE AREA</Text>
              <TouchableOpacity style={styles.clearBtn}>
                <Ionicons name="refresh" size={12} color={Colors.primary} />
                <Text style={styles.clearBtnTxt}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.signatoryRow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80' }}
                style={styles.signatoryAvatar}
              />
              <View>
                <Text style={styles.signatoryName}>Mrs. Sarah Jenkins</Text>
                <Text style={styles.signatoryRole}>Authorized Signatory</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <BlurView intensity={80} tint="dark" style={styles.stickyBottom}>
        {/* Secondary: Need Measurement */}
        <TouchableOpacity
          style={styles.measureBtn}
          onPress={() => router.push({ pathname: '/(staff)/ai-measure', params: { jobId: id } })}
        >
          <Ionicons name="scan" size={18} color={Colors.primary} />
          <Text style={styles.measureBtnTxt}>Need Measurement</Text>
        </TouchableOpacity>

        {/* Primary: Complete Job */}
        <Pressable
          onPress={handleComplete}
          disabled={completing}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.completeBtn, pressed && styles.completeBtnPressed]}
            >
              {completing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="finger-print" size={24} color="#FFF" />
                  <Text style={styles.completeBtnTxt}>Complete Job</Text>
                </>
              )}
            </LinearGradient>
          )}
        </Pressable>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: 'rgba(15, 15, 27, 0.7)',
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },

  scrollContent: { paddingBottom: Spacing.xxl + 40 },

  // Timer
  timerRow: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.lg },
  timerBlock: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  timerBox: { width: '100%', height: 56, backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.dark.border },
  timerValue: { fontSize: 26, fontWeight: '800', color: Colors.primary, letterSpacing: -1 },
  timerLabel: { fontSize: 9, fontWeight: '700', color: Colors.dark.textMuted, letterSpacing: 1.5 },

  // Job Summary
  jobSummaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.dark.surface, marginHorizontal: Spacing.md, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2,
  },
  jobSummaryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(108, 99, 255, 0.15)', alignItems: 'center', justifyContent: 'center' },
  jobSummaryName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  jobSummaryRef: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 2 },

  // Sections
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3, marginBottom: Spacing.md },
  progressPill: { backgroundColor: 'rgba(213,227,252,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.lg },
  progressPillTxt: { fontSize: 11, fontWeight: '800', color: Colors.primary },

  // Checklist
  checklistCard: { backgroundColor: Colors.dark.surface, borderRadius: Radius.xl, overflow: 'hidden' },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: 16, backgroundColor: Colors.dark.cardAlt },
  checklistRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checklistLabel: { fontSize: FontSize.md, fontWeight: '500', color: Colors.dark.text, flex: 1 },
  checklistLabelDone: { color: Colors.dark.textMuted, textDecorationLine: 'line-through' },

  // Evidence Grid
  evidenceGrid: { flexDirection: 'row', gap: Spacing.md },
  evidenceSlot: {
    flex: 1, aspectRatio: 1, borderRadius: Radius.xl, borderWidth: 2, borderStyle: 'dashed',
    borderColor: Colors.dark.border, backgroundColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  evidenceImg: { width: '100%', height: '100%', borderRadius: Radius.xl },
  evidenceSlotTxt: { fontSize: FontSize.xs, color: Colors.dark.textMuted, fontWeight: '600' },

  // Signature
  signatureCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  signaturePad: {
    width: '100%', height: 160, borderRadius: Radius.lg, backgroundColor: Colors.dark.surface,
    alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
  },
  signaturePlaceholder: { fontSize: 10, fontWeight: '700', color: Colors.dark.border, letterSpacing: 2 },
  clearBtn: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.dark.cardAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 1 },
  clearBtnTxt: { fontSize: 11, fontWeight: '700', color: Colors.primaryLight },
  signatoryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md },
  signatoryAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface },
  signatoryName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  signatoryRole: { fontSize: 11, color: Colors.dark.textSub, marginTop: 1 },

  // Sticky Bottom
  stickyBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, gap: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing.md,
    backgroundColor: 'rgba(15, 15, 27, 0.85)',
  },
  measureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', height: 48, borderRadius: Radius.full,
  },
  measureBtnTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primaryLight },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    height: 64, borderRadius: Radius.full,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  completeBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  completeBtnTxt: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFF', letterSpacing: -0.3 },
});
