CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       TEXT UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patients (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    pronouns    TEXT,
    email       TEXT,
    background  TEXT,
    medical_history TEXT,
    family_history  TEXT,
    social_history  TEXT,
    previous_treatment TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recording_sessions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id    UUID REFERENCES patients(id) ON DELETE CASCADE,
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_name  TEXT,
    status        TEXT CHECK (status IN ('recording','completed','failed')),
    start_time    TIMESTAMPTZ,
    end_time      TIMESTAMPTZ,
    template_id   TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audio_chunks (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id    UUID REFERENCES recording_sessions(id) ON DELETE CASCADE,
    chunk_number  INTEGER NOT NULL,
    gcs_path      TEXT NOT NULL,
    public_url    TEXT,
    mime_type     TEXT,
    uploaded_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, chunk_number)
);

CREATE TABLE templates (
    id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type  TEXT CHECK (type IN ('default','predefined','custom')),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- seed a dummy user so the first call works
INSERT INTO users (id, email) VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'doctor@demo.com');
INSERT INTO templates (title, type, user_id)
VALUES
  ('New Patient Visit','default','a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('Follow-up Visit','predefined','a1b2c3d4-e5f6-7890-abcd-ef1234567890');