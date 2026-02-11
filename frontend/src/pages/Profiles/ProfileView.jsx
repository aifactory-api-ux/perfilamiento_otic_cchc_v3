import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import useProfiles from '../../hooks/useProfiles.js';

export default function ProfileView() {
  const { id } = useParams();
  const { getProfile } = useProfiles();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile(id).then(setProfile);
  }, [getProfile, id]);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Typography variant="h4">{profile.name}</Typography>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>Email: {profile.email}</Typography>
            <Typography>Experiencia: {profile.experienceYears} anios</Typography>
            <Typography>Skills:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(profile.skills ?? []).map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </Stack>
            <Typography>Certificaciones:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(profile.certifications ?? []).map((cert) => (
                <Chip key={cert} label={cert} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
