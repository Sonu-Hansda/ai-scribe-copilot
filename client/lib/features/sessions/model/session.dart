import '../../home/model/home_screen_list_item.dart';
import '../../patients/model/patient.dart';

class Session extends HomeScreenListItem {
  final String title;
  final String category;
  final DateTime dateTime;
  final Patient patient;
  final String? recordingDataUrl;
  final String? recordingTranscription;
  final Duration recordingDuration;

  Session({
    required this.title,
    required this.category,
    required this.dateTime,
    required this.patient,
    this.recordingDataUrl,
    this.recordingTranscription,
    required this.recordingDuration,
  });
}
