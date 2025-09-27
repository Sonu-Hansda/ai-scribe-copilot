import 'package:equatable/equatable.dart';
import 'package:ai_scribe_copilot/features/home/model/home_screen_list_item.dart';
import 'package:ai_scribe_copilot/features/patients/model/patient.dart';
import 'package:ai_scribe_copilot/features/sessions/model/session.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc() : super(const HomeState()) {
    on<LoadHome>(_onLoadHome);
    on<SearchQueryChanged>(_onSearchQueryChanged);
  }

  void _onLoadHome(LoadHome event, Emitter<HomeState> emit) {
    final patients = [
      Patient(
        name: 'John Doe',
        phoneNumber: '1234567890',
        age: 30,
        sex: 'Male',
      ),
      Patient(
        name: 'Jane Smith',
        phoneNumber: '0987654321',
        age: 25,
        sex: 'Female',
      ),
    ];
    final sessions = [
      Session(
        title: 'Eye Checkup',
        category: 'Ophthalmology',
        dateTime: DateTime.now(),
        patient: patients[0],
        recordingDuration: const Duration(minutes: 15),
      ),
      Session(
        title: 'Dental Cleaning',
        category: 'Dentistry',
        dateTime: DateTime.now().subtract(const Duration(days: 2)),
        patient: patients[1],
        recordingDuration: const Duration(minutes: 20),
      ),
    ];
    final mixedList = [...patients, ...sessions]..shuffle();
    emit(state.copyWith(all: mixedList, filtered: mixedList));
  }

  void _onSearchQueryChanged(
    SearchQueryChanged event,
    Emitter<HomeState> emit,
  ) {
    final filtered = state.all.where((item) {
      if (item is Patient) {
        return item.name.toLowerCase().contains(event.query.toLowerCase());
      } else if (item is Session) {
        return item.title.toLowerCase().contains(event.query.toLowerCase()) ||
            item.patient.name.toLowerCase().contains(event.query.toLowerCase());
      }
      return false;
    }).toList();
    emit(state.copyWith(filtered: filtered, query: event.query));
  }
}
