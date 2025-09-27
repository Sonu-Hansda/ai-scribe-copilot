import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../model/patient.dart';

part 'patient_event.dart';
part 'patient_state.dart';

class PatientBloc extends Bloc<PatientEvent, PatientState> {
  PatientBloc() : super(PatientInitial()) {
    on<LoadPatients>(_onLoadPatients);
    on<AddPatient>(_onAddPatient);
    on<UpdatePatient>(_onUpdatePatient);
    on<DeletePatient>(_onDeletePatient);
  }

  final List<Patient> _patients = [
    Patient(name: 'John Doe', phoneNumber: '1234567890', age: 30, sex: 'Male'),
    Patient(
      name: 'Jane Smith',
      phoneNumber: '0987654321',
      age: 25,
      sex: 'Female',
    ),
  ];

  void _onLoadPatients(LoadPatients event, Emitter<PatientState> emit) {
    emit(PatientLoading());
    emit(PatientLoaded(List.from(_patients)));
  }

  void _onAddPatient(AddPatient event, Emitter<PatientState> emit) {
    emit(PatientLoading());
    _patients.add(event.patient);
    emit(PatientLoaded(List.from(_patients)));
  }

  void _onUpdatePatient(UpdatePatient event, Emitter<PatientState> emit) {
    emit(PatientLoading());
    final index = _patients.indexWhere(
      (p) => p.phoneNumber == event.patient.phoneNumber,
    );
    if (index != -1) {
      _patients[index] = event.patient;
    }
    emit(PatientLoaded(List.from(_patients)));
  }

  void _onDeletePatient(DeletePatient event, Emitter<PatientState> emit) {
    emit(PatientLoading());
    _patients.removeWhere((p) => p.phoneNumber == event.patient.phoneNumber);
    emit(PatientLoaded(List.from(_patients)));
  }
}
