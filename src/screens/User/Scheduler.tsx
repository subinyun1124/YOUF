import React, {useEffect, useState} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
interface TimerSettingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string, days: string[]) => void;
  initialTime?: string;
  initialDays?: string[];
}

const Scheduler = ({
  visible,
  onClose,
  onConfirm,
  initialTime,
  initialDays,
}: TimerSettingModalProps) => {
  const [date, setDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedButton, setSelectedButton] = useState<
    'cancel' | 'confirm' | null
  >(null);

  useEffect(() => {
    if (visible && initialTime) {
      const [hour, minute] = initialTime.split(':');
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      setDate(date);
    }
    if (visible && initialDays) {
      setSelectedDays(initialDays);
    }
  }, [visible, initialTime, initialDays]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleButtonPress = (button: 'cancel' | 'confirm') => {
    setSelectedButton(button);
    setTimeout(() => {
      setSelectedButton(null);
    });

    if (button === 'confirm') {
      confirmHandler();
    } else {
      onClose();
    }
  };

  const confirmHandler = () => {
    const time = `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    onConfirm(time, selectedDays);
    onClose(); // 설정 후 모달을 닫습니다.
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>알림 시간 설정</Text>

          {/* 시간 선택기 */}
          <View style={styles.timePickerWrapper}>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}>
              <Text style={styles.timeText}>
                {`${date.getHours().toString().padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="spinner"
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setShowTimePicker(false); // 시간을 선택하면 시간 피커 닫기
                  }
                }}
                style={styles.picker}
              />
            )}
          </View>

          {/* 요일 선택 */}
          <Text style={styles.subtitle}>반복 요일</Text>
          <View style={styles.daysRow}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.day,
                  selectedDays.includes(day) && styles.daySelected,
                ]}
                onPress={() => toggleDay(day)}>
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day) && styles.dayTextSelected,
                  ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 버튼 */}
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => handleButtonPress('cancel')}
              style={[
                styles.cancel,
                selectedButton === 'cancel' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.cancelText,
                  selectedButton === 'cancel' && styles.cancelTextPressed,
                ]}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleButtonPress('confirm')}
              style={[
                styles.confirm,
                selectedButton === 'confirm' && styles.buttonPressed,
              ]}>
              <Text
                style={[
                  styles.confirmText,
                  selectedButton === 'confirm' && styles.confirmTextPressed,
                ]}>
                설정
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '88%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: '600',
    color: '#111',
  },
  timePickerWrapper: {
    width: '100%',
    marginVertical: 12,
    alignItems: 'center',
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 18,
    color: '#111',
    fontWeight: '500',
  },
  picker: {
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#222',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  day: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 2,
    flexShrink: 1,
  },
  daySelected: {
    backgroundColor: '#111', // 블랙 강조
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirm: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#111', // 블랙 강조
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  cancelText: {
    fontSize: 16,
    color: '#555',
  },
  cancelTextPressed: {
    color: '#111',
  },
  confirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  confirmTextPressed: {
    color: '#fff',
    opacity: 0.8,
  },
});

export default Scheduler;
