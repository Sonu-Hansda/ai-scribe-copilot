import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../model/session.dart';
import '../../patients/model/patient.dart';

part 'session_event.dart';
part 'session_state.dart';

class SessionBloc extends Bloc<SessionEvent, SessionState> {
  SessionBloc() : super(SessionInitial()) {
    on<LoadSessions>(_onLoadSessions);
    on<DeleteSession>(_onDeleteSession);
  }

  void _onLoadSessions(LoadSessions event, Emitter<SessionState> emit) {
    final sessions = [
      Session(
        title: 'Eye Checkup',
        category: 'Ophthalmology',
        dateTime: DateTime.now(),
        patient: Patient(
          name: 'John Doe',
          phoneNumber: '1234567890',
          age: 30,
          sex: 'Male',
        ),
        recordingDuration: const Duration(minutes: 15),
      ),
      Session(
        title: 'Dental Cleaning',
        category: 'Dentistry',
        dateTime: DateTime.now().subtract(const Duration(days: 2)),
        patient: Patient(
          name: 'Jane Smith',
          phoneNumber: '0987654321',
          age: 25,
          sex: 'Female',
        ),
        recordingDuration: const Duration(minutes: 20),
      ),
    ];
    emit(SessionLoaded(sessions));
  }

  void _onDeleteSession(DeleteSession event, Emitter<SessionState> emit) {
    final currentState = state;
    if (currentState is SessionLoaded) {
      final updatedSessions = List<Session>.from(currentState.sessions)
        ..remove(event.session);
      emit(SessionLoaded(updatedSessions));
    }
  }
}
