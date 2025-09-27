import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:audio_waveforms/audio_waveforms.dart' hide PlayerState;
import '../../../core/services/audio_player_service.dart';
import '../../../widgets/primary_button.dart';
import '../bloc/session_bloc.dart';
import '../model/session.dart';

class SessionDetailsScreen extends StatefulWidget {
  final Session session;
  const SessionDetailsScreen({super.key, required this.session});

  @override
  State<SessionDetailsScreen> createState() => _SessionDetailsScreenState();
}

class _SessionDetailsScreenState extends State<SessionDetailsScreen> {
  bool _showTranscription = false;
  late final AudioPlayerService _audioPlayerService;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _audioPlayerService = AudioPlayerService();
    _audioPlayerService.onPlayerStateChanged.listen((state) {
      setState(() {
        _isPlaying = state == PlayerState.playing;
      });
    });
  }

  @override
  void dispose() {
    _audioPlayerService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: Text(widget.session.title)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPatientDetails(textTheme),
            const SizedBox(height: 24),
            _buildAudioPlayer(),
            const SizedBox(height: 24),
            _buildTranscriptionToggle(),
            if (_showTranscription) _buildTranscription(),
            const Spacer(),
            PrimaryButton(
              text: 'Delete Session',
              onPressed: () {
                context.read<SessionBloc>().add(DeleteSession(widget.session));
                Navigator.pop(context);
              },
              color: Colors.red,
              isFullWidth: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPatientDetails(TextTheme textTheme) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Patient Details', style: textTheme.titleLarge),
            const Divider(),
            Text('Name: ${widget.session.patient.name}'),
            Text('Age: ${widget.session.patient.age}'),
            Text('Sex: ${widget.session.patient.sex}'),
          ],
        ),
      ),
    );
  }

  Widget _buildAudioPlayer() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            IconButton(
              icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
              onPressed: () {
                if (_isPlaying) {
                  _audioPlayerService.pause();
                } else {
                  _audioPlayerService.play(
                    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                  );
                }
              },
            ),
            Expanded(
              child: AudioFileWaveforms(
                size: const Size(double.infinity, 70.0),
                playerController: _audioPlayerService.playerController,
                enableSeekGesture: true,
                waveformType: WaveformType.long,
                playerWaveStyle: const PlayerWaveStyle(
                  fixedWaveColor: Colors.white54,
                  liveWaveColor: Colors.white,
                  spacing: 6,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTranscriptionToggle() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Show Transcription'),
        Switch(
          value: _showTranscription,
          onChanged: (value) {
            setState(() {
              _showTranscription = value;
            });
          },
        ),
      ],
    );
  }

  Widget _buildTranscription() {
    return Container(
      padding: const EdgeInsets.all(12.0),
      color: Colors.grey[200],
      child: Text(
        widget.session.recordingTranscription ?? 'No transcription available.',
      ),
    );
  }
}
