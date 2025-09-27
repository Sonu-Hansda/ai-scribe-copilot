import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/patient_bloc.dart';
import '../model/patient.dart';
import '../ui/edit_patient_screen.dart';

void showPatientDetailsDialog(BuildContext context, Patient patient) {
  showDialog(
    context: context,
    builder: (BuildContext dialogContext) {
      return AlertDialog(
        title: Text(patient.name),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Phone: ${patient.phoneNumber}'),
            Text('Age: ${patient.age}'),
            Text('Sex: ${patient.sex}'),
            if (patient.address != null && patient.address!.isNotEmpty)
              Text('Address: ${patient.address}'),
          ],
        ),
        actions: [
          TextButton(
            child: const Text('Delete'),
            onPressed: () {
              context.read<PatientBloc>().add(DeletePatient(patient));
              Navigator.of(dialogContext).pop();
            },
          ),
          TextButton(
            child: const Text('Edit'),
            onPressed: () {
              Navigator.of(dialogContext).pop();
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => EditPatientScreen(patient: patient),
                ),
              );
            },
          ),
        ],
      );
    },
  );
}
