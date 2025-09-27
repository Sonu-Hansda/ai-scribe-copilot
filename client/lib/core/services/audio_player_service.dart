import 'package:audioplayers/audioplayers.dart';
import 'package:audio_waveforms/audio_waveforms.dart' hide PlayerState;

class AudioPlayerService {
  final AudioPlayer audioPlayer = AudioPlayer();
  final PlayerController playerController = PlayerController();

  Stream<PlayerState> get onPlayerStateChanged =>
      audioPlayer.onPlayerStateChanged;

  Future<void> play(String url) async {
    await audioPlayer.play(UrlSource(url));
  }

  Future<void> pause() async {
    await audioPlayer.pause();
  }

  Future<void> seek(Duration position) async {
    await audioPlayer.seek(position);
  }

  void dispose() {
    audioPlayer.dispose();
    playerController.dispose();
  }
}
