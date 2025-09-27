import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../widgets/patient_or_session_tile.dart';
import '../bloc/session_bloc.dart';
import 'session_details_screen.dart';

class ManageSessionsScreen extends StatelessWidget {
  const ManageSessionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => SessionBloc()..add(LoadSessions()),
      child: Scaffold(
        appBar: AppBar(title: const Text('Manage Sessions')),
        body: BlocBuilder<SessionBloc, SessionState>(
          builder: (context, state) {
            if (state is SessionLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state is SessionLoaded) {
              return ListView.separated(
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                padding: const EdgeInsets.all(16.0),
                itemCount: state.sessions.length,
                itemBuilder: (context, index) {
                  final session = state.sessions[index];
                  return PatientOrSessionTile(
                    title: session.title,
                    subtitle: '${session.patient.name}  •  ${session.category}',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              SessionDetailsScreen(session: session),
                        ),
                      );
                    },
                  );
                },
              );
            }
            if (state is SessionError) {
              return Center(child: Text(state.message));
            }
            return const Center(child: Text('Something went wrong!'));
          },
        ),
      ),
    );
  }
}
