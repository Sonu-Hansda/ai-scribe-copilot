class SessionSummary {
  final String patient;
  final DateTime date;
  final Duration duration;
  final String? transcriptPreview;
  final String status; // "Uploaded" | "Queued" | "Uploading"

  SessionSummary({
    required this.patient,
    required this.date,
    required this.duration,
    this.transcriptPreview,
    this.status = "Uploaded",
  });
}
