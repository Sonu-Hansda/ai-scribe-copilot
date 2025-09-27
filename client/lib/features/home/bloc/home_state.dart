part of 'home_bloc.dart';

class HomeState extends Equatable {
  final List<HomeScreenListItem> all;
  final List<HomeScreenListItem> filtered;
  final String query;

  const HomeState({
    this.all = const [],
    this.filtered = const [],
    this.query = '',
  });

  HomeState copyWith({
    List<HomeScreenListItem>? all,
    List<HomeScreenListItem>? filtered,
    String? query,
  }) {
    return HomeState(
      all: all ?? this.all,
      filtered: filtered ?? this.filtered,
      query: query ?? this.query,
    );
  }

  @override
  List<Object> get props => [all, filtered, query];
}
