import '../../home/model/home_screen_list_item.dart';

class Patient extends HomeScreenListItem {
  final String name;
  final String phoneNumber;
  final int age;
  final String sex;
  final String? photoUrl;
  final String? address;

  Patient({
    required this.name,
    required this.phoneNumber,
    required this.age,
    required this.sex,
    this.photoUrl,
    this.address,
  });
}
