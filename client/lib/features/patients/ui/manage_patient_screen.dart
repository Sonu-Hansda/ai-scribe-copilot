import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../widgets/patient_or_session_tile.dart';
import '../bloc/patient_bloc.dart';
import '../widgets/patient_details_dialog.dart';

class ManagePatientScreen extends StatelessWidget {
  const ManagePatientScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => PatientBloc()..add(LoadPatients()),
      child: Scaffold(
        appBar: AppBar(title: const Text('Manage Patients')),
        body: BlocBuilder<PatientBloc, PatientState>(
          builder: (context, state) {
            if (state is PatientLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state is PatientLoaded) {
              return ListView.separated(
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                padding: const EdgeInsets.all(16.0),
                itemCount: state.patients.length,
                itemBuilder: (context, index) {
                  final patient = state.patients[index];
                  return PatientOrSessionTile(
                    title: patient.name,
                    subtitle: '${patient.sex}, ${patient.age} years old',
                    onTap: () {
                      showPatientDetailsDialog(context, patient);
                    },
                  );
                },
              );
            }
            if (state is PatientError) {
              return Center(child: Text(state.message));
            }
            return const Center(child: Text('Something went wrong!'));
          },
        ),
      ),
    );
  }
}
