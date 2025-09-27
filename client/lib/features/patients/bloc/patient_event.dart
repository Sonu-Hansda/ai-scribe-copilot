part of 'patient_bloc.dart';

abstract class PatientEvent extends Equatable {
  const PatientEvent();

  @override
  List<Object> get props => [];
}

class LoadPatients extends PatientEvent {}

class AddPatient extends PatientEvent {
  final Patient patient;

  const AddPatient(this.patient);

  @override
  List<Object> get props => [patient];
}

class UpdatePatient extends PatientEvent {
  final Patient patient;

  const UpdatePatient(this.patient);

  @override
  List<Object> get props => [patient];
}

class DeletePatient extends PatientEvent {
  final Patient patient;

  const DeletePatient(this.patient);

  @override
  List<Object> get props => [patient];
}
