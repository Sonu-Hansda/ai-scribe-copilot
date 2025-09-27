part of 'session_bloc.dart';

abstract class SessionEvent extends Equatable {
  const SessionEvent();

  @override
  List<Object> get props => [];
}

class LoadSessions extends SessionEvent {}

class DeleteSession extends SessionEvent {
  final Session session;

  const DeleteSession(this.session);

  @override
  List<Object> get props => [session];
}
