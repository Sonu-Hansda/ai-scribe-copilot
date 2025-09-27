import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/home_bloc.dart';
import '../widgets/home_top_bar.dart';
import '../widgets/home_search_bar.dart';
import '../widgets/action_card.dart';
import '../../../widgets/patient_or_session_tile.dart';
import '../../patients/model/patient.dart';
import '../../patients/ui/add_patient_screen.dart';
import '../../patients/ui/manage_patient_screen.dart';
import '../../patients/widgets/patient_details_dialog.dart';
import '../../sessions/model/session.dart';
import '../../sessions/ui/manage_sessions_screen.dart';
import '../../sessions/ui/session_details_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => HomeBloc()..add(LoadHome()),
      child: Builder(
        builder: (context) {
          final scheme = Theme.of(context).colorScheme;
          return Scaffold(
            backgroundColor: scheme.surface,
            body: SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  HomeTopBar(onSettings: () {}),
                  HomeSearchBar(
                    controller: TextEditingController(),
                    onChanged: (query) {
                      context.read<HomeBloc>().add(SearchQueryChanged(query));
                    },
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: ActionCard(
                                icon: Icons.add_circle,
                                label: 'New Session',
                                onTap: () {},
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ActionCard(
                                icon: Icons.person_add,
                                label: 'Add Patient',
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => const AddPatientScreen(),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ActionCard(
                                icon: Icons.collections_bookmark,
                                label: 'Manage Sessions',
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          const ManageSessionsScreen(),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ActionCard(
                                icon: Icons.manage_accounts,
                                label: 'Manage Patients',
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          const ManagePatientScreen(),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Expanded(
                    child: BlocBuilder<HomeBloc, HomeState>(
                      builder: (context, state) {
                        return ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          itemCount: state.filtered.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 12),
                          itemBuilder: (context, i) {
                            final item = state.filtered[i];
                            if (item is Patient) {
                              return PatientOrSessionTile(
                                title: item.name,
                                subtitle: '${item.sex}, ${item.age} years old',
                                onTap: () {
                                  showPatientDetailsDialog(context, item);
                                },
                              );
                            } else if (item is Session) {
                              return PatientOrSessionTile(
                                title: item.title,
                                subtitle:
                                    "${item.patient.name}  •  ${_fmtDate(item.dateTime)}",
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          SessionDetailsScreen(session: item),
                                    ),
                                  );
                                },
                              );
                            }
                            return const SizedBox.shrink();
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _fmtDate(DateTime d) => "${_mon[d.month]} ${d.day}, ${d.year}";
  static const _mon = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
}
